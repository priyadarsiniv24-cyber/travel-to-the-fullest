import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const searchSchema = z.object({
  origin: z.string().trim().max(160),
  destination: z.string().trim().max(160),
  startDate: z.string().trim().max(10).nullable(),
  endDate: z.string().trim().max(10).nullable(),
  adults: z.number().int().min(1).max(30),
  currency: z.string().trim().length(3),
});

/**
 * Live availability lookup. Returns `configured: false` when no provider
 * credentials exist — the UI then says so plainly instead of inventing offers.
 */
export const searchTravelOptions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => searchSchema.parse(input))
  .handler(async ({ data }) => {
    const providers = await import("@/lib/providers.server");
    const [flights, stays] = await Promise.all([
      providers.searchFlightOffers({
        origin: data.origin,
        destination: data.destination,
        departDate: data.startDate,
        adults: data.adults,
        currency: data.currency,
      }),
      providers.searchStayOffers({
        destination: data.destination,
        checkIn: data.startDate,
        checkOut: data.endDate,
        guests: data.adults,
        currency: data.currency,
      }),
    ]);
    return {
      flights,
      stays,
      links: providers.bookingFallbackLinks({
        origin: data.origin,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
      }),
    };
  });

const ratesSchema = z.object({
  base: z.string().trim().length(3),
  symbols: z.array(z.string().trim().length(3)).max(20),
});

/**
 * Live FX rates from the European Central Bank via frankfurter.app (no key).
 * Rates are real; if the request fails we say so rather than guessing.
 */
export const getExchangeRates = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ratesSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const url = `https://api.frankfurter.app/latest?base=${encodeURIComponent(
        data.base,
      )}&symbols=${encodeURIComponent(data.symbols.join(","))}`;
      const res = await fetch(url);
      if (!res.ok) {
        return { ok: false as const, notice: `Rate service returned ${res.status}.`, rates: {}, date: null };
      }
      const body = (await res.json()) as { rates?: Record<string, number>; date?: string };
      return {
        ok: true as const,
        rates: body.rates ?? {},
        date: body.date ?? null,
        notice: null,
      };
    } catch {
      return {
        ok: false as const,
        notice: "Live exchange rates are unavailable right now.",
        rates: {},
        date: null,
      };
    }
  });
