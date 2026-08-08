import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { tripInputSchema, type TripInput } from "@/lib/trip-schemas";
import { createTrip } from "@/lib/trips.functions";
import {
  ACCOMMODATION_PREFERENCES,
  ACTIVITY_INTENSITY,
  CURRENCIES,
  FOOD_PREFERENCES,
  INTERESTS,
  TRANSPORT_PREFERENCES,
  TRAVEL_STYLES,
  tripNights,
} from "@/lib/travel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/plan")({
  head: () => ({
    meta: [
      { title: "Plan a trip — AeroTravel AI" },
      {
        name: "description",
        content:
          "Build a detailed travel brief: route, dates, travellers, budget, pace, interests, food and accessibility needs — the foundation for a realistic itinerary.",
      },
      { property: "og:title", content: "Plan a trip — AeroTravel AI" },
      {
        property: "og:description",
        content: "Create a detailed, honest travel brief in a few guided steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanPage,
});

const STEPS = ["Route", "Travellers", "Budget", "Style", "Brief"] as const;

function PlanPage() {
  const navigate = useNavigate();
  const create = useServerFn(createTrip);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<TripInput>({
    title: "",
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    adults: 1,
    children: 0,
    budgetAmount: null,
    budgetCurrency: "USD",
    displayCurrency: "USD",
    travelStyles: [],
    interests: [],
    foodPreferences: [],
    accommodationPreference: null,
    transportationPreference: null,
    activityIntensity: "balanced",
    accessibilityNotes: "",
    brief: "",
  });

  const set = <K extends keyof TripInput>(key: K, value: TripInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggle = (key: "travelStyles" | "interests" | "foodPreferences", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const nights = useMemo(() => tripNights(form.startDate, form.endDate), [form.startDate, form.endDate]);

  const mutation = useMutation({
    mutationFn: (input: TripInput) => create({ data: input }),
    onSuccess: (res) => {
      toast.success("Trip saved");
      void navigate({ to: "/trip/$tripId", params: { tripId: res.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save the trip"),
  });

  function validateStep(index: number): boolean {
    const next: Record<string, string> = {};
    if (index === 0) {
      if (!form.title.trim()) next.title = "Give the trip a name";
      if (!form.origin.trim()) next.origin = "Where are you starting from?";
      if (!form.destination.trim()) next.destination = "Where are you going?";
      if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
        next.endDate = "Return date must be on or after the departure date";
      }
    }
    if (index === 1 && form.adults < 1) next.adults = "At least one traveller";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit() {
    const payload: TripInput = {
      ...form,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      accessibilityNotes: form.accessibilityNotes || null,
      brief: form.brief || null,
    };
    const parsed = tripInputSchema.safeParse(payload);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      for (const issue of parsed.error.issues) flat[String(issue.path[0])] = issue.message;
      setErrors(flat);
      setStep(0);
      toast.error("Please fix the highlighted fields");
      return;
    }
    mutation.mutate(parsed.data);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Plan a new trip</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          The more precise this brief, the more realistic the plan. Nothing is booked at this stage.
        </p>

        <ol className="mt-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex w-full flex-col gap-1.5 text-left",
                  i <= step ? "" : "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "h-1 w-full rounded-full transition-colors",
                    i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-border",
                  )}
                />
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="panel mt-6 rounded-2xl p-6">
          {step === 0 ? (
            <Section title="Where and when">
              <Field label="Trip name" error={errors.title}>
                <input
                  className={inputClass}
                  value={form.title}
                  maxLength={120}
                  placeholder="Two weeks in northern Japan"
                  onChange={(e) => set("title", e.target.value)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Starting from" error={errors.origin}>
                  <input
                    className={inputClass}
                    value={form.origin}
                    maxLength={120}
                    placeholder="City or airport"
                    onChange={(e) => set("origin", e.target.value)}
                  />
                </Field>
                <Field label="Destination" error={errors.destination}>
                  <input
                    className={inputClass}
                    value={form.destination}
                    maxLength={160}
                    placeholder="City, region or country"
                    onChange={(e) => set("destination", e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Departure date" error={errors.startDate}>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.startDate ?? ""}
                    onChange={(e) => set("startDate", e.target.value)}
                  />
                </Field>
                <Field label="Return date" error={errors.endDate}>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.endDate ?? ""}
                    min={form.startDate || undefined}
                    onChange={(e) => set("endDate", e.target.value)}
                  />
                </Field>
              </div>
              {nights !== null ? (
                <p className="text-xs text-muted-foreground">
                  {nights} night{nights === 1 ? "" : "s"} · {nights + 1} days on the ground
                </p>
              ) : null}
            </Section>
          ) : null}

          {step === 1 ? (
            <Section title="Who is travelling">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Adults" error={errors.adults}>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    className={inputClass}
                    value={form.adults}
                    onChange={(e) => set("adults", Math.max(1, Number(e.target.value) || 1))}
                  />
                </Field>
                <Field label="Children">
                  <input
                    type="number"
                    min={0}
                    max={30}
                    className={inputClass}
                    value={form.children}
                    onChange={(e) => set("children", Math.max(0, Number(e.target.value) || 0))}
                  />
                </Field>
              </div>
              <Field label="Accessibility or medical needs">
                <textarea
                  className={cn(inputClass, "min-h-24 resize-y")}
                  maxLength={600}
                  value={form.accessibilityNotes ?? ""}
                  placeholder="Step-free access, limited walking distance, medication storage, travelling with an infant…"
                  onChange={(e) => set("accessibilityNotes", e.target.value)}
                />
              </Field>
            </Section>
          ) : null}

          {step === 2 ? (
            <Section title="Budget">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Total budget">
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={form.budgetAmount ?? ""}
                    placeholder="Optional"
                    onChange={(e) =>
                      set("budgetAmount", e.target.value === "" ? null : Number(e.target.value))
                    }
                  />
                </Field>
                <Field label="Budget currency">
                  <select
                    className={inputClass}
                    value={form.budgetCurrency}
                    onChange={(e) => set("budgetCurrency", e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Show prices in">
                  <select
                    className={inputClass}
                    value={form.displayCurrency}
                    onChange={(e) => set("displayCurrency", e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <p className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                Currency conversion uses live European Central Bank reference rates. Any cost the
                app shows without a connected booking provider is labelled as an estimate.
              </p>
            </Section>
          ) : null}

          {step === 3 ? (
            <Section title="How you like to travel">
              <ChipGroup
                label="Travel style"
                options={TRAVEL_STYLES}
                selected={form.travelStyles}
                onToggle={(v) => toggle("travelStyles", v)}
              />
              <ChipGroup
                label="Interests"
                options={INTERESTS}
                selected={form.interests}
                onToggle={(v) => toggle("interests", v)}
              />
              <ChipGroup
                label="Food preferences"
                options={FOOD_PREFERENCES}
                selected={form.foodPreferences}
                onToggle={(v) => toggle("foodPreferences", v)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Accommodation">
                  <select
                    className={inputClass}
                    value={form.accommodationPreference ?? ""}
                    onChange={(e) => set("accommodationPreference", e.target.value || null)}
                  >
                    <option value="">No preference</option>
                    {ACCOMMODATION_PREFERENCES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Getting around">
                  <select
                    className={inputClass}
                    value={form.transportationPreference ?? ""}
                    onChange={(e) => set("transportationPreference", e.target.value || null)}
                  >
                    <option value="">No preference</option>
                    {TRANSPORT_PREFERENCES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Daily pace">
                <div className="grid gap-2 sm:grid-cols-3">
                  {ACTIVITY_INTENSITY.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("activityIntensity", opt.value)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        form.activityIntensity === opt.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <span className="block text-sm font-semibold">{opt.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{opt.hint}</span>
                    </button>
                  ))}
                </div>
              </Field>
            </Section>
          ) : null}

          {step === 4 ? (
            <Section title="Anything else">
              <Field label="Free-text brief">
                <textarea
                  className={cn(inputClass, "min-h-40 resize-y")}
                  maxLength={2000}
                  value={form.brief ?? ""}
                  placeholder="Must-sees, places to avoid, anniversaries, work commitments, fixed bookings you already have…"
                  onChange={(e) => set("brief", e.target.value)}
                />
              </Field>
              <Summary form={form} nights={nights} />
            </Section>
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-hairline pt-5">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => validateStep(step) && setStep((s) => s + 1)}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={mutation.isPending}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {mutation.isPending ? "Saving…" : "Save trip"}
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Summary({ form, nights }: { form: TripInput; nights: number | null }) {
  const rows: [string, string][] = [
    ["Route", `${form.origin || "—"} → ${form.destination || "—"}`],
    ["Duration", nights !== null ? `${nights} nights` : "Dates not set"],
    ["Travellers", `${form.adults} adult${form.adults === 1 ? "" : "s"}${form.children ? `, ${form.children} child${form.children === 1 ? "" : "ren"}` : ""}`],
    [
      "Budget",
      form.budgetAmount ? `${form.budgetAmount.toLocaleString()} ${form.budgetCurrency}` : "Not set",
    ],
    ["Pace", ACTIVITY_INTENSITY.find((a) => a.value === form.activityIntensity)?.label ?? "—"],
    ["Interests", form.interests.length ? form.interests.join(", ") : "None selected"],
  ];
  return (
    <dl className="divide-y divide-hairline rounded-xl border border-hairline">
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-4 px-4 py-2.5 text-sm">
          <dt className="w-28 shrink-0 text-muted-foreground">{k}</dt>
          <dd className="min-w-0 flex-1 font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

const inputClass =
  "w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
