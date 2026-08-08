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

  return (
    <AppShell>
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
            <h2 className="font-display text-lg font-semibold">Itinerary</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No days have been generated for this trip yet. The itinerary engine — with realistic
              travel times, geographic clustering and drag-to-reorder editing — is the next build
              phase. Your brief below is what it will plan against.
            </p>
          </section>
        </div>

        <aside className="space-y-6">
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
