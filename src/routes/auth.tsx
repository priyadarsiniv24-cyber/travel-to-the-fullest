import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { BrandMark } from "@/components/AppShell";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — AeroTravel AI" },
      {
        name: "description",
        content:
          "Sign in to AeroTravel AI to build, save and manage detailed multi-day travel plans with transparent, clearly-sourced data.",
      },
      { property: "og:title", content: "Sign in — AeroTravel AI" },
      {
        property: "og:description",
        content: "Access your saved trips, budgets and itineraries on AeroTravel AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function safePath(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/trips";
  return value;
}

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const destination = safePath(search.redirect);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: destination, replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) void navigate({ to: destination, replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [destination, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: trimmed,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name.trim() || trimmed.split("@")[0] },
          },
        });
        if (err) throw err;
        if (!data.session) {
          setCheckEmail(true);
          return;
        }
        toast.success("Account created");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: trimmed,
          password,
        });
        if (err) throw err;
        toast.success("Welcome back");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(
        message.toLowerCase().includes("invalid login")
          ? "That email and password combination doesn't match an account."
          : message,
      );
    } finally {
      setBusy(false);
    }
  }

  async function googleSignIn() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result && "error" in result && result.error) {
      setError(result.error.message ?? "Google sign-in failed.");
    }
  }

  if (checkEmail) {
    return (
      <Screen>
        <h1 className="font-display text-2xl font-semibold">Confirm your email</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We sent a confirmation link to <span className="text-foreground">{email}</span>. Click it
          to activate your account, then come back and sign in.
        </p>
        <button
          onClick={() => {
            setCheckEmail(false);
            setMode("signin");
          }}
          className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Back to sign in
        </button>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="flex rounded-xl border border-border bg-secondary/50 p-1">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="Your name"
              className={inputClass}
            />
          </Field>
        ) : null}
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            maxLength={128}
            placeholder="At least 8 characters"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className={inputClass}
          />
        </Field>

        {error ? (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        onClick={googleSignIn}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium transition-colors hover:border-primary/40"
      >
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6Z" />
          <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9a7 7 0 0 1-10.4-3.7H1.7v3A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.5 14.6a7.2 7.2 0 0 1 0-4.6v-3H1.7a12 12 0 0 0 0 10.6l3.8-3Z" />
          <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.3-3.3A12 12 0 0 0 1.7 7l3.8 3A7 7 0 0 1 12 4.8Z" />
        </svg>
        Continue with Google
      </button>
    </Screen>
  );
}

const inputClass =
  "w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 aurora" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <BrandMark />
        </div>
        <div className="panel rounded-2xl p-6">{children}</div>
        <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
          AeroTravel AI never presents unverified information as fact. Every figure is labelled
          live, verified, estimated or AI-suggested.
        </p>
      </div>
    </div>
  );
}
