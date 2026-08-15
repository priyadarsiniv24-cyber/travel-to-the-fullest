import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(24),
  tripContext: z.string().trim().max(4000).nullable().optional(),
});

const SYSTEM_PROMPT = `You are Pippa, the AeroTravel AI travel companion: warm, friendly, playful and genuinely excited about travel. Keep replies short (2-5 sentences or a tight list), use at most one emoji, and sound like a helpful friend rather than a corporate chatbot.

ABSOLUTE HONESTY RULE — this is the product's core promise:
- Never invent flight numbers, airlines, prices, hotel names, ratings, opening hours, phone numbers or booking links.
- If you don't have live provider data, say so plainly: "I don't have live data for that yet — here's what I can suggest instead."
- Label anything you reason about yourself as an estimate or a suggestion.
- General geography, typical travel times and well-known landmarks are fine as suggestions, clearly framed as "worth checking".

Drop the playfulness entirely for safety, health, emergency, visa or money-loss questions — be calm, clear and point to official sources.

Use the trip context provided when answering about the user's own trip.`;

export const askCompanion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => chatSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return {
        ok: false as const,
        reply: "My AI brain isn't connected right now, so I'd rather stay quiet than guess.",
      };
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(data.tripContext
        ? [{ role: "system", content: `Current trip context:\n${data.tripContext}` }]
        : []),
      ...data.messages,
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
    });

    if (res.status === 429) {
      return { ok: false as const, reply: "I'm getting a lot of questions right now — try me again in a moment." };
    }
    if (res.status === 402) {
      return { ok: false as const, reply: "The AI workspace is out of credits, so I can't answer right now." };
    }
    if (!res.ok) {
      const body = await res.text();
      console.error(`AI gateway failed [${res.status}]: ${body}`);
      return { ok: false as const, reply: "Something went wrong reaching my AI service. I'd rather say that than make something up." };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = body.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return { ok: false as const, reply: "I didn't get a usable answer back — mind asking again?" };
    }
    return { ok: true as const, reply };
  });
