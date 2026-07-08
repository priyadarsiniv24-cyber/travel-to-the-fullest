import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [authed, setAuthed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaving(true);
    setTimeout(() => {
      setAuthed(true);
      setLeaving(false);
    }, 650);
  };

  const handleSignOut = () => setAuthed(false);

  if (!authed) return <AuthGate leaving={leaving} onSubmit={handleSignIn} />;
  return (
    <div className="animate-[fade-in_0.5s_ease-out]">
      <TravelApp onSignOut={handleSignOut} />
    </div>
  );
}

function AuthGate({ leaving, onSubmit }: { leaving: boolean; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950 px-4 transition-all duration-700 ${
        leaving ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="relative w-full max-w-md animate-[scale-in_0.4s_ease-out] rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-500 text-2xl font-black shadow-lg shadow-emerald-500/30">
            ✈
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Aero<span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">Travel</span>{" "}
            <span className="text-white/60">AI</span>
          </h1>
          <p className="text-sm text-white/60">Sign in to plan your next journey</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Email</label>
            <input
              type="email"
              required
              defaultValue="traveler@aero.ai"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-emerald-400/50 focus:bg-white/10"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Password</label>
            <input
              type="password"
              required
              defaultValue="demo1234"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-emerald-400/50 focus:bg-white/10"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-indigo-500 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] hover:shadow-emerald-500/50"
          >
            Sign In →
          </button>
          <p className="pt-2 text-center text-xs text-white/40">
            New here? <span className="cursor-pointer text-emerald-400 hover:underline">Create an account</span>
          </p>
        </form>
      </div>
    </div>
  );
}

type View = "landing" | "loading" | "dashboard";
type Tab = "planner" | "navigator" | "journal";

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

const FLIGHTS = [
  { airline: "United Airlines", route: "JFK → CDG", duration: "7h 25m", price: "$612", verdict: "BUY NOW", confidence: 94 },
  { airline: "Air France", route: "JFK → CDG", duration: "7h 40m", price: "$684", verdict: "WAIT FOR DROP", confidence: 78 },
  { airline: "Delta", route: "JFK → CDG", duration: "7h 55m", price: "$701", verdict: "WAIT FOR DROP", confidence: 71 },
];

const RESTAURANTS = [
  { name: "Noglu", cuisine: "French Bistro", tag: "100% Celiac Safe", time: "11:30 AM – 1:00 PM" },
  { name: "Chambelland", cuisine: "Bakery & Café", tag: "Gluten-Free Certified", time: "8:00 AM – 9:30 AM" },
  { name: "NoGlu Marais", cuisine: "Modern French", tag: "Dedicated GF Kitchen", time: "6:30 PM – 7:45 PM" },
  { name: "Café Pinson", cuisine: "Organic Vegan", tag: "Allergen Aware", time: "12:00 PM – 1:15 PM" },
];

const TIMELINE = [
  {
    day: "Day 1",
    hack: "Enter through the side gate at 8:45 AM to skip 90-min queues.",
    slots: [
      { period: "Morning", activity: "Notre-Dame exterior + Île de la Cité walk" },
      { period: "Afternoon", activity: "Sainte-Chapelle stained glass tour" },
      { period: "Evening", activity: "Seine sunset stroll + dinner at Noglu" },
    ],
  },
  {
    day: "Day 2",
    hack: "Book Louvre entry for 6:00 PM — half the crowds, same masterpieces.",
    slots: [
      { period: "Morning", activity: "Musée d'Orsay (open at 9:30 AM)" },
      { period: "Afternoon", activity: "Tuileries Garden + Palais Royal arcades" },
      { period: "Evening", activity: "Louvre evening entry (Wed / Fri)" },
    ],
  },
  {
    day: "Day 3",
    hack: "Take the 82 bus, not the metro — cheaper views of the Eiffel Tower.",
    slots: [
      { period: "Morning", activity: "Trocadéro viewpoint + Eiffel Tower climb" },
      { period: "Afternoon", activity: "Rodin Museum sculpture garden" },
      { period: "Evening", activity: "Rue Cler food street tasting" },
    ],
  },
  {
    day: "Day 4",
    hack: "Père Lachaise map is free at the entrance — skip the paid tours.",
    slots: [
      { period: "Morning", activity: "Le Marais architecture walk" },
      { period: "Afternoon", activity: "Picasso Museum (Marais)" },
      { period: "Evening", activity: "Père Lachaise golden hour visit" },
    ],
  },
  {
    day: "Day 5",
    hack: "Versailles opens at 9 AM — arrive 8:30 to be first through the Hall of Mirrors.",
    slots: [
      { period: "Morning", activity: "RER C to Versailles — palace tour" },
      { period: "Afternoon", activity: "Versailles gardens + Marie-Antoinette estate" },
      { period: "Evening", activity: "Return to Paris — farewell dinner Le Marais" },
    ],
  },
];

const CHECKIN_PLACES = [
  "Notre-Dame Cathedral",
  "Louvre Museum",
  "Eiffel Tower",
  "Sainte-Chapelle",
  "Musée d'Orsay",
  "Le Marais District",
  "Palais Royal",
  "Père Lachaise",
  "Versailles Palace",
  "Rue Cler Market",
];

type Visit = { id: string; place: string; startedAt: number; endedAt?: number };
type Photo = { id: string; url: string; day: string; place: string; caption: string; timestamp: number };
type Expense = { id: string; label: string; amount: number; category: ExpenseCategory; timestamp: number };
type ExpenseCategory = "Flight" | "Accommodation" | "Food" | "Transit";

const INITIAL_EXPENSES: Expense[] = [
  { id: "e1", label: "United JFK→CDG round-trip", amount: 612, category: "Flight", timestamp: Date.now() - 8e7 },
  { id: "e2", label: "Hôtel Le Marais · 5 nights", amount: 720, category: "Accommodation", timestamp: Date.now() - 7e7 },
  { id: "e3", label: "Noglu dinner", amount: 62, category: "Food", timestamp: Date.now() - 6e7 },
  { id: "e4", label: "Louvre evening entry", amount: 22, category: "Transit", timestamp: Date.now() - 5e7 },
  { id: "e5", label: "Metro carnet (10 tickets)", amount: 17, category: "Transit", timestamp: Date.now() - 4e7 },
];

const CATEGORY_META: Record<ExpenseCategory, { color: string; icon: string; label: string }> = {
  Flight: { color: "bg-emerald-500", icon: "✈️", label: "Flight Expenses" },
  Accommodation: { color: "bg-indigo-500", icon: "🏨", label: "Accommodation/Hotel" },
  Food: { color: "bg-amber-500", icon: "🍽️", label: "Food & Dining" },
  Transit: { color: "bg-fuchsia-500", icon: "🚇", label: "Transit/Activities" },
};

function TravelApp({ onSignOut }: { onSignOut: () => void }) {
  const [view, setView] = useState<View>("landing");
  const [query, setQuery] = useState("");
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
      {view === "dashboard" && <Dashboard query={query} active={active} onReset={reset} />}
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
              placeholder="e.g., Flying from JFK to Paris for 5 days, moderate budget, strictly gluten-free, love architecture but hate crowds..."
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

function Dashboard({ query, active, onReset }: { query: string; active: Set<string>; onReset: () => void }) {
  const [tab, setTab] = useState<Tab>("planner");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "planner", label: "AI Planner", icon: "🗺️" },
    { id: "navigator", label: "Active Navigator", icon: "🧳" },
    { id: "journal", label: "Travel Journal", icon: "📸" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-emerald-400">Your itinerary</div>
          <h2 className="mt-1 truncate text-2xl font-bold sm:text-3xl">JFK → Paris · 5 days</h2>
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

      {/* Tab bar */}
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
        {tab === "planner" && <PlannerTab expenses={expenses} />}
        {tab === "navigator" && <NavigatorTab visits={visits} setVisits={setVisits} />}
        {tab === "journal" && <JournalTab photos={photos} setPhotos={setPhotos} expenses={expenses} setExpenses={setExpenses} />}
      </div>
    </main>
  );
}

function PlannerTab({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <FlightWidget />
        <TimelineWidget />
      </div>
      <div className="space-y-6">
        <LivingDock />
        <BudgetWidget expenses={expenses} />
      </div>
    </div>
  );
}

function NavigatorTab({ visits, setVisits }: { visits: Visit[]; setVisits: React.Dispatch<React.SetStateAction<Visit[]>> }) {
  const [selectedPlace, setSelectedPlace] = useState(CHECKIN_PLACES[0]);
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
        <Card title="Active Trip Tracker" icon="📍">
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
              {CHECKIN_PLACES.map((p) => (
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
        <Card title="Nearby Now" icon="🌐">
          <div className="space-y-2">
            {["Café de Flore · 2 min walk", "Metro Saint-Michel · 4 min", "Shakespeare & Co · 6 min"].map((p) => (
              <div key={p} className="rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2 text-sm text-white/80">
                {p}
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
  photos,
  setPhotos,
  expenses,
  setExpenses,
}: {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Trip Memories" icon="📸">
          <UploadZone photos={photos} setPhotos={setPhotos} />
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
  photos,
  setPhotos,
}: {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}) {
  const [dragging, setDragging] = useState(false);
  const [day, setDay] = useState(TIMELINE[0].day);
  const [place, setPlace] = useState(CHECKIN_PLACES[0]);
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
          {TIMELINE.map((d) => <option key={d.day}>{d.day}</option>)}
        </select>
        <select
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"
        >
          {CHECKIN_PLACES.map((p) => <option key={p}>{p}</option>)}
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
      <div className="mt-2 text-right text-xs text-white/40">{photos.length} photo{photos.length === 1 ? "" : "s"} in this trip</div>
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

  const updateCaption = (id: string, caption: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const remove = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  if (photos.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center text-sm text-white/40">
        Your memories will appear here as beautiful grouped cards.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group}>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-white/10" />
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">{group}</div>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((p) => (
              <div key={p.id} className="group overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur transition hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img src={p.url} alt={p.caption || p.place} className="h-full w-full object-cover transition group-hover:scale-105" />
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute right-2 top-2 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-bold text-red-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/30"
                  >
                    Remove
                  </button>
                  <div className="absolute bottom-2 left-2 rounded-md bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur">
                    {new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <input
                  value={p.caption}
                  onChange={(e) => updateCaption(p.id, e.target.value)}
                  placeholder="Write a caption or journal note…"
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

function FlightWidget() {
  return (
    <Card title="Flight & Price Intelligence" icon="✈️">
      <div className="space-y-3">
        {FLIGHTS.map((f) => {
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

function LivingDock() {
  return (
    <Card title="Living & Restaurant Dock" icon="🏨">
      <div className="rounded-xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-indigo-300">Recommended neighborhood</div>
        <div className="mt-1 text-lg font-bold">Le Marais, Paris</div>
        <div className="mt-1 text-sm text-white/70">Best for architecture & low commute times</div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-white/40">Curated restaurants</div>
        {RESTAURANTS.map((r) => (
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

function TimelineWidget() {
  return (
    <Card title="Master Route-Optimized Timeline" icon="🗺️">
      <div className="relative space-y-6 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-emerald-400/50 before:via-indigo-400/50 before:to-transparent">
        {TIMELINE.map((day) => (
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
