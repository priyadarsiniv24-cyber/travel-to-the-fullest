import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { tripIdSchema, tripInputSchema } from "@/lib/trip-schemas";

export const listTrips = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("trips")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getTrip = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tripIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: trip, error } = await context.supabase
      .from("trips")
      .select("*")
      .eq("id", data.tripId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!trip) throw new Error("Trip not found");

    const { data: days } = await context.supabase
      .from("trip_days")
      .select("*")
      .eq("trip_id", data.tripId)
      .order("day_index");
    const { data: items } = await context.supabase
      .from("trip_items")
      .select("*")
      .eq("trip_id", data.tripId)
      .order("sort_order");
    const { data: expenses } = await context.supabase
      .from("expenses")
      .select("*")
      .eq("trip_id", data.tripId)
      .order("created_at");

    return { trip, days: days ?? [], items: items ?? [], expenses: expenses ?? [] };
  });

export const createTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tripInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: trip, error } = await context.supabase
      .from("trips")
      .insert({
        user_id: context.userId,
        title: data.title,
        origin: data.origin,
        destination: data.destination,
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        adults: data.adults,
        children: data.children,
        budget_amount: data.budgetAmount ?? null,
        budget_currency: data.budgetCurrency,
        display_currency: data.displayCurrency,
        travel_styles: data.travelStyles,
        interests: data.interests,
        food_preferences: data.foodPreferences,
        accommodation_preference: data.accommodationPreference ?? null,
        transportation_preference: data.transportationPreference ?? null,
        activity_intensity: data.activityIntensity,
        accessibility_notes: data.accessibilityNotes || null,
        brief: data.brief || null,
        status: "draft",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: trip.id as string };
  });

export const deleteTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tripIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("trips")
      .delete()
      .eq("id", data.tripId)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
