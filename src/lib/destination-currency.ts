/**
 * Destination → local currency inference.
 *
 * This is deliberately a static lookup of well-known country/city names, not a
 * guess: if we cannot recognise the destination we return null and the UI asks
 * the user rather than defaulting everything to US dollars.
 */

type Place = { country: string; currency: string; aliases: string[] };

const PLACES: Place[] = [
  {
    country: "India",
    currency: "INR",
    aliases: [
      "india", "indian", "chennai", "madras", "bengaluru", "bangalore", "mumbai", "bombay",
      "delhi", "new delhi", "kolkata", "hyderabad", "pune", "goa", "kerala", "kochi", "cochin",
      "munnar", "alleppey", "alappuzha", "jaipur", "rajasthan", "agra", "varanasi", "ladakh",
      "leh", "manali", "shimla", "rishikesh", "coorg", "ooty", "kodaikanal", "andaman",
      "darjeeling", "sikkim", "meghalaya", "shillong", "udaipur", "jodhpur", "amritsar",
      "ahmedabad", "surat", "lucknow", "mysore", "mysuru", "pondicherry", "puducherry",
    ],
  },
  { country: "Germany", currency: "EUR", aliases: ["germany", "german", "berlin", "munich", "münchen", "frankfurt", "hamburg", "cologne", "köln", "dresden", "stuttgart", "nuremberg", "heidelberg", "black forest", "bavaria"] },
  { country: "France", currency: "EUR", aliases: ["france", "french", "paris", "nice", "lyon", "marseille", "bordeaux", "provence", "normandy", "cannes"] },
  { country: "Italy", currency: "EUR", aliases: ["italy", "italian", "rome", "roma", "milan", "venice", "florence", "naples", "amalfi", "sicily", "tuscany"] },
  { country: "Spain", currency: "EUR", aliases: ["spain", "spanish", "barcelona", "madrid", "seville", "valencia", "granada", "mallorca", "ibiza"] },
  { country: "Netherlands", currency: "EUR", aliases: ["netherlands", "holland", "amsterdam", "rotterdam", "utrecht"] },
  { country: "Austria", currency: "EUR", aliases: ["austria", "vienna", "salzburg", "innsbruck", "hallstatt"] },
  { country: "Greece", currency: "EUR", aliases: ["greece", "athens", "santorini", "mykonos", "crete"] },
  { country: "Portugal", currency: "EUR", aliases: ["portugal", "lisbon", "porto", "algarve", "madeira"] },
  { country: "Ireland", currency: "EUR", aliases: ["ireland", "dublin", "galway"] },
  { country: "Belgium", currency: "EUR", aliases: ["belgium", "brussels", "bruges", "ghent", "antwerp"] },
  { country: "Finland", currency: "EUR", aliases: ["finland", "helsinki", "lapland", "rovaniemi"] },
  { country: "United Kingdom", currency: "GBP", aliases: ["uk", "u.k.", "united kingdom", "britain", "england", "london", "scotland", "edinburgh", "glasgow", "manchester", "wales", "cardiff", "liverpool", "oxford", "cambridge", "bath", "belfast"] },
  { country: "United States", currency: "USD", aliases: ["usa", "u.s.", "united states", "america", "new york", "nyc", "los angeles", "san francisco", "chicago", "las vegas", "miami", "boston", "seattle", "washington dc", "hawaii", "orlando", "texas", "california", "grand canyon", "yellowstone"] },
  { country: "Canada", currency: "CAD", aliases: ["canada", "toronto", "vancouver", "montreal", "banff", "quebec", "calgary", "ottawa"] },
  { country: "Japan", currency: "JPY", aliases: ["japan", "japanese", "tokyo", "kyoto", "osaka", "hokkaido", "sapporo", "nara", "hiroshima", "okinawa", "mount fuji"] },
  { country: "South Korea", currency: "KRW", aliases: ["korea", "south korea", "seoul", "busan", "jeju", "incheon"] },
  { country: "China", currency: "CNY", aliases: ["china", "beijing", "shanghai", "chengdu", "guilin", "xian", "xi'an"] },
  { country: "Singapore", currency: "SGD", aliases: ["singapore", "sentosa"] },
  { country: "Thailand", currency: "THB", aliases: ["thailand", "bangkok", "phuket", "chiang mai", "krabi", "pattaya", "koh samui"] },
  { country: "United Arab Emirates", currency: "AED", aliases: ["uae", "dubai", "abu dhabi", "sharjah", "emirates"] },
  { country: "Australia", currency: "AUD", aliases: ["australia", "sydney", "melbourne", "brisbane", "perth", "gold coast", "cairns", "tasmania"] },
  { country: "New Zealand", currency: "NZD", aliases: ["new zealand", "auckland", "queenstown", "wellington", "christchurch"] },
  { country: "Switzerland", currency: "CHF", aliases: ["switzerland", "swiss", "zurich", "geneva", "interlaken", "lucerne", "zermatt", "bern"] },
  { country: "Sweden", currency: "SEK", aliases: ["sweden", "stockholm", "gothenburg"] },
  { country: "Turkey", currency: "TRY", aliases: ["turkey", "istanbul", "cappadocia", "antalya", "izmir"] },
  { country: "Brazil", currency: "BRL", aliases: ["brazil", "rio", "rio de janeiro", "sao paulo", "são paulo"] },
  { country: "Mexico", currency: "MXN", aliases: ["mexico", "cancun", "mexico city", "tulum", "oaxaca"] },
  { country: "South Africa", currency: "ZAR", aliases: ["south africa", "cape town", "johannesburg", "kruger", "durban"] },
];

export type DestinationGuess = { country: string; currency: string };

/** Best-effort local-currency inference. Returns null when unrecognised. */
export function inferDestination(destination: string): DestinationGuess | null {
  const q = destination.toLowerCase();
  let best: { place: Place; len: number } | null = null;
  for (const place of PLACES) {
    for (const alias of place.aliases) {
      const hit = new RegExp(`(^|[^a-z])${escapeRe(alias)}([^a-z]|$)`).test(q);
      if (hit && (!best || alias.length > best.len)) best = { place, len: alias.length };
    }
  }
  return best ? { country: best.place.country, currency: best.place.currency } : null;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
