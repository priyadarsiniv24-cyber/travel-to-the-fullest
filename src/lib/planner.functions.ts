import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { inferDestination } from "@/lib/destination-currency";

const promptSchema = z.object({
  prompt: z.string().trim().min(8).max(3000),
  /** Answers to follow-up questions, appended as extra context. */
  extra: z.string().trim().max(2000).nullable().optional(),
});

const ITEM_KINDS = ["activity", "meal", "stay", "transport", "flight", "note"] as const;
const EXPENSE_CATEGORIES = [
  "flights",
  "trains",
  "buses",
  "local_transport",
  "hotels",
  "food",
  "activities",
  "tickets",
  "shopping",
  "buffer",
  "other",
] as const;

const planSchema = z.object({
  needsMoreInfo: z.boolean().default(false),
  questions: z.array(z.string().max(200)).max(4).default([]),
  understood: z.object({
    title: z.string().max(120),
    origin: z.string().max(120),
    destination: z.string().max(160),
    country: z.string().max(80).nullable().default(null),
    currency: z.string().length(3).nullable().default(null),
    startDate: z.string().max(10).nullable().default(null),
    endDate: z.string().max(10).nullable().default(null),
    days: z.number().int().min(1).max(30).default(3),
    adults: z.number().int().min(1).max(30).default(1),
    children: z.number().int().min(0).max(20).default(0),
    budgetAmount: z.number().nonnegative().nullable().default(null),
    travelStyles: z.array(z.string().max(40)).max(10).default([]),
    interests: z.array(z.string().max(40)).max(15).default([]),
    foodPreferences: z.array(z.string().max(40)).max(10).default([]),
    accommodationPreference: z.string().max(60).nullable().default(null),
    transportationPreference: z.string().max(60).nullable().default(null),
    activityIntensity: z.enum(["relaxed", "balanced", "packed"]).default("balanced"),
    summary: z.string().max(700).default(""),
  }),
  days: z
    .array(
      z.object({
        dayIndex: z.number().int().min(1).max(30),
        location: z.string().max(120).default(""),
        notes: z.string().max(400).nullable().default(null),
        items: z
          .array(
            z.object({
              kind: z.enum(ITEM_KINDS).default("activity"),
              title: z.string().max(140),
              description: z.string().max(600).nullable().default(null),
              location: z.string().max(160).nullable().default(null),
              startTime: z.string().max(5).nullable().default(null),
              durationMinutes: z.number().int().min(0).max(900).nullable().default(null),
              travelMinutes: z.number().int().min(0).max(900).nullable().default(null),
              transportMode: z.string().max(40).nullable().default(null),
              estimatedCost: z.number().nonnegative().nullable().default(null),
              bestTime: z.string().max(160).nullable().default(null),
            }),
          )
          .max(14)
          .default([]),
      }),
    )
    .max(30)
    .default([]),
  budget: z
    .object({
      currency: z.string().length(3).nullable().default(null),
      lines: z
        .array(
          z.object({
            category: z.enum(EXPENSE_CATEGORIES),
            description: z.string().max(120).nullable().default(null),
            amount: z.number().nonnegative(),
          }),
        )
        .max(12)
        .default([]),
      totalLow: z.number().nonnegative().nullable().default(null),
      totalHigh: z.number().nonnegative().nullable().default(null),
      notes: z.string().max(400).nullable().default(null),
    })
    .default({ currency: null, lines: [], totalLow: null, totalHigh: null, notes: null }),
});

export type AiPlan = z.infer<typeof planSchema>;

const SYSTEM = `You are the planning engine of AeroTravel AI. You read a traveller's free-text request and return a realistic, geographically sensible day-by-day itinerary as STRICT JSON.

HARD RULES — the product's promise to users:
- NEVER invent airlines, flight numbers, fares, hotel names, restaurant names you are not confident exist, ratings, reviews, phone numbers, booking URLs or exact opening hours.
- Prefer well-known, real attractions and neighbourhoods. For meals, describe the AREA and cuisine ("dinner in Prenzlauer Berg — German/Turkish, mid-range") instead of naming a specific restaurant unless it is world-famous.
- Never state exact opening hours or sunset times. If timing matters, put a hedge in "bestTime", e.g. "Late afternoon — typical timing, verify before visiting".
- All costs are rough per-person ESTIMATES in the destination's local currency. Never present them as quotes.

REALISM RULES:
- Respect geography. Cluster each day by area. Never schedule two cities far apart in the same morning. Insert transport items with honest travelMinutes for intercity moves.
- Include breakfast/lunch/dinner, buffer time and rest. relaxed = 2 anchors/day, balanced = 3, packed = 4-5.
- Day 1 starts after realistic arrival; the final day accounts for departure.
- startTime is 24h "HH:MM". durationMinutes and travelMinutes are integers in minutes.

CURRENCY: use the destination country's local currency ISO code (India INR, Germany/France/Italy EUR, UK GBP, USA USD, Japan JPY, South Korea KRW, Singapore SGD, UAE AED, etc.). Never default to USD.

MISSING INFO: if trip length AND destination cannot be determined, set needsMoreInfo=true with at most 3 short questions and return empty days. Otherwise make sensible, stated assumptions in "summary" and still produce the itinerary.

Return ONLY JSON matching this shape:
{"needsMoreInfo":false,"questions":[],"understood":{"title":"","origin":"","destination":"","country":"","currency":"EUR","startDate":null,"endDate":null,"days":8,"adults":1,"children":0,"budgetAmount":null,"travelStyles":[],"interests":[],"foodPreferences":[],"accommodationPreference":null,"transportationPreference":null,"activityIntensity":"balanced","summary":""},"days":[{"dayIndex":1,"location":"","notes":null,"items":[{"kind":"activity","title":"","description":"","location":"","startTime":"09:00","durationMinutes":120,"travelMinutes":20,"transportMode":"metro","estimatedCost":12,"bestTime":null}]}],"budget":{"currency":"EUR","lines":[{"category":"hotels","description":"3-star, per night","amount":90}],"totalLow":900,"totalHigh":1400,"notes":null}}`;

async function callGateway(prompt: string): Promise<AiPlan> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI planning is not configured for this project.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`AI planner gateway failed [${res.status}]: ${body}`);
    if (res.status === 429) throw new Error("The planner is busy right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("The AI workspace is out of credits, so planning is paused.");
    throw new Error("We couldn't build your plan just now. Please try again.");
  }

  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = body.choices?.[0]?.message?.content ?? "";
  const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("The planner returned something we couldn't read. Please try again.");
  }
  return planSchema.parse(parsed);
}

/** Understand a free-text trip request and, when possible, save a full itinerary. */
export const planTripFromPrompt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => promptSchema.parse(input))
  .handler(async ({ data, context }) => {
    const today = new Date().toISOString().slice(0, 10);
    const prompt = `Today's date is ${today}.\n\nTraveller request:\n${data.prompt}${
      data.extra ? `\n\nAdditional answers:\n${data.extra}` : ""
    }`;

    const plan = await callGateway(prompt);

    if (plan.needsMoreInfo && plan.days.length === 0) {
      return { ok: false as const, questions: plan.questions, tripId: null };
    }

    const u = plan.understood;
    const guess = inferDestination(u.destination);
    const currency = (plan.budget.currency ?? u.currency ?? guess?.currency ?? "USD").toUpperCase();

    const { data: trip, error } = await context.supabase
      .from("trips")
      .insert({
        user_id: context.userId,
        title: u.title || `${u.origin} → ${u.destination}`,
        origin: u.origin || "Not specified",
        destination: u.destination || "Not specified",
        start_date: u.startDate || null,
        end_date: u.endDate || null,
        adults: u.adults,
        children: u.children,
        budget_amount: u.budgetAmount,
        budget_currency: currency,
        display_currency: currency,
        travel_styles: u.travelStyles,
        interests: u.interests,
        food_preferences: u.foodPreferences,
        accommodation_preference: u.accommodationPreference,
        transportation_preference: u.transportationPreference,
        activity_intensity: u.activityIntensity,
        brief: [data.prompt, data.extra, u.summary].filter(Boolean).join("\n\n"),
        status: "planned",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const tripId = trip.id as string;

    for (const day of plan.days) {
      const { data: dayRow, error: dayError } = await context.supabase
        .from("trip_days")
        .insert({
          trip_id: tripId,
          user_id: context.userId,
          day_index: day.dayIndex,
          day_date: offsetDate(u.startDate, day.dayIndex - 1),
          location: day.location || null,
          notes: day.notes,
        })
        .select("id")
        .single();
      if (dayError) throw new Error(dayError.message);

      const items = day.items.map((item, i) => ({
        trip_id: tripId,
        day_id: dayRow.id as string,
        user_id: context.userId,
        kind: item.kind,
        title: item.title,
        description: item.description,
        location: item.location,
        start_time: item.startTime,
        duration_minutes: item.durationMinutes,
        travel_minutes: item.travelMinutes,
        transport_mode: item.transportMode,
        estimated_cost: item.estimatedCost,
        currency,
        data_status: "ai_recommendation" as const,
        sort_order: i,
        metadata: item.bestTime ? { bestTime: item.bestTime } : {},
      }));
      if (items.length) {
        const { error: itemError } = await context.supabase.from("trip_items").insert(items);
        if (itemError) throw new Error(itemError.message);
      }
    }

    if (plan.budget.lines.length) {
      const { error: expenseError } = await context.supabase.from("expenses").insert(
        plan.budget.lines.map((line) => ({
          trip_id: tripId,
          user_id: context.userId,
          category: line.category,
          description: line.description,
          estimated_amount: line.amount,
          currency,
        })),
      );
      if (expenseError) throw new Error(expenseError.message);
    }

    return {
      ok: true as const,
      tripId,
      questions: [] as string[],
      summary: u.summary,
      budgetRange: { low: plan.budget.totalLow, high: plan.budget.totalHigh, currency, notes: plan.budget.notes },
    };
  });

function offsetDate(start: string | null, days: number): string | null {
  if (!start) return null;
  const d = new Date(start);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
