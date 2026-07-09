import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

/* ============================================================
   AUTH
   ============================================================ */

type User = { email: string; password: string };

function App() {
  const [users, setUsers] = useState<User[]>([
    { email: "traveler@aero.ai", password: "demo1234" },
  ]);
  const [authed, setAuthed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleSignIn = (email: string, password: string): string | null => {
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!match) return "Invalid email or password.";
    setLeaving(true);
    setTimeout(() => {
      setAuthed(true);
      setLeaving(false);
    }, 650);
    return null;
  };

  const handleSignUp = (email: string, password: string): string | null => {
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return "An account with this email already exists.";
    }
    setUsers((prev) => [...prev, { email, password }]);
    return null;
  };

  const handleSignOut = () => setAuthed(false);

  if (!authed)
    return <AuthGate leaving={leaving} onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  return (
    <div className="animate-[fade-in_0.5s_ease-out]">
      <TravelApp onSignOut={handleSignOut} />
    </div>
  );
}

function AuthGate({
  leaving,
  onSignIn,
  onSignUp,
}: {
  leaving: boolean;
  onSignIn: (email: string, password: string) => string | null;
  onSignUp: (email: string, password: string) => string | null;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (mode === "signup") {
      const err = onSignUp(email, password);
      if (err) return setError(err);
      setSuccess("Account created successfully! You can now sign in.");
      setMode("signin");
      setPassword("");
      return;
    }
    const err = onSignIn(email, password);
    if (err) setError(err);
  };

  const switchMode = (m: "signin" | "signup") => {
    setMode(m);
    setError(null);
    setSuccess(null);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950 px-4 transition-all duration-700 ${
        leaving ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="relative w-full max-w-md animate-[scale-in_0.4s_ease-out] rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-500 text-2xl font-black shadow-lg shadow-emerald-500/30">
            ✈
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Aero<span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">Travel</span>{" "}
            <span className="text-white/60">AI</span>
          </h1>
          <p className="text-sm text-white/60">
            {mode === "signin" ? "Sign in to plan your next journey" : "Create your account to get started"}
          </p>
        </div>

        <div className="mb-5 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === "signin" ? "bg-gradient-to-r from-emerald-500 to-indigo-500 text-white shadow" : "text-white/60 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === "signup" ? "bg-gradient-to-r from-emerald-500 to-indigo-500 text-white shadow" : "text-white/60 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-emerald-400/50 focus:bg-white/10"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-emerald-400/50 focus:bg-white/10"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-indigo-500 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] hover:shadow-emerald-500/50"
          >
            {mode === "signin" ? "Sign In →" : "Create Account →"}
          </button>

          <p className="pt-1 text-center text-xs text-white/40">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <span onClick={() => switchMode("signup")} className="cursor-pointer text-emerald-400 hover:underline">
                  Create an account
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => switchMode("signin")} className="cursor-pointer text-emerald-400 hover:underline">
                  Sign in
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   TYPES + DYNAMIC DESTINATION DATASET
   ============================================================ */

type View = "landing" | "loading" | "dashboard";
type Tab = "planner" | "navigator" | "journal";

type Flight = { airline: string; route: string; duration: string; price: string; verdict: string; confidence: number };
type Restaurant = { name: string; cuisine: string; tag: string; time: string };
type TimelineDay = { day: string; hack: string; slots: { period: string; activity: string }[] };

type Trip = {
  origin: { city: string; code: string };
  destination: { city: string; country: string; code: string; neighborhood: string };
  flights: Flight[];
  restaurants: Restaurant[];
  timeline: TimelineDay[];
  checkinPlaces: string[];
  seedExpenses: Expense[];
};

const FILTERS = [
  "🌱 Gluten-Free",
  "📉 Price Drop Watch",
  "⚡ Fast Pace",
  "🏛️ Architecture",
  "🚫 Avoid Crowds",
  "💸 Budget Saver",
  "🌙 Nightlife",
  "👨‍👩‍👧 Family Friendly",
];

type Visit = { id: string; place: string; startedAt: number; endedAt?: number };
type Photo = { id: string; url: string; day: string; place: string; caption: string; timestamp: number };
type Expense = { id: string; label: string; amount: number; category: ExpenseCategory; timestamp: number };
type ExpenseCategory = "Flight" | "Accommodation" | "Food" | "Transit";

const CATEGORY_META: Record<ExpenseCategory, { color: string; icon: string; label: string }> = {
  Flight: { color: "bg-emerald-500", icon: "✈️", label: "Flight Expenses" },
  Accommodation: { color: "bg-indigo-500", icon: "🏨", label: "Accommodation/Hotel" },
  Food: { color: "bg-amber-500", icon: "🍽️", label: "Food & Dining" },
  Transit: { color: "bg-fuchsia-500", icon: "🚇", label: "Transit/Activities" },
};

/* ---------- Airport code dictionary for origins ---------- */
const ORIGIN_CODES: Record<string, { city: string; code: string }> = {
  chennai: { city: "Chennai", code: "MAA" },
  mumbai: { city: "Mumbai", code: "BOM" },
  delhi: { city: "Delhi", code: "DEL" },
  bangalore: { city: "Bangalore", code: "BLR" },
  jfk: { city: "New York", code: "JFK" },
  "new york": { city: "New York", code: "JFK" },
  nyc: { city: "New York", code: "JFK" },
  london: { city: "London", code: "LHR" },
  dubai: { city: "Dubai", code: "DXB" },
  singapore: { city: "Singapore", code: "SIN" },
  sydney: { city: "Sydney", code: "SYD" },
  toronto: { city: "Toronto", code: "YYZ" },
  paris: { city: "Paris", code: "CDG" },
};

/* ---------- Destination dictionary ---------- */
type DestSpec = Omit<Trip, "origin" | "flights" | "seedExpenses"> & {
  code: string;
  city: string;
  country: string;
  neighborhood: string;
  airlines: string[];
  basePrice: number;
  flightHours: number;
};

const DESTINATIONS: Record<string, DestSpec> = {
  germany: {
    city: "Frankfurt",
    country: "Germany",
    code: "FRA",
    neighborhood: "Sachsenhausen, Frankfurt",
    airlines: ["Lufthansa", "Emirates", "Singapore Airlines"],
    basePrice: 890,
    flightHours: 9,
    destination: { city: "Frankfurt", country: "Germany", code: "FRA", neighborhood: "Sachsenhausen, Frankfurt" },
    restaurants: [
      { name: "Zum Gemalten Haus", cuisine: "Traditional German", tag: "Apfelwein Certified", time: "7:00 PM – 9:00 PM" },
      { name: "Kleinmarkthalle", cuisine: "Local Market Eats", tag: "Fresh & Regional", time: "10:00 AM – 12:00 PM" },
      { name: "Adolf Wagner", cuisine: "Frankfurter Grüne Soße", tag: "Since 1931", time: "6:30 PM – 8:00 PM" },
      { name: "Bitter & Zart", cuisine: "Chocolate Café", tag: "Vegan Options", time: "3:00 PM – 4:30 PM" },
    ],
    timeline: [
      { day: "Day 1", hack: "Buy the Frankfurt Card at the airport — free transit + 50% on museums.",
        slots: [
          { period: "Morning", activity: "Römerberg square + Old Town walk" },
          { period: "Afternoon", activity: "Städel Museum classic art collection" },
          { period: "Evening", activity: "Apfelwein tasting in Sachsenhausen" },
        ] },
      { day: "Day 2", hack: "Take the ICE to Heidelberg — 50 min and worth the day trip.",
        slots: [
          { period: "Morning", activity: "Day trip: Heidelberg Castle" },
          { period: "Afternoon", activity: "Philosophenweg viewpoint walk" },
          { period: "Evening", activity: "Return to Frankfurt · dinner at Adolf Wagner" },
        ] },
      { day: "Day 3", hack: "Main Tower observation deck is €9 vs. €25 elsewhere — same skyline.",
        slots: [
          { period: "Morning", activity: "Palmengarten botanical park" },
          { period: "Afternoon", activity: "Main Tower skyline view" },
          { period: "Evening", activity: "Berger Straße bar crawl" },
        ] },
      { day: "Day 4", hack: "Rothenburg tours cost €80 — the regional train is €25 with a Bayern Ticket.",
        slots: [
          { period: "Morning", activity: "Day trip: Rothenburg ob der Tauber" },
          { period: "Afternoon", activity: "Medieval wall walk + Käthe Wohlfahrt store" },
          { period: "Evening", activity: "Return · farewell dinner Kleinmarkthalle" },
        ] },
      { day: "Day 5", hack: "Museumsufer combo ticket = 2 days, 39 museums, €21.",
        slots: [
          { period: "Morning", activity: "Museumsufer riverside museums" },
          { period: "Afternoon", activity: "Goethe House + shopping Zeil" },
          { period: "Evening", activity: "Sunset at Main River footbridge" },
        ] },
    ],
    checkinPlaces: [
      "Römerberg Square", "Städel Museum", "Main Tower", "Palmengarten",
      "Sachsenhausen District", "Kleinmarkthalle", "Goethe House",
      "Heidelberg Castle", "Rothenburg Old Town", "Berger Straße",
    ],
  },
  paris: {
    city: "Paris",
    country: "France",
    code: "CDG",
    neighborhood: "Le Marais, Paris",
    airlines: ["Air France", "United Airlines", "Delta"],
    basePrice: 612,
    flightHours: 7,
    destination: { city: "Paris", country: "France", code: "CDG", neighborhood: "Le Marais, Paris" },
    restaurants: [
      { name: "Noglu", cuisine: "French Bistro", tag: "100% Celiac Safe", time: "11:30 AM – 1:00 PM" },
      { name: "Chambelland", cuisine: "Bakery & Café", tag: "Gluten-Free Certified", time: "8:00 AM – 9:30 AM" },
      { name: "NoGlu Marais", cuisine: "Modern French", tag: "Dedicated GF Kitchen", time: "6:30 PM – 7:45 PM" },
      { name: "Café Pinson", cuisine: "Organic Vegan", tag: "Allergen Aware", time: "12:00 PM – 1:15 PM" },
    ],
    timeline: [
      { day: "Day 1", hack: "Enter Notre-Dame via the side gate at 8:45 AM to skip 90-min queues.",
        slots: [
          { period: "Morning", activity: "Notre-Dame exterior + Île de la Cité walk" },
          { period: "Afternoon", activity: "Sainte-Chapelle stained glass tour" },
          { period: "Evening", activity: "Seine sunset stroll + dinner at Noglu" },
        ] },
      { day: "Day 2", hack: "Book Louvre entry for 6:00 PM — half the crowds, same masterpieces.",
        slots: [
          { period: "Morning", activity: "Musée d'Orsay (open at 9:30 AM)" },
          { period: "Afternoon", activity: "Tuileries Garden + Palais Royal arcades" },
          { period: "Evening", activity: "Louvre evening entry (Wed / Fri)" },
        ] },
      { day: "Day 3", hack: "Take the 82 bus, not the metro — cheaper views of the Eiffel Tower.",
        slots: [
          { period: "Morning", activity: "Trocadéro viewpoint + Eiffel Tower climb" },
          { period: "Afternoon", activity: "Rodin Museum sculpture garden" },
          { period: "Evening", activity: "Rue Cler food street tasting" },
        ] },
      { day: "Day 4", hack: "Père Lachaise map is free at the entrance — skip the paid tours.",
        slots: [
          { period: "Morning", activity: "Le Marais architecture walk" },
          { period: "Afternoon", activity: "Picasso Museum (Marais)" },
          { period: "Evening", activity: "Père Lachaise golden hour visit" },
        ] },
      { day: "Day 5", hack: "Versailles opens at 9 AM — arrive 8:30 to be first through the Hall of Mirrors.",
        slots: [
          { period: "Morning", activity: "RER C to Versailles — palace tour" },
          { period: "Afternoon", activity: "Versailles gardens + Marie-Antoinette estate" },
          { period: "Evening", activity: "Return to Paris — farewell dinner Le Marais" },
        ] },
    ],
    checkinPlaces: [
      "Notre-Dame Cathedral", "Louvre Museum", "Eiffel Tower", "Sainte-Chapelle",
      "Musée d'Orsay", "Le Marais District", "Palais Royal", "Père Lachaise",
      "Versailles Palace", "Rue Cler Market",
    ],
  },
  barcelona: {
    city: "Barcelona",
    country: "Spain",
    code: "BCN",
    neighborhood: "El Born, Barcelona",
    airlines: ["Vueling", "Iberia", "Lufthansa"],
    basePrice: 540,
    flightHours: 8,
    destination: { city: "Barcelona", country: "Spain", code: "BCN", neighborhood: "El Born, Barcelona" },
    restaurants: [
      { name: "Cera 23", cuisine: "Modern Catalan", tag: "Chef's Tasting", time: "8:30 PM – 10:30 PM" },
      { name: "Bar del Pla", cuisine: "Tapas Bar", tag: "Locals' Choice", time: "1:00 PM – 2:30 PM" },
      { name: "Els 4 Gats", cuisine: "Modernist Bistro", tag: "Picasso's Haunt", time: "7:00 PM – 8:30 PM" },
      { name: "Flax & Kale", cuisine: "Plant-Forward", tag: "Gluten-Free Menu", time: "12:30 PM – 1:45 PM" },
    ],
    timeline: [
      { day: "Day 1", hack: "Sagrada Família tickets sell out 2 weeks ahead — book online first.",
        slots: [
          { period: "Morning", activity: "Sagrada Família tour + towers" },
          { period: "Afternoon", activity: "Passeig de Gràcia — Casa Batlló + La Pedrera" },
          { period: "Evening", activity: "Tapas crawl in El Born" },
        ] },
      { day: "Day 2", hack: "Park Güell free zone opens at 6 AM — sunrise skyline, no ticket.",
        slots: [
          { period: "Morning", activity: "Park Güell sunrise viewpoint" },
          { period: "Afternoon", activity: "Gràcia neighborhood plazas" },
          { period: "Evening", activity: "Bunkers del Carmel sunset" },
        ] },
      { day: "Day 3", hack: "Take the R2 train to Sitges — €4.50 vs €40 tours.",
        slots: [
          { period: "Morning", activity: "Day trip: Sitges beach" },
          { period: "Afternoon", activity: "Old town + Bacardí Museum" },
          { period: "Evening", activity: "Return · dinner at Cera 23" },
        ] },
      { day: "Day 4", hack: "Picasso Museum is FREE Thursday evenings 5-8 PM.",
        slots: [
          { period: "Morning", activity: "Gothic Quarter walk + Cathedral" },
          { period: "Afternoon", activity: "Picasso Museum" },
          { period: "Evening", activity: "Barceloneta seafood & beachfront" },
        ] },
      { day: "Day 5", hack: "Magic Fountain shows are free — check schedule (weekends only in winter).",
        slots: [
          { period: "Morning", activity: "Montjuïc castle cable car" },
          { period: "Afternoon", activity: "MNAC museum + Poble Espanyol" },
          { period: "Evening", activity: "Magic Fountain show finale" },
        ] },
    ],
    checkinPlaces: [
      "Sagrada Família", "Park Güell", "Casa Batlló", "La Pedrera",
      "Gothic Quarter", "El Born", "Barceloneta Beach", "Picasso Museum",
      "Montjuïc Castle", "La Rambla",
    ],
  },
  tokyo: {
    city: "Tokyo",
    country: "Japan",
    code: "HND",
    neighborhood: "Shibuya, Tokyo",
    airlines: ["ANA", "Japan Airlines", "Singapore Airlines"],
    basePrice: 1180,
    flightHours: 13,
    destination: { city: "Tokyo", country: "Japan", code: "HND", neighborhood: "Shibuya, Tokyo" },
    restaurants: [
      { name: "Ichiran Shibuya", cuisine: "Tonkotsu Ramen", tag: "24/7 Solo Booths", time: "1:00 PM – 2:00 PM" },
      { name: "Sushi Dai", cuisine: "Omakase Sushi", tag: "Toyosu Market Legend", time: "6:00 AM – 7:30 AM" },
      { name: "Afuri Ebisu", cuisine: "Yuzu Ramen", tag: "Light Broth", time: "12:00 PM – 1:15 PM" },
      { name: "T's Tantan", cuisine: "Vegan Ramen", tag: "100% Plant-Based", time: "7:00 PM – 8:15 PM" },
    ],
    timeline: [
      { day: "Day 1", hack: "Get a Suica card at the airport — works on every train, bus, and konbini.",
        slots: [
          { period: "Morning", activity: "Meiji Shrine + Harajuku Takeshita Street" },
          { period: "Afternoon", activity: "Shibuya Crossing + Hachikō statue" },
          { period: "Evening", activity: "Shibuya Sky observation deck sunset" },
        ] },
      { day: "Day 2", hack: "TeamLab tickets are timed — book 3 weeks ahead or you're locked out.",
        slots: [
          { period: "Morning", activity: "TeamLab Planets immersive museum" },
          { period: "Afternoon", activity: "Odaiba waterfront + Gundam statue" },
          { period: "Evening", activity: "Tsukishima monjayaki street" },
        ] },
      { day: "Day 3", hack: "Enter Senso-ji at 6 AM for zero crowds and golden-hour photos.",
        slots: [
          { period: "Morning", activity: "Senso-ji Temple + Nakamise shopping street" },
          { period: "Afternoon", activity: "Ueno Park + National Museum" },
          { period: "Evening", activity: "Ameya-Yokochō market food crawl" },
        ] },
      { day: "Day 4", hack: "Skip the Ghibli Museum lottery — Ghibli Park in Nagoya has same-day tickets.",
        slots: [
          { period: "Morning", activity: "Shinjuku Gyoen garden walk" },
          { period: "Afternoon", activity: "Tokyo Metropolitan Building free observation" },
          { period: "Evening", activity: "Omoide Yokochō izakaya alley" },
        ] },
      { day: "Day 5", hack: "Day trip to Kamakura — 60 min on the Yokosuka Line, full temple day.",
        slots: [
          { period: "Morning", activity: "Day trip: Kamakura Great Buddha" },
          { period: "Afternoon", activity: "Hasedera Temple + Enoshima" },
          { period: "Evening", activity: "Return · farewell dinner Ichiran" },
        ] },
    ],
    checkinPlaces: [
      "Shibuya Crossing", "Meiji Shrine", "Senso-ji Temple", "Tokyo Skytree",
      "Shinjuku Gyoen", "Harajuku Takeshita", "TeamLab Planets",
      "Ueno Park", "Kamakura Great Buddha", "Toyosu Market",
    ],
  },
  london: {
    city: "London",
    country: "United Kingdom",
    code: "LHR",
    neighborhood: "Shoreditch, London",
    airlines: ["British Airways", "Virgin Atlantic", "American Airlines"],
    basePrice: 720,
    flightHours: 8,
    destination: { city: "London", country: "United Kingdom", code: "LHR", neighborhood: "Shoreditch, London" },
    restaurants: [
      { name: "Dishoom Shoreditch", cuisine: "Bombay Café", tag: "Iconic Breakfast", time: "8:30 AM – 10:00 AM" },
      { name: "Padella", cuisine: "Fresh Pasta", tag: "Borough Market", time: "12:30 PM – 1:45 PM" },
      { name: "The Wolseley", cuisine: "European Grand Café", tag: "Afternoon Tea", time: "3:30 PM – 5:00 PM" },
      { name: "Mildreds Soho", cuisine: "Global Vegetarian", tag: "Gluten-Free Menu", time: "7:00 PM – 8:30 PM" },
    ],
    timeline: [
      { day: "Day 1", hack: "The Oyster card daily cap is £8.10 — never buy single tickets.",
        slots: [
          { period: "Morning", activity: "Tower of London + Tower Bridge" },
          { period: "Afternoon", activity: "Borough Market food stalls" },
          { period: "Evening", activity: "Shakespeare's Globe evening tour" },
        ] },
      { day: "Day 2", hack: "British Museum is FREE — arrive at 10 AM opening to beat groups.",
        slots: [
          { period: "Morning", activity: "British Museum · Rosetta Stone + Egypt" },
          { period: "Afternoon", activity: "Covent Garden + street performers" },
          { period: "Evening", activity: "West End show (day-of TKTS booth)" },
        ] },
      { day: "Day 3", hack: "Sky Garden viewpoint is free but requires online booking 3 weeks out.",
        slots: [
          { period: "Morning", activity: "Westminster + Big Ben + Parliament" },
          { period: "Afternoon", activity: "Buckingham Palace changing of the guard" },
          { period: "Evening", activity: "Sky Garden sunset (free entry)" },
        ] },
      { day: "Day 4", hack: "Take the Overground to Hackney — better markets, half the tourists.",
        slots: [
          { period: "Morning", activity: "Shoreditch street art walk" },
          { period: "Afternoon", activity: "Columbia Road flower market (Sun)" },
          { period: "Evening", activity: "Brick Lane curry mile dinner" },
        ] },
      { day: "Day 5", hack: "Windsor Castle: buy the Royal Windsor ticket at any station for combined fare.",
        slots: [
          { period: "Morning", activity: "Day trip: Windsor Castle" },
          { period: "Afternoon", activity: "Eton College town walk" },
          { period: "Evening", activity: "Return · farewell dinner Dishoom" },
        ] },
    ],
    checkinPlaces: [
      "Tower of London", "British Museum", "Buckingham Palace", "Westminster Abbey",
      "Borough Market", "Shoreditch", "Sky Garden", "Covent Garden",
      "Windsor Castle", "Camden Market",
    ],
  },
};

/* ---------- resolver: parse user query into a Trip ---------- */

function resolveTrip(rawQuery: string): Trip {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  // parse "X to Y"
  let originKey: string | null = null;
  let destText: string = lower;
  const m = lower.match(/(?:from\s+)?([a-z\s]+?)\s+to\s+([a-z\s]+)/i);
  if (m) {
    originKey = m[1].trim();
    destText = m[2].trim();
  }

  // detect destination from dictionary — search first known keyword in destText
  let destKey: string | null = null;
  for (const key of Object.keys(DESTINATIONS)) {
    if (destText.includes(key)) {
      destKey = key;
      break;
    }
  }
  // also try full query (in case destText missed it)
  if (!destKey) {
    for (const key of Object.keys(DESTINATIONS)) {
      if (lower.includes(key)) {
        destKey = key;
        break;
      }
    }
  }

  const origin = originKey
    ? (ORIGIN_CODES[originKey] ?? {
        city: cap(originKey),
        code: originKey.replace(/[^a-z]/g, "").slice(0, 3).toUpperCase() || "ORG",
      })
    : { city: "New York", code: "JFK" };

  if (destKey) {
    const d = DESTINATIONS[destKey];
    const flights = buildFlights(origin.code, d.code, d.airlines, d.basePrice, d.flightHours);
    return {
      origin,
      destination: d.destination,
      flights,
      restaurants: d.restaurants,
      timeline: d.timeline,
      checkinPlaces: d.checkinPlaces,
      seedExpenses: seedExpenses(d.basePrice, d.city),
    };
  }

  // fallback: unknown destination — interpolate raw input
  const fallbackCity = cap(destText || query || "Your destination");
  const code = fallbackCity.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "DST";
  const base = 700;
  const hours = 8;
  return {
    origin,
    destination: {
      city: fallbackCity,
      country: fallbackCity,
      code,
      neighborhood: `Central ${fallbackCity}`,
    },
    flights: buildFlights(origin.code, code, ["Emirates", "Qatar Airways", "Turkish Airlines"], base, hours),
    restaurants: [
      { name: `${fallbackCity} Central Bistro`, cuisine: "Local Favorites", tag: "Highly Rated", time: "12:30 PM – 2:00 PM" },
      { name: `Old Town ${fallbackCity}`, cuisine: "Traditional", tag: "Locals' Pick", time: "7:00 PM – 9:00 PM" },
      { name: `${fallbackCity} Street Market`, cuisine: "Street Food", tag: "Cash-Friendly", time: "6:00 PM – 8:00 PM" },
      { name: `Café ${fallbackCity}`, cuisine: "Brunch & Coffee", tag: "Vegetarian Friendly", time: "9:00 AM – 10:30 AM" },
    ],
    timeline: [1, 2, 3, 4, 5].map((n) => ({
      day: `Day ${n}`,
      hack: `Ask a local guide for hidden ${fallbackCity} spots — often free walking tours run daily.`,
      slots: [
        { period: "Morning", activity: `Explore central ${fallbackCity} landmarks` },
        { period: "Afternoon", activity: `${fallbackCity} museum + cultural district` },
        { period: "Evening", activity: `Dinner + nightlife in ${fallbackCity}` },
      ],
    })),
    checkinPlaces: [
      `${fallbackCity} Old Town`,
      `${fallbackCity} Central Square`,
      `${fallbackCity} Main Cathedral`,
      `${fallbackCity} Riverside`,
      `${fallbackCity} Market District`,
      `${fallbackCity} Art Museum`,
      `${fallbackCity} Botanical Gardens`,
      `${fallbackCity} Viewpoint`,
    ],
    seedExpenses: seedExpenses(base, fallbackCity),
  };
}

function cap(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildFlights(originCode: string, destCode: string, airlines: string[], basePrice: number, hours: number): Flight[] {
  const route = `${originCode} → ${destCode}`;
  return airlines.slice(0, 3).map((airline, i) => {
    const price = basePrice + i * 78;
    const buy = i === 0;
    return {
      airline,
      route,
      duration: `${hours + i}h ${(10 + i * 15) % 60}m`,
      price: `$${price}`,
      verdict: buy ? "BUY NOW" : "WAIT FOR DROP",
      confidence: 94 - i * 8,
    };
  });
}

function seedExpenses(flightPrice: number, city: string): Expense[] {
  const now = Date.now();
  return [
    { id: "e1", label: `Flight round-trip to ${city}`, amount: flightPrice, category: "Flight", timestamp: now - 8e7 },
    { id: "e2", label: `Hotel · ${city} · 5 nights`, amount: 720, category: "Accommodation", timestamp: now - 7e7 },
    { id: "e3", label: `Welcome dinner in ${city}`, amount: 62, category: "Food", timestamp: now - 6e7 },
    { id: "e4", label: `Museum & attraction passes`, amount: 45, category: "Transit", timestamp: now - 5e7 },
    { id: "e5", label: `Local transit pass · ${city}`, amount: 24, category: "Transit", timestamp: now - 4e7 },
  ];
}

/* ============================================================
   TRAVEL APP
   ============================================================ */

function TravelApp({ onSignOut }: { onSignOut: () => void }) {
  const [view, setView] = useState<View>("landing");
  const [query, setQuery] = useState("");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [active, setActive] = useState<Set<string>>(new Set(["🌱 Gluten-Free", "🏛️ Architecture"]));

  useEffect(() => {
    if (view !== "loading") return;
    const t = setTimeout(() => setView("dashboard"), 2400);
    return () => clearTimeout(t);
  }, [view]);

  const toggle = (f: string) => {
    setActive((prev) => {
      const n = new Set(prev);
      n.has(f) ? n.delete(f) : n.add(f);
      return n;
    });
  };

  const generate = () => {
    if (!query.trim()) return;
    setTrip(resolveTrip(query));
    setView("loading");
  };

  const reset = () => setView("landing");

  return (
    <div className="min-h-screen bg-slate-900 text-white antialiased">
      <Header onLogo={reset} onSignOut={onSignOut} />
      {view === "landing" && (
        <Landing query={query} setQuery={setQuery} active={active} toggle={toggle} onGenerate={generate} />
      )}
      {view === "loading" && <Loading query={query} />}
      {view === "dashboard" && trip && <Dashboard query={query} trip={trip} active={active} onReset={reset} />}
      <Footer />
    </div>
  );
}

function Header({ onLogo, onSignOut }: { onLogo: () => void; onSignOut: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button onClick={onLogo} className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-indigo-500 text-lg font-black shadow-lg shadow-emerald-500/20">
            ✈
          </span>
          <span className="text-lg font-bold tracking-tight">
            Aero<span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">Travel</span>{" "}
            <span className="text-white/60">AI</span>
          </span>
        </button>
        <nav className="flex items-center gap-6 text-sm text-white/60">
          <a className="hidden transition hover:text-white sm:inline" href="#features">Features</a>
          <a className="hidden transition hover:text-white sm:inline" href="#how">How it works</a>
          <button
            onClick={onSignOut}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-medium text-white transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}

function Landing({
  query,
  setQuery,
  active,
  toggle,
  onGenerate,
}: {
  query: string;
  setQuery: (v: string) => void;
  active: Set<string>;
  toggle: (f: string) => void;
  onGenerate: () => void;
}) {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-40 right-0 h-[400px] w-[600px] rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-32 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live price intelligence · 187 airlines
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
          Your trip, planned by <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            one smart prompt.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
          Flights, stays, restaurants, and a day-by-day itinerary — optimized for your budget, diet, and pace.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-emerald-500/5 backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onGenerate()}
              placeholder="e.g., Chennai to Germany for 5 days · try Paris, Tokyo, Barcelona, London..."
              className="flex-1 rounded-xl bg-slate-900/60 px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
            <button
              onClick={onGenerate}
              disabled={!query.trim()}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              Generate Smart Itinerary →
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => {
            const on = active.has(f);
            return (
              <button
                key={f}
                onClick={() => toggle(f)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  on
                    ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300 shadow-sm shadow-emerald-500/30"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div id="features" className="mt-24 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: "📉", title: "Price prediction", body: "Buy or wait — with confidence scores from 12M flight records." },
            { icon: "🍽️", title: "Diet-aware picks", body: "Restaurants filtered by real allergen + celiac certifications." },
            { icon: "🗺️", title: "Route-optimized days", body: "Minimum walking, maximum experience — down to the hour." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:border-white/20 hover:bg-white/[0.08]">
              <div className="text-2xl">{c.icon}</div>
              <div className="mt-3 font-semibold">{c.title}</div>
              <div className="mt-1 text-sm text-white/60">{c.body}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Loading({ query }: { query: string }) {
  const steps = ["Parsing your trip", "Scanning 187 airlines", "Matching dietary filters", "Optimizing your route"];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 550);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 text-3xl shadow-2xl shadow-emerald-500/40">
            ✈
          </div>
        </div>
        <p className="mt-6 truncate text-sm text-white/50">"{query}"</p>
        <div className="mt-8 space-y-3 text-left">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition ${
                  i < step ? "bg-emerald-500 text-slate-900" : i === step ? "bg-indigo-500 text-white animate-pulse" : "bg-white/10 text-white/40"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className={i <= step ? "text-white" : "text-white/40"}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Dashboard({ query, trip, active, onReset }: { query: string; trip: Trip; active: Set<string>; onReset: () => void }) {
  const [tab, setTab] = useState<Tab>("planner");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>(trip.seedExpenses);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "planner", label: "AI Planner", icon: "🗺️" },
    { id: "navigator", label: "Active Navigator", icon: "🧳" },
    { id: "journal", label: "Travel Journal", icon: "📸" },
  ];

  const headline = `${trip.origin.code} → ${trip.destination.city} · 5 days`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-emerald-400">
            Your itinerary · {trip.destination.country}
          </div>
          <h2 className="mt-1 truncate text-2xl font-bold sm:text-3xl">{headline}</h2>
          <p className="mt-1 truncate text-sm text-white/50">"{query}"</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...active].slice(0, 4).map((a) => (
            <span key={a} className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              {a}
            </span>
          ))}
          <button onClick={onReset} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10">
            ← New search
          </button>
        </div>
      </div>

      <div className="mb-8 flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
        {tabs.map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                on
                  ? "bg-gradient-to-r from-emerald-500 to-indigo-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="mr-1.5">{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="animate-[fade-in_0.4s_ease-out]" key={tab}>
        {tab === "planner" && <PlannerTab trip={trip} expenses={expenses} />}
        {tab === "navigator" && <NavigatorTab trip={trip} visits={visits} setVisits={setVisits} />}
        {tab === "journal" && (
          <JournalTab trip={trip} photos={photos} setPhotos={setPhotos} expenses={expenses} setExpenses={setExpenses} />
        )}
      </div>
    </main>
  );
}

function PlannerTab({ trip, expenses }: { trip: Trip; expenses: Expense[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <FlightWidget flights={trip.flights} />
        <TimelineWidget timeline={trip.timeline} city={trip.destination.city} />
      </div>
      <div className="space-y-6">
        <LivingDock restaurants={trip.restaurants} neighborhood={trip.destination.neighborhood} />
        <BudgetWidget expenses={expenses} />
      </div>
    </div>
  );
}

function NavigatorTab({
  trip,
  visits,
  setVisits,
}: {
  trip: Trip;
  visits: Visit[];
  setVisits: React.Dispatch<React.SetStateAction<Visit[]>>;
}) {
  const [selectedPlace, setSelectedPlace] = useState(trip.checkinPlaces[0]);
  const [directionsFor, setDirectionsFor] = useState<string | null>(null);

  const active = visits.find((v) => !v.endedAt);

  const checkIn = () => {
    setVisits((prev) => {
      const now = Date.now();
      const closed = prev.map((v) => (v.endedAt ? v : { ...v, endedAt: now }));
      return [...closed, { id: `v_${now}`, place: selectedPlace, startedAt: now }];
    });
  };

  const checkOut = () => {
    setVisits((prev) => prev.map((v) => (v.endedAt ? v : { ...v, endedAt: Date.now() })));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card title={`Active Trip Tracker · ${trip.destination.city}`} icon="📍">
          <div className="rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 p-5">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {active ? "Currently checked in" : "Ready to explore"}
            </div>
            <div className="mt-2 text-2xl font-bold">
              {active ? active.place : "Pick your next stop"}
            </div>
            {active && <LiveTimer since={active.startedAt} label="Time spent here" big />}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <select
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-emerald-400/50"
            >
              {trip.checkinPlaces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={checkIn}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02]"
            >
              📍 Check-In
            </button>
            {active && (
              <button
                onClick={checkOut}
                className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 font-medium text-red-300 transition hover:bg-red-500/20"
              >
                End Visit
              </button>
            )}
          </div>
        </Card>

        <Card title="Places Visited on This Trip" icon="🧭">
          {visits.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center text-sm text-white/40">
              No check-ins yet. Tap Check-In above to start logging your journey.
            </div>
          ) : (
            <ol className="space-y-3">
              {[...visits].reverse().map((v, idx) => {
                const isActive = !v.endedAt;
                return (
                  <li
                    key={v.id}
                    className={`rounded-xl border p-4 transition ${
                      isActive ? "border-emerald-400/40 bg-emerald-400/5" : "border-white/5 bg-slate-900/40"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 text-xs font-bold text-slate-950">
                            {visits.length - idx}
                          </span>
                          <div className="font-semibold">{v.place}</div>
                          {isActive && (
                            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 text-xs text-white/50">
                          Checked in at {new Date(v.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {" · "}
                          {isActive ? (
                            <LiveTimer since={v.startedAt} label="Time spent here" />
                          ) : (
                            <>Time spent here: {fmtDuration((v.endedAt! - v.startedAt))}</>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setDirectionsFor(directionsFor === v.id ? null : v.id)}
                        className="flex items-center gap-1.5 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/20"
                      >
                        <MapIcon /> {directionsFor === v.id ? "Hide" : "Get Directions"}
                      </button>
                    </div>

                    {directionsFor === v.id && <DirectionsOverlay place={v.place} />}
                  </li>
                );
              })}
            </ol>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Trip Stats" icon="📊">
          <div className="space-y-3">
            <Stat label="Places checked in" value={visits.length.toString()} />
            <Stat label="Currently exploring" value={active ? "1" : "0"} />
            <Stat
              label="Total time logged"
              value={fmtDuration(
                visits.reduce((sum, v) => sum + ((v.endedAt ?? Date.now()) - v.startedAt), 0)
              )}
            />
          </div>
        </Card>
        <Card title={`Nearby in ${trip.destination.city}`} icon="🌐">
          <div className="space-y-2">
            {trip.checkinPlaces.slice(0, 3).map((p, i) => (
              <div key={p} className="rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2 text-sm text-white/80">
                {p} · {2 + i * 2} min walk
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function LiveTimer({ since, label, big }: { since: number; label: string; big?: boolean }) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsed = Date.now() - since;
  if (big) {
    return (
      <div className="mt-3">
        <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
        <div className="mt-1 font-mono text-3xl font-black tabular-nums text-white">{fmtDuration(elapsed)}</div>
      </div>
    );
  }
  return (
    <span className="font-mono tabular-nums text-emerald-300">
      {label}: {fmtDuration(elapsed)}
    </span>
  );
}

function fmtDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, "0")}s`;
  return `${sec}s`;
}

function MapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function DirectionsOverlay({ place }: { place: string }) {
  const transit = 8 + Math.floor(Math.random() * 15);
  const walk = 0.4 + Math.random() * 1.6;
  const eta = new Date(Date.now() + transit * 60000);
  return (
    <div className="mt-4 animate-[fade-in_0.3s_ease-out] overflow-hidden rounded-xl border border-indigo-400/30 bg-slate-950/60">
      <div className="relative h-40 overflow-hidden bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.25),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.25),transparent_50%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 160" preserveAspectRatio="none">
          <path
            d="M30,130 Q120,20 200,90 T370,40"
            fill="none"
            stroke="url(#g)"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <circle cx="30" cy="130" r="6" fill="#34d399" />
          <circle cx="370" cy="40" r="6" fill="#818cf8" />
        </svg>
        <div className="absolute left-3 top-3 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
          You
        </div>
        <div className="absolute right-3 bottom-3 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
          {place}
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 text-center text-xs">
        <div className="p-3">
          <div className="text-white/40">Transit</div>
          <div className="mt-0.5 font-bold text-white">{transit} min</div>
        </div>
        <div className="p-3">
          <div className="text-white/40">Walking</div>
          <div className="mt-0.5 font-bold text-white">{walk.toFixed(1)} km</div>
        </div>
        <div className="p-3">
          <div className="text-white/40">Active ETA</div>
          <div className="mt-0.5 font-bold text-emerald-300">
            {eta.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-4 py-3">
      <span className="text-sm text-white/60">{label}</span>
      <span className="font-mono text-lg font-bold tabular-nums">{value}</span>
    </div>
  );
}

/* --------------------- JOURNAL TAB --------------------- */

function JournalTab({
  trip,
  photos,
  setPhotos,
  expenses,
  setExpenses,
}: {
  trip: Trip;
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card title={`${trip.destination.city} Memories`} icon="📸">
          <UploadZone trip={trip} photos={photos} setPhotos={setPhotos} />
          <PhotoGallery photos={photos} setPhotos={setPhotos} />
        </Card>
      </div>
      <div className="space-y-6">
        <ExpenseLedger expenses={expenses} setExpenses={setExpenses} />
      </div>
    </div>
  );
}

function UploadZone({
  trip,
  photos: _photos,
  setPhotos,
}: {
  trip: Trip;
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}) {
  const [dragging, setDragging] = useState(false);
  const [day, setDay] = useState(trip.timeline[0].day);
  const [place, setPlace] = useState(trip.checkinPlaces[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 12);
    const now = Date.now();
    const newPhotos: Photo[] = arr.map((f, i) => ({
      id: `p_${now}_${i}`,
      url: URL.createObjectURL(f),
      day,
      place,
      caption: "",
      timestamp: now + i,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const addSimulated = () => {
    const now = Date.now();
    const seed = Math.floor(Math.random() * 9999);
    const simulated: Photo = {
      id: `p_${now}`,
      url: `https://picsum.photos/seed/${seed}/600/400`,
      day,
      place,
      caption: "",
      timestamp: now,
    };
    setPhotos((prev) => [...prev, simulated]);
  };

  return (
    <div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"
        >
          {trip.timeline.map((d) => <option key={d.day}>{d.day}</option>)}
        </select>
        <select
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"
        >
          {trip.checkinPlaces.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
          else addSimulated();
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragging
            ? "border-emerald-400/60 bg-emerald-400/5"
            : "border-white/15 bg-slate-900/40 hover:border-emerald-400/40 hover:bg-white/[0.03]"
        }`}
      >
        <div className="text-4xl">📷</div>
        <div className="mt-3 font-semibold">Drop photos here</div>
        <div className="mt-1 text-sm text-white/50">or click to add — tagged to {day} · {place}</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <button
          onClick={(e) => { e.stopPropagation(); addSimulated(); }}
          className="mt-4 rounded-lg bg-white/5 px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
        >
          + Add simulated photo
        </button>
      </div>
    </div>
  );
}

function PhotoGallery({
  photos,
  setPhotos,
}: {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}) {
  const grouped = useMemo(() => {
    const g: Record<string, Photo[]> = {};
    photos.forEach((p) => {
      const key = `${p.day} · ${p.place}`;
      (g[key] ||= []).push(p);
    });
    return g;
  }, [photos]);

  const setCaption = (id: string, caption: string) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));

  const remove = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  if (photos.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-slate-900/40 p-6 text-center text-sm text-white/40">
        Your gallery is empty — add photos above to build your travel journal.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {Object.entries(grouped).map(([key, items]) => (
        <div key={key}>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-emerald-300">{key}</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-xl border border-white/5 bg-slate-900/40">
                <img src={p.url} alt="" className="aspect-[4/3] w-full object-cover transition group-hover:scale-105" />
                <button
                  onClick={() => remove(p.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                >
                  ✕
                </button>
                <input
                  value={p.caption}
                  onChange={(e) => setCaption(p.id, e.target.value)}
                  placeholder="Add caption..."
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* --------------------- EXPENSES --------------------- */

function ExpenseLedger({
  expenses,
  setExpenses,
}: {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");

  const totals = useMemo(() => {
    const t: Record<ExpenseCategory, number> = { Flight: 0, Accommodation: 0, Food: 0, Transit: 0 };
    expenses.forEach((e) => { t[e.category] += e.amount; });
    return t;
  }, [expenses]);

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!label.trim() || !amt || amt <= 0) return;
    setExpenses((prev) => [
      ...prev,
      { id: `e_${Date.now()}`, label: label.trim(), amount: amt, category, timestamp: Date.now() },
    ]);
    setLabel("");
    setAmount("");
  };

  const remove = (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  return (
    <Card title="Live Expense Ledger" icon="💰">
      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-white/50">Total spent</div>
        <div className="mt-1 text-3xl font-black tabular-nums">${total.toFixed(0)}</div>
        <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-white/5">
          {(Object.keys(totals) as ExpenseCategory[]).map((k) => {
            const pct = total > 0 ? (totals[k] / total) * 100 : 0;
            return <div key={k} className={`${CATEGORY_META[k].color} transition-all duration-500`} style={{ width: `${pct}%` }} />;
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {(Object.keys(totals) as ExpenseCategory[]).map((k) => (
            <div key={k} className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-sm ${CATEGORY_META[k].color}`} />
                <span className="text-white/70">{CATEGORY_META[k].icon}</span>
              </div>
              <span className="font-mono font-bold tabular-nums">${totals[k].toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={add} className="mt-4 space-y-2 rounded-xl border border-white/10 bg-slate-900/40 p-3">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Dinner at local bistro"
          className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-emerald-400/50"
        />
        <div className="flex gap-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            step="0.01"
            placeholder="$45"
            className="w-24 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-emerald-400/50"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-emerald-400/50"
          >
            {(Object.keys(CATEGORY_META) as ExpenseCategory[]).map((k) => (
              <option key={k} value={k}>{CATEGORY_META[k].icon} {k}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-indigo-500 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01]"
        >
          + Add Expense
        </button>
      </form>

      <div className="mt-4 max-h-80 space-y-1.5 overflow-y-auto pr-1">
        {[...expenses].reverse().map((e) => (
          <div key={e.id} className="group flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2 text-sm transition hover:border-white/10">
            <div className="flex min-w-0 items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${CATEGORY_META[e.category].color}`} />
              <span className="truncate">{e.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tabular-nums text-white">${e.amount.toFixed(0)}</span>
              <button
                onClick={() => remove(e.id)}
                className="rounded px-1.5 text-xs text-white/30 opacity-0 transition hover:text-red-300 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* --------------------- PLANNER WIDGETS --------------------- */

function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function FlightWidget({ flights }: { flights: Flight[] }) {
  return (
    <Card title="Flight & Price Intelligence" icon="✈️">
      <div className="space-y-3">
        {flights.map((f) => {
          const buy = f.verdict === "BUY NOW";
          return (
            <div
              key={f.airline}
              className="flex flex-col gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-4 transition hover:border-white/10 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="font-semibold">{f.airline}</div>
                <div className="text-sm text-white/50">{f.route} · {f.duration}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold">{f.price}</div>
                  <div className="text-xs text-white/40">round-trip</div>
                </div>
                <div className={`rounded-lg px-3 py-2 text-center text-xs font-bold ${buy ? "bg-emerald-500 text-slate-900" : "bg-amber-500 text-slate-900"}`}>
                  <div>{f.verdict}</div>
                  <div className="mt-0.5 opacity-80">{f.confidence}% Confidence</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function LivingDock({ restaurants, neighborhood }: { restaurants: Restaurant[]; neighborhood: string }) {
  return (
    <Card title="Living & Restaurant Dock" icon="🏨">
      <div className="rounded-xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-indigo-300">Recommended neighborhood</div>
        <div className="mt-1 text-lg font-bold">{neighborhood}</div>
        <div className="mt-1 text-sm text-white/70">Best for architecture & low commute times</div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-white/40">Curated restaurants</div>
        {restaurants.map((r) => (
          <div key={r.name} className="rounded-lg border border-white/5 bg-slate-900/40 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate font-semibold">{r.name}</div>
                <div className="truncate text-xs text-white/50">{r.cuisine}</div>
              </div>
              <span className="shrink-0 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                {r.tag}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-white/60">
              <span>🕐</span>
              <span>Best time: {r.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TimelineWidget({ timeline, city }: { timeline: TimelineDay[]; city: string }) {
  return (
    <Card title={`Route-Optimized Timeline · ${city}`} icon="🗺️">
      <div className="relative space-y-6 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-emerald-400/50 before:via-indigo-400/50 before:to-transparent">
        {timeline.map((day) => (
          <div key={day.day} className="relative">
            <div className="absolute -left-[22px] top-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-gradient-to-br from-emerald-400 to-indigo-500" />
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold">{day.day}</h4>
              <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                💡 Insider Hack
              </span>
              <span className="text-xs text-amber-200/80">{day.hack}</span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {day.slots.map((s) => (
                <div key={s.period} className="rounded-lg border border-white/5 bg-slate-900/40 p-3 transition hover:border-emerald-400/30">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{s.period}</div>
                  <div className="mt-1 text-sm text-white/85">{s.activity}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BudgetWidget({ expenses }: { expenses: Expense[] }) {
  const totals = useMemo(() => {
    const t: Record<ExpenseCategory, number> = { Flight: 0, Accommodation: 0, Food: 0, Transit: 0 };
    expenses.forEach((e) => { t[e.category] += e.amount; });
    return t;
  }, [expenses]);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  return (
    <Card title="Financial Allocation" icon="💰">
      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-white/50">Projected Total</div>
        <div className="mt-1 text-3xl font-black tabular-nums">${total.toFixed(0)}</div>
      </div>
      <div className="mt-4">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
          {(Object.keys(totals) as ExpenseCategory[]).map((k) => {
            const pct = total > 0 ? (totals[k] / total) * 100 : 0;
            return <div key={k} className={`${CATEGORY_META[k].color} h-full transition-all duration-500`} style={{ width: `${pct}%` }} />;
          })}
        </div>
        <div className="mt-4 space-y-2">
          {(Object.keys(totals) as ExpenseCategory[]).map((k) => {
            const pct = total > 0 ? (totals[k] / total) * 100 : 0;
            return (
              <div key={k} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-sm ${CATEGORY_META[k].color}`} />
                  <span className="text-white/80">{CATEGORY_META[k].label}</span>
                </div>
                <div className="text-white/60">
                  {pct.toFixed(0)}% · <span className="font-mono tabular-nums text-white">${totals[k].toFixed(0)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-200/80">
          💡 Add quick expenses in the <b>Travel Journal</b> tab to see this update live.
        </div>
      </div>
    </Card>
  );
}

function Footer() {
  return (
    <footer id="how" className="mt-16 border-t border-white/5 py-8 text-center text-xs text-white/40">
      Built with real-time price feeds, dietary databases, and route-graph optimization. © AeroTravel AI
    </footer>
  );
}
