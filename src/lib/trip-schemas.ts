import { z } from "zod";

import {
  ACCOMMODATION_PREFERENCES,
  ACTIVITY_INTENSITY,
  CURRENCIES,
  FOOD_PREFERENCES,
  INTERESTS,
  TRANSPORT_PREFERENCES,
  TRAVEL_STYLES,
} from "./travel";

const currencyCodes = CURRENCIES.map((c) => c.code) as [string, ...string[]];

export const tripInputSchema = z
  .object({
    title: z.string().trim().min(1, "Give the trip a name").max(120),
    origin: z.string().trim().min(1, "Where are you starting from?").max(120),
    destination: z.string().trim().min(1, "Where are you going?").max(160),
    startDate: z.string().trim().max(10).optional().nullable(),
    endDate: z.string().trim().max(10).optional().nullable(),
    adults: z.number().int().min(1).max(30),
    children: z.number().int().min(0).max(30),
    budgetAmount: z.number().nonnegative().max(100_000_000).nullable().optional(),
    budgetCurrency: z.enum(currencyCodes),
    displayCurrency: z.enum(currencyCodes),
    travelStyles: z.array(z.enum(TRAVEL_STYLES as unknown as [string, ...string[]])).max(10),
    interests: z.array(z.enum(INTERESTS as unknown as [string, ...string[]])).max(15),
    foodPreferences: z.array(z.enum(FOOD_PREFERENCES as unknown as [string, ...string[]])).max(10),
    accommodationPreference: z
      .enum(ACCOMMODATION_PREFERENCES as unknown as [string, ...string[]])
      .nullable()
      .optional(),
    transportationPreference: z
      .enum(TRANSPORT_PREFERENCES as unknown as [string, ...string[]])
      .nullable()
      .optional(),
    activityIntensity: z.enum(
      ACTIVITY_INTENSITY.map((a) => a.value) as unknown as [string, ...string[]],
    ),
    accessibilityNotes: z.string().trim().max(600).nullable().optional(),
    brief: z.string().trim().max(2000).nullable().optional(),
  })
  .refine(
    (v) => !v.startDate || !v.endDate || new Date(v.endDate) >= new Date(v.startDate),
    { message: "Return date must be on or after the departure date", path: ["endDate"] },
  );

export type TripInput = z.infer<typeof tripInputSchema>;

export const tripIdSchema = z.object({ tripId: z.string().uuid() });
