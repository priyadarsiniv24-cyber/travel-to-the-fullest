import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/AppShell";
import { DataStatusBadge } from "@/components/DataStatusBadge";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AeroTravel AI — Honest AI Travel Planning" },
      {
        name: "description",
        content:
          "Plan detailed multi-day trips with realistic travel times, live currency rates and clearly-labelled data. AeroTravel AI never invents flights, hotels or prices.",
      },
      { property: "og:title", content: "AeroTravel AI — Honest AI Travel Planning" },
      {
        property: "og:description",
        content:
          "A travel coordinator that labels every figure live, verified, estimated or AI-suggested — and says so when data isn't available.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 aurora" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" aria-hidden="true" />

      <header className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandMark />
        <Link
          to={signedIn ? "/trips" : "/auth"}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
        >
          {signedIn ? "My trips" : "Sign in"}
        </Link>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-28 pt-16 sm:px-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          A travel coordinator that admits what it doesn't know
        </p>

        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Plans built on <span className="text-primary">sourced facts</span>, not confident
          guesses.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Most AI planners invent flight numbers and restaurant ratings. AeroTravel AI labels every
          figure by where it came from — and tells you plainly when live data isn't available.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to={signedIn ? "/plan" : "/auth"}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {signedIn ? "Plan a trip" : "Create your account"}
          </Link>
          <Link
            to={signedIn ? "/trips" : "/auth"}
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/50"
          >
            {signedIn ? "My trips" : "Sign in"}
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              {
                status: "live" as const,
                title: "Live data",
                body: "Currency rates come from live ECB reference data. Flight and stay providers plug straight in.",
              },
              {
                status: "verified" as const,
                title: "Verified sources",
                body: "Emergency numbers, visa rules and official guidance are linked to their source, never recalled from memory.",
              },
              {
                status: "estimated" as const,
                title: "Honest estimates",
                body: "Modelled costs and travel times are shown as estimates, clearly separated from quoted prices.",
              },
              {
                status: "ai_recommendation" as const,
                title: "AI suggestions",
                body: "Ideas and pacing are AI-generated and marked as such, so you know what still needs checking.",
              },
            ]
          ).map((c) => (
            <div key={c.title} className="panel rounded-2xl p-5">
              <DataStatusBadge status={c.status} />
              <h3 className="mt-3 font-display text-base font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
