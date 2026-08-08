import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { deleteTrip, listTrips } from "@/lib/trips.functions";
import {
  TRIP_STATUS_LABEL,
  formatDateRange,
  formatMoney,
  tripNights,
  type TripStatus,
} from "@/lib/travel";

export const Route = createFileRoute("/_authenticated/trips")({
  head: () => ({
    meta: [
      { title: "My trips — AeroTravel AI" },
      {
        name: "description",
        content:
          "Every trip you have planned with AeroTravel AI: dates, travellers, budgets and status, saved to your account.",
      },
      { property: "og:title", content: "My trips — AeroTravel AI" },
      {
        property: "og:description",
        content: "Your saved travel plans, budgets and itineraries in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TripsPage,
});

function TripsPage() {
  const fetchTrips = useServerFn(listTrips);
  const removeTrip = useServerFn(deleteTrip);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["trips"],
    queryFn: () => fetchTrips(),
  });

  const del = useMutation({
    mutationFn: (tripId: string) => removeTrip({ data: { tripId } }),
    onSuccess: () => {
      toast.success("Trip deleted");
      void queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not delete the trip"),
  });

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">My trips</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Saved to your account. Nothing here is shared with anyone else.
          </p>
        </div>
        <Link
          to="/plan"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Plan a new trip
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-hairline bg-surface/60" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Could not load your trips."}
        </p>
      ) : !data?.length ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <h2 className="font-display text-lg font-semibold">No trips yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Create your first trip and AeroTravel AI will hold the brief — dates, travellers,
            budget, pace and preferences — as the basis for planning.
          </p>
          <Link
            to="/plan"
            className="mt-6 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Start planning
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {data.map((trip) => {
            const nights = tripNights(trip.start_date, trip.end_date);
            return (
              <li key={trip.id} className="panel group rounded-2xl p-5 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to="/trip/$tripId"
                    params={{ tripId: trip.id }}
                    className="min-w-0 flex-1"
                  >
                    <h3 className="truncate font-display text-lg font-semibold">{trip.title}</h3>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {trip.origin} → {trip.destination}
                    </p>
                  </Link>
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {TRIP_STATUS_LABEL[trip.status as TripStatus]}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-hairline pt-4 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Dates</dt>
                    <dd className="mt-0.5 font-medium">
                      {formatDateRange(trip.start_date, trip.end_date)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Nights</dt>
                    <dd className="mt-0.5 font-medium">{nights ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Budget</dt>
                    <dd className="mt-0.5 font-medium">
                      {formatMoney(
                        trip.budget_amount ? Number(trip.budget_amount) : null,
                        trip.budget_currency,
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to="/trip/$tripId"
                    params={{ tripId: trip.id }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Open trip →
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${trip.title}"? This cannot be undone.`)) {
                        del.mutate(trip.id);
                      }
                    }}
                    className="text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
