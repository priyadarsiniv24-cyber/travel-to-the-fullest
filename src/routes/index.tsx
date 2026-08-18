import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/AppShell";
import { TeddyCompanion } from "@/components/TeddyCompanion";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AeroTravel AI — Your AI Travel Companion" },
      {
        name: "description",
        content:
          "Tell AeroTravel AI where you're going, how long you're staying and what you love. Get a realistic day-by-day itinerary with local-currency estimates — and honest labels on every figure.",
      },
      { property: "og:title", content: "AeroTravel AI — Your AI Travel Companion" },
      {
        property: "og:description",
        content:
          "Describe your trip in one paragraph. Get a route-optimised itinerary, local-currency budget and clearly-labelled data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const QUICK = [
  { label: "Budget trips", prompt: "Suggest an affordable 4-day trip from Chennai with great food and nature" },
  { label: "Hidden gems", prompt: "7 days in Japan focused on hidden gems and photography spots" },
  { label: "3-day escape", prompt: "Best 3-day getaway from Bengaluru for a couple, relaxed pace" },
  { label: "Family week", prompt: "7 family-friendly days in Singapore with two kids, mid-range budget" },
  { label: "Food trail", prompt: "5 days in Italy for a food lover, vegetarian friendly, mid budget" },
  { label: "Europe history", prompt: "8 days from Chennai to Germany visiting Berlin and Munich — history, food, photography, affordable" },
];

function Landing() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
  }, []);

  function start(text: string) {
    const q = text.trim();
    if (!signedIn) {
      void navigate({ to: "/auth" });
      return;
    }
    void navigate({ to: "/ai", search: q ? { q } : {} });
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 aurora" aria-hidden="true" />

      <header className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandMark />
        <div className="flex items-center gap-2">
          {signedIn ? (
            <Link
              to="/trips"
              className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-primary"
            >
              My trips
            </Link>
          ) : (
            <Link
              to="/auth"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/80 px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          Your AI travel companion
        </p>

        <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          Where are we going next? <span className="whitespace-nowrap">✈️</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Tell us where you're going, how long you're staying and what you love. We'll turn it into a
          realistic day-by-day plan — with local currency and honest labels on every number.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            start(prompt);
          }}
          className="panel mt-8 rounded-3xl p-4 sm:p-5"
        >
          <label htmlFor="home-prompt" className="sr-only">
            Tell me about your trip
          </label>
          <textarea
            id="home-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="I'm travelling from Chennai to Germany for 8 days. I love history, food and photography and have a medium budget…"
            className="w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-[15px] leading-relaxed outline-none focus:border-primary"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {signedIn ? "Ready when you are." : "Free account needed to save your plans."}
            </p>
            <button
              type="submit"
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-opacity hover:opacity-90"
            >
              Plan my trip
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q.label}
              onClick={() => start(q.prompt)}
              className="rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] font-medium transition-colors hover:border-primary hover:bg-primary/10"
            >
              {q.label}
            </button>
          ))}
        </div>

        <section className="mt-14 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Realistic days",
              body: "Routes are clustered by area with honest travel times — no 9:00 Berlin, 9:30 Munich.",
            },
            {
              title: "Local currency",
              body: "Germany in €, Japan in ¥, Kerala in ₹. Conversions use live ECB reference rates.",
            },
            {
              title: "Never invented",
              body: "No fake airlines, fares or ratings. If live data isn't connected, we say so.",
            },
          ].map((card) => (
            <div key={card.title} className="panel rounded-2xl p-5">
              <h2 className="font-display text-base font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </section>
      </main>

      <TeddyCompanion message="Hi! I'm Pippa. Tell me about your trip and I'll plan the days with you. 🌸" mood="wave" />
    </div>
  );
}
