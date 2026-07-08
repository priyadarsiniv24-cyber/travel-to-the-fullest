import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: TravelApp,
});

type View = "landing" | "loading" | "dashboard";

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

const BUDGET = [
  { label: "Flights", pct: 40, color: "bg-emerald-500" },
  { label: "Lodging", pct: 30, color: "bg-indigo-500" },
  { label: "Food", pct: 15, color: "bg-amber-500" },
  { label: "Activities", pct: 15, color: "bg-fuchsia-500" },
];

function TravelApp() {
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

  const reset = () => {
    setView("landing");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white antialiased">
      <Header onLogo={reset} />
      {view === "landing" && (
        <Landing
          query={query}
          setQuery={setQuery}
          active={active}
          toggle={toggle}
          onGenerate={generate}
        />
      )}
      {view === "loading" && <Loading query={query} />}
      {view === "dashboard" && <Dashboard query={query} active={active} onReset={reset} />}
      <Footer />
    </div>
  );
}

function Header({ onLogo }: { onLogo: () => void }) {
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
        <nav className="hidden items-center gap-6 text-sm text-white/60 sm:flex">
          <a className="transition hover:text-white" href="#features">Features</a>
          <a className="transition hover:text-white" href="#how">How it works</a>
          <button className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition hover:bg-white/20">
            Sign in
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
      {/* glow */}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FlightWidget />
          <TimelineWidget />
        </div>
        <div className="space-y-6">
          <LivingDock />
          <BudgetWidget />
        </div>
      </div>
    </main>
  );
}

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
                <div className="text-sm text-white/50">
                  {f.route} · {f.duration}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold">{f.price}</div>
                  <div className="text-xs text-white/40">round-trip</div>
                </div>
                <div
                  className={`rounded-lg px-3 py-2 text-center text-xs font-bold ${
                    buy ? "bg-emerald-500 text-slate-900" : "bg-amber-500 text-slate-900"
                  }`}
                >
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

function BudgetWidget() {
  const total = useMemo(() => "$2,400", []);
  return (
    <Card title="Financial Allocation" icon="💰">
      <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
        <div className="text-xs font-medium uppercase tracking-wider text-white/50">Projected Total Budget</div>
        <div className="mt-1 text-3xl font-black">{total}</div>
      </div>

      <div className="mt-4">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
          {BUDGET.map((b) => (
            <div key={b.label} className={`${b.color} h-full transition-all`} style={{ width: `${b.pct}%` }} />
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {BUDGET.map((b) => (
            <div key={b.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-sm ${b.color}`} />
                <span className="text-white/80">{b.label}</span>
              </div>
              <div className="text-white/60">
                {b.pct}% · <span className="text-white">${Math.round(2400 * (b.pct / 100))}</span>
              </div>
            </div>
          ))}
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
