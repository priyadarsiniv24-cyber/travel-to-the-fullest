import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/AppShell";
import { DataStatusBadge, NotConfiguredPanel } from "@/components/DataStatusBadge";
import { searchTravelOptions } from "@/lib/search.functions";
import { getTrip } from "@/lib/trips.functions";
import {
  TRIP_STATUS_LABEL,
  formatDateRange,
  formatMoney,
  tripNights,
  type TripStatus,
} from "@/lib/travel";

export const Route = createFileRoute("/_authenticated/trip/$tripId")({
  head: () => ({
    meta: [
      { title: "Trip details — AeroTravel AI" },
      {
        name: "description",
        content:
          "Your trip brief, budget and live availability status — with every figure labelled by its source.",
      },
      { property: "og:title", content: "Trip details — AeroTravel AI" },
      {
        property: "og:description",
        content: "Trip brief, budget and booking options with transparent data sourcing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TripDetail,
});

function TripDetail() {
  const { tripId } = Route.useParams();
  const fetchTrip = useServerFn(getTrip);
  const search = useServerFn(searchTravelOptions);

  const { data, isLoading, error } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => fetchTrip({ data: { tripId } }),
  });

  const trip = data?.trip;

  const availability = useQuery({
    queryKey: ["availability", tripId],
    enabled: Boolean(trip),
    queryFn: () =>
      search({
        data: {
          origin: trip!.origin,
          destination: trip!.destination,
          startDate: trip!.start_date,
          endDate: trip!.end_date,
          adults: trip!.adults,
          currency: trip!.display_currency,
        },
      }),
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="h-64 animate-pulse rounded-2xl border border-hairline bg-surface/60" />
      </AppShell>
    );
  }

  if (error || !trip) {
    return (
      <AppShell>
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Trip not found."}
        </p>
        <Link to="/trips" className="mt-4 inline-block text-sm text-primary hover:underline">
          ← Back to my trips
        </Link>
      </AppShell>
    );
  }

  const nights = tripNights(trip.start_date, trip.end_date);
  const flightLinks = availability.data?.links.filter((l) => l.kind === "flights") ?? [];
  const stayLinks = availability.data?.links.filter((l) => l.kind === "stays") ?? [];

  const days = data?.days ?? [];
  const items = data?.items ?? [];
  const itemsByDay = new Map<string, typeof items>();
  for (const item of items) {
    if (!item.day_id) continue;
    const bucket = itemsByDay.get(item.day_id) ?? [];
    bucket.push(item);
    itemsByDay.set(item.day_id, bucket);
  }
  const estimateLines = (data?.expenses ?? []).filter(
    (e) => e.estimated_amount !== null && e.estimated_amount !== undefined,
  );
  const estimatedTotal = estimateLines.reduce((sum, e) => sum + Number(e.estimated_amount), 0);

  const tripContext = [
    `Trip: ${trip.title} — ${trip.origin} → ${trip.destination}`,
    `Dates: ${formatDateRange(trip.start_date, trip.end_date)}`,
    `Travellers: ${trip.adults} adults, ${trip.children} children · pace ${trip.activity_intensity}`,
    `Currency: ${trip.display_currency}${trip.budget_amount ? ` · budget ${trip.budget_amount}` : ""}`,
    `Interests: ${trip.interests?.join(", ") || "not specified"}`,
    days.length
      ? `Itinerary:\n${days
          .map(
            (d) =>
              `Day ${d.day_index}${d.location ? ` (${d.location})` : ""}: ${(itemsByDay.get(d.id) ?? [])
                .map((i) => `${i.start_time ?? ""} ${i.title}`.trim())
                .join("; ")}`,
          )
          .join("\n")}`
      : "Itinerary: none generated yet.",
  ].join("\n");

  return (
    <AppShell tripContext={tripContext}>

      <Link to="/trips" className="text-sm text-muted-foreground hover:text-foreground">
        ← My trips
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{trip.title}</h1>
          <p className="mt-1.5 text-muted-foreground">
            {trip.origin} → {trip.destination} · {formatDateRange(trip.start_date, trip.end_date)}
          </p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {TRIP_STATUS_LABEL[trip.status as TripStatus]}
        </span>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Stat label="Nights" value={nights !== null ? String(nights) : "—"} />
        <Stat
          label="Travellers"
          value={`${trip.adults}${trip.children ? ` + ${trip.children}` : ""}`}
        />
        <Stat
          label="Budget"
          value={formatMoney(
            trip.budget_amount ? Number(trip.budget_amount) : null,
            trip.budget_currency,
          )}
        />
        <Stat label="Pace" value={trip.activity_intensity} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="panel rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">Flights</h2>
              <DataStatusBadge status="live" />
            </div>
            <div className="mt-4">
              {availability.isLoading ? (
                <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
              ) : availability.data?.flights.results.length ? (
                <ul className="space-y-2">
                  {availability.data.flights.results.map((f) => (
                    <li key={f.id} className="rounded-xl border border-border p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {f.carrier} {f.flightNumber}
                        </span>
                        <span>{formatMoney(f.price, f.currency)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <NotConfiguredPanel
                  title="Live flight search is not configured"
                  notice={
                    availability.data?.flights.notice ??
                    "No flight provider is connected, so no fares, airlines or flight numbers can be shown. Nothing here is invented."
                  }
                  links={flightLinks}
                />
              )}
            </div>
          </section>

          <section className="panel rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">Accommodation</h2>
              <DataStatusBadge status="live" />
            </div>
            <div className="mt-4">
              {availability.isLoading ? (
                <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
              ) : availability.data?.stays.results.length ? (
                <ul className="space-y-2">
                  {availability.data.stays.results.map((s) => (
                    <li key={s.id} className="rounded-xl border border-border p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{s.name}</span>
                        <span>{formatMoney(s.pricePerNight, s.currency)}/night</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <NotConfiguredPanel
                  title="Live accommodation search is not configured"
                  notice={
                    availability.data?.stays.notice ??
                    "No accommodation provider is connected, so no hotels, ratings or nightly rates can be shown."
                  }
                  links={stayLinks}
                />
              )}
            </div>
          </section>

          <section className="panel rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">Day-by-day itinerary</h2>
              <DataStatusBadge status="ai_recommendation" />
            </div>
            {days.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                No days have been generated for this trip yet. Describe it to the AI planner and
                it will build a realistic day-by-day plan.
              </p>
            ) : (
              <div className="mt-5 space-y-7">
                {days.map((day) => (
                  <div key={day.id}>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="font-display text-base font-semibold uppercase tracking-wide">
                        Day {day.day_index}
                        {day.location ? ` — ${day.location}` : ""}
                      </h3>
                      {day.day_date ? (
                        <span className="text-xs text-muted-foreground">
                          {new Date(day.day_date).toLocaleDateString(undefined, {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      ) : null}
                    </div>
                    {day.notes ? (
                      <p className="mt-1 text-sm text-muted-foreground">{day.notes}</p>
                    ) : null}
                    <ol className="mt-3 space-y-2.5 border-l border-hairline pl-4">
                      {itemsByDay.get(day.id)?.map((item) => (
                        <li key={item.id} className="relative rounded-2xl border border-hairline bg-surface/70 p-3.5">
                          <span className="absolute -left-[21px] top-5 size-2.5 rounded-full bg-primary" aria-hidden="true" />
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            {item.start_time ? (
                              <span className="font-mono text-xs font-semibold text-primary-foreground/80">
                                {item.start_time}
                              </span>
                            ) : null}
                            <span className="text-sm font-semibold">{item.title}</span>
                            {item.duration_minutes ? (
                              <span className="text-xs text-muted-foreground">
                                {formatMinutes(item.duration_minutes)}
                              </span>
                            ) : null}
                          </div>
                          {item.description ? (
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                            {item.location ? <span>📍 {item.location}</span> : null}
                            {item.travel_minutes ? (
                              <span>
                                🚶 {formatMinutes(item.travel_minutes)} travel
                                {item.transport_mode ? ` · ${item.transport_mode}` : ""}
                              </span>
                            ) : null}
                            {item.estimated_cost !== null && item.estimated_cost !== undefined ? (
                              <span>
                                ~{formatMoney(Number(item.estimated_cost), item.currency ?? trip.display_currency)} est.
                              </span>
                            ) : null}
                            {typeof (item.metadata as { bestTime?: string })?.bestTime === "string" ? (
                              <span>⏰ {(item.metadata as { bestTime?: string }).bestTime}</span>
                            ) : null}
                            {item.location ? (
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                  `${item.location}, ${trip.destination}`,
                                )}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="font-medium text-foreground underline decoration-primary decoration-2 underline-offset-2"
                              >
                                Get directions ↗
                              </a>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Timings, durations and costs are AI estimates in {trip.display_currency}. Opening
                  hours and prices are typical, not verified — please check before you go.
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {estimateLines.length ? (
            <section className="panel rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold">Estimated budget</h2>
                <DataStatusBadge status="estimated" />
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {estimateLines.map((line) => (
                  <li key={line.id} className="flex items-baseline justify-between gap-3">
                    <span className="text-muted-foreground">
                      {EXPENSE_CATEGORY_LABEL[line.category as ExpenseCategory]}
                      {line.description ? ` · ${line.description}` : ""}
                    </span>
                    <span className="font-medium">
                      {formatMoney(Number(line.estimated_amount), line.currency)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between border-t border-hairline pt-3">
                <span className="text-sm font-semibold">Estimated total</span>
                <span className="font-display text-lg font-semibold">
                  {formatMoney(estimatedTotal, trip.display_currency)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Modelled estimate in the destination's local currency — not a quoted price.
              </p>
            </section>
          ) : null}

          <section className="panel rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold">The brief</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Styles" value={trip.travel_styles?.join(", ")} />
              <Row label="Interests" value={trip.interests?.join(", ")} />
              <Row label="Food" value={trip.food_preferences?.join(", ")} />
              <Row label="Stay" value={trip.accommodation_preference} />
              <Row label="Transport" value={trip.transportation_preference} />
              <Row label="Accessibility" value={trip.accessibility_notes} />
              <Row label="Notes" value={trip.brief} />
            </dl>
          </section>


          <section className="rounded-2xl border border-hairline p-5">
            <h3 className="text-sm font-semibold">How to read this page</h3>
            <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-muted-foreground">
              <li className="flex gap-2">
                <DataStatusBadge status="live" withDot={false} />
                Fetched now from a connected provider.
              </li>
              <li className="flex gap-2">
                <DataStatusBadge status="verified" withDot={false} />
                From an official source.
              </li>
              <li className="flex gap-2">
                <DataStatusBadge status="estimated" withDot={false} />
                A modelled estimate, not a quote.
              </li>
              <li className="flex gap-2">
                <DataStatusBadge status="ai_recommendation" withDot={false} />
                An AI suggestion — verify before relying on it.
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface/50 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-semibold capitalize">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 leading-relaxed">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}
