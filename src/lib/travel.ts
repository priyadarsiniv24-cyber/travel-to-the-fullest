/**
 * Shared, client-safe travel domain constants and types.
 *
 * IMPORTANT PRODUCT RULE: this app never presents invented real-world facts as
 * truth. Every piece of outward-facing information carries a DataStatus that
 * explains where it came from. See `DATA_STATUS_META` below.
 */

export type DataStatus = "live" | "verified" | "estimated" | "ai_recommendation";

export const DATA_STATUS_META: Record<
  DataStatus,
  { label: string; short: string; explanation: string; token: string }
> = {
  live: {
    label: "Live",
    short: "LIVE",
    explanation: "Fetched just now from a connected data provider.",
    token: "live",
  },
  verified: {
    label: "Verified",
    short: "VERIFIED",
    explanation: "Sourced from an official or authoritative reference.",
    token: "verified",
  },
  estimated: {
    label: "Estimated",
    short: "EST.",
    explanation: "A modelled estimate, not a quoted or confirmed figure.",
    token: "estimated",
  },
  ai_recommendation: {
    label: "AI suggestion",
    short: "AI",
    explanation:
      "An AI-generated suggestion. Not verified against live availability, pricing or opening hours.",
    token: "suggested",
  },
};

export type TripStatus = "draft" | "planned" | "active" | "completed" | "archived";

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  draft: "Draft",
  planned: "Planned",
  active: "In progress",
  completed: "Completed",
  archived: "Archived",
};

export type ExpenseCategory =
  | "flights"
  | "trains"
  | "buses"
  | "local_transport"
  | "hotels"
  | "food"
  | "activities"
  | "tickets"
  | "shopping"
  | "buffer"
  | "other";

export const EXPENSE_CATEGORY_LABEL: Record<ExpenseCategory, string> = {
  flights: "Flights",
  trains: "Trains",
  buses: "Buses",
  local_transport: "Local transport",
  hotels: "Accommodation",
  food: "Food & drink",
  activities: "Activities",
  tickets: "Tickets & entry",
  shopping: "Shopping",
  buffer: "Buffer",
  other: "Other",
};

/** Currencies the planner can display. Rates are fetched live, never hardcoded. */
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "AED", symbol: "AED", name: "UAE Dirham" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "CNY", symbol: "CN¥", name: "Chinese Yuan" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
] as const;

export const TRAVEL_STYLES = [
  "Backpacking",
  "Budget",
  "Mid-range",
  "Luxury",
  "Family",
  "Solo",
  "Romantic",
  "Business",
  "Slow travel",
  "Road trip",
] as const;

export const INTERESTS = [
  "History & heritage",
  "Museums & art",
  "Food & markets",
  "Nightlife",
  "Nature & hiking",
  "Beaches",
  "Mountains",
  "Wildlife",
  "Architecture",
  "Shopping",
  "Photography",
  "Adventure sports",
  "Wellness & spa",
  "Local festivals",
  "Off the beaten path",
] as const;

export const FOOD_PREFERENCES = [
  "No restrictions",
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-free",
  "Nut allergy",
  "Seafood allergy",
  "Low spice",
  "Street food lover",
] as const;

export const ACCOMMODATION_PREFERENCES = [
  "Hostel",
  "Budget hotel",
  "Boutique hotel",
  "Mid-range hotel",
  "Luxury hotel",
  "Apartment / self-catering",
  "Homestay / guesthouse",
  "Resort",
] as const;

export const TRANSPORT_PREFERENCES = [
  "Public transport",
  "Walking first",
  "Rental car",
  "Taxis / ride-hailing",
  "Trains between cities",
  "Domestic flights",
] as const;

export const ACTIVITY_INTENSITY = [
  { value: "relaxed", label: "Relaxed", hint: "1–2 anchors a day, long breaks" },
  { value: "balanced", label: "Balanced", hint: "2–3 anchors a day with buffer" },
  { value: "packed", label: "Packed", hint: "4+ stops, early starts" },
] as const;

export function currencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

export function formatMoney(amount: number | null | undefined, code: string): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: amount >= 1000 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currencySymbol(code)}${amount.toFixed(0)}`;
  }
}

export function tripNights(start?: string | null, end?: string | null): number | null {
  if (!start || !end) return null;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return null;
  return Math.round((b - a) / 86_400_000);
}

export function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return "Dates not set";
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  return fmt((start ?? end)!);
}
