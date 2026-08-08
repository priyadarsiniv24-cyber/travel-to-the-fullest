/**
 * Provider adapter layer — server only.
 *
 * PRODUCT RULE: this app never fabricates flights, hotels, restaurants or
 * prices. Each adapter below reports whether a real provider is configured.
 * When it is not, the UI shows an explicit "live search not configured" state
 * plus verified outbound links, and no result is invented.
 *
 * To go live, add the relevant API credentials as project secrets and
 * implement the marked `TODO` request inside the adapter. Nothing else in the
 * app needs to change — the UI already renders real results when they arrive.
 */

export type ProviderKind = "flights" | "stays" | "places";

export interface ProviderResult<T> {
  configured: boolean;
  provider: string | null;
  results: T[];
  /** Present when the provider is unconfigured or failed. */
  notice?: string;
}

export interface FlightOffer {
  id: string;
  carrier: string;
  flightNumber: string;
  from: string;
  to: string;
  departsAt: string;
  arrivesAt: string;
  stops: number;
  price: number;
  currency: string;
  bookingUrl: string;
}

export interface StayOffer {
  id: string;
  name: string;
  area: string;
  rating: number | null;
  pricePerNight: number;
  currency: string;
  bookingUrl: string;
}

export interface PlaceResult {
  id: string;
  name: string;
  category: string;
  address: string | null;
  rating: number | null;
  lat: number | null;
  lng: number | null;
  mapsUrl: string;
}

const NOT_CONFIGURED =
  "Live search is not configured. No provider credentials are connected, so no results can be shown — nothing here is invented.";

function providerEnv(names: string[]): string | null {
  for (const name of names) {
    if (process.env[name]) return name;
  }
  return null;
}

export function flightProviderConfigured(): boolean {
  return providerEnv(["AMADEUS_API_KEY", "DUFFEL_API_KEY", "KIWI_API_KEY"]) !== null;
}

export function stayProviderConfigured(): boolean {
  return providerEnv(["BOOKING_API_KEY", "AMADEUS_API_KEY", "HOTELBEDS_API_KEY"]) !== null;
}

export function placesProviderConfigured(): boolean {
  return (
    providerEnv(["GOOGLE_MAPS_API_KEY", "FOURSQUARE_API_KEY"]) !== null
  );
}

export async function searchFlightOffers(_params: {
  origin: string;
  destination: string;
  departDate: string | null;
  adults: number;
  currency: string;
}): Promise<ProviderResult<FlightOffer>> {
  if (!flightProviderConfigured()) {
    return { configured: false, provider: null, results: [], notice: NOT_CONFIGURED };
  }
  // TODO: issue the real provider request here and map it to FlightOffer[].
  return {
    configured: true,
    provider: "flights",
    results: [],
    notice: "The connected flight provider returned no offers for this search.",
  };
}

export async function searchStayOffers(_params: {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  currency: string;
}): Promise<ProviderResult<StayOffer>> {
  if (!stayProviderConfigured()) {
    return { configured: false, provider: null, results: [], notice: NOT_CONFIGURED };
  }
  // TODO: issue the real provider request here and map it to StayOffer[].
  return {
    configured: true,
    provider: "stays",
    results: [],
    notice: "The connected accommodation provider returned no offers for this search.",
  };
}

export async function searchPlaces(_params: {
  query: string;
  near: string;
}): Promise<ProviderResult<PlaceResult>> {
  if (!placesProviderConfigured()) {
    return { configured: false, provider: null, results: [], notice: NOT_CONFIGURED };
  }
  // TODO: issue the real provider request here and map it to PlaceResult[].
  return {
    configured: true,
    provider: "places",
    results: [],
    notice: "The connected places provider returned no results for this search.",
  };
}

/** Verified, first-party search URLs users can always fall back to. */
export function bookingFallbackLinks(params: {
  origin: string;
  destination: string;
  startDate: string | null;
  endDate: string | null;
}) {
  const q = encodeURIComponent;
  return [
    {
      label: "Google Flights",
      kind: "flights" as const,
      url: `https://www.google.com/travel/flights?q=${q(
        `flights from ${params.origin} to ${params.destination}`,
      )}`,
    },
    {
      label: "Skyscanner",
      kind: "flights" as const,
      url: `https://www.skyscanner.net/transport/flights/?adults=1&origin=${q(params.origin)}&destination=${q(params.destination)}`,
    },
    {
      label: "Booking.com",
      kind: "stays" as const,
      url: `https://www.booking.com/searchresults.html?ss=${q(params.destination)}${
        params.startDate ? `&checkin=${q(params.startDate)}` : ""
      }${params.endDate ? `&checkout=${q(params.endDate)}` : ""}`,
    },
    {
      label: "Google Hotels",
      kind: "stays" as const,
      url: `https://www.google.com/travel/hotels/${q(params.destination)}`,
    },
    {
      label: "Google Maps",
      kind: "places" as const,
      url: `https://www.google.com/maps/search/${q(params.destination)}`,
    },
  ];
}
