import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";

import { AppShell } from "@/components/AppShell";
import { Teddy } from "@/components/TeddyCompanion";
import { planTripFromPrompt } from "@/lib/planner.functions";

const searchSchema = z.object({ q: z.string().max(3000).optional() });

export const Route = createFileRoute("/_authenticated/ai")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "AI travel planner — AeroTravel AI" },
      {
        name: "description",
        content:
          "Describe your trip in your own words and AeroTravel AI builds a realistic day-by-day itinerary with local-currency estimates.",
      },
      { property: "og:title", content: "AI travel planner — AeroTravel AI" },
      {
        property: "og:description",
        content: "Tell us about your trip in a sentence — we'll plan the days, routes and budget.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiPlanner,
});

const SUGGESTIONS: { group: string; items: string[] }[] = [
  {
    group: "Budget",
    items: [
      "Affordable 4-day trip from Chennai to Kerala for 2 people on a tight budget",
      "Budget-friendly 5-day international trip from Delhi for under ₹60,000",
      "Cheap weekend getaway from Bengaluru with lots of nature",
    ],
  },
  {
    group: "Food",
    items: [
      "3 days in Bangkok focused on street food and local markets, vegetarian friendly",
      "5 days in Italy for a food lover, mid-range budget",
    ],
  },
  {
    group: "Experience",
    items: [
      "7 days in Japan for photography — sunrise spots, temples and hidden gems",
      "6 days in Germany visiting Berlin and Munich, history and museums",
      "5 relaxed days in Bali with sunsets and spa time",
    ],
  },
];

const STAGES = [
  "Understanding your trip…",
  "Finding places you'll love…",
  "Optimising the route…",
  "Checking realistic travel times…",
  "Estimating your budget in local currency…",
  "Preparing your itinerary…",
];

function AiPlanner() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const plan = useServerFn(planTripFromPrompt);

  const [prompt, setPrompt] = useState(q ?? "");
  const [answers, setAnswers] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [stage, setStage] = useState(0);

  const mutation = useMutation({
    mutationFn: (input: { prompt: string; extra: string | null }) => plan({ data: input }),
    onSuccess: (res) => {
      if (!res.ok) {
        setQuestions(res.questions);
        return;
      }
      setQuestions([]);
      void queryClient.invalidateQueries({ queryKey: ["trips"] });
      void navigate({ to: "/trip/$tripId", params: { tripId: res.tripId } });
    },
  });

  useEffect(() => {
    if (!mutation.isPending) {
      setStage(0);
      return;
    }
    const id = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 3500);
    return () => clearInterval(id);
  }, [mutation.isPending]);

  function submit() {
    if (prompt.trim().length < 8 || mutation.isPending) return;
    mutation.mutate({ prompt: prompt.trim(), extra: answers.trim() || null });
  }

  if (mutation.isPending) {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl py-10 text-center">
          <Teddy mood="excited" className="mx-auto size-20 teddy-bob" />
          <h1 className="mt-6 font-display text-2xl font-semibold">{STAGES[stage]}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This usually takes 15–40 seconds. I'd rather take a moment than guess.
          </p>
          <div className="mt-8 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl border border-hairline bg-secondary/60"
                style={{ animationDelay: `${i * 140}ms` }}
              />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Tell me about your trip ✈️
        </h1>
        <p className="mt-2 text-muted-foreground">
          One paragraph is enough — where you're starting from, where you're going, how long, and
          what you love. No forms required.
        </p>

        <div className="panel mt-6 rounded-3xl p-4 sm:p-5">
          <label htmlFor="trip-prompt" className="sr-only">
            Describe your trip
          </label>
          <textarea
            id="trip-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="I'm travelling from Chennai to Germany for 8 days with two friends. We want Berlin and Munich, good local food, historical places and photography — keep it affordable."
            className="w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-[15px] leading-relaxed outline-none focus:border-primary"
          />

          {questions.length ? (
            <div className="mt-4 rounded-2xl border border-primary/40 bg-primary/10 p-4">
              <p className="text-sm font-semibold">A couple of quick things first:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                {questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
              <textarea
                value={answers}
                onChange={(e) => setAnswers(e.target.value)}
                rows={2}
                placeholder="Answer here and I'll plan it…"
                className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          ) : null}

          {mutation.error ? (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              <span>
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : "We couldn't build your plan just now."}
              </span>
              <button onClick={submit} className="rounded-lg border border-destructive/40 px-2.5 py-1 text-xs font-semibold">
                Try again
              </button>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Costs are AI estimates in the destination's local currency — never quoted prices.
            </p>
            <button
              onClick={submit}
              disabled={prompt.trim().length < 8}
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Plan my trip
            </button>
          </div>
        </div>

        <div className="mt-10 space-y-5">
          {SUGGESTIONS.map((group) => (
            <div key={group.group}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {group.group}
              </h2>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {group.items.map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setPrompt(idea)}
                    className="rounded-full border border-border bg-surface px-3.5 py-2 text-left text-[13px] transition-colors hover:border-primary hover:bg-primary/10"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
