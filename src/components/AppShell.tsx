import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-8 place-items-center rounded-lg border border-primary/40 bg-primary/12">
        <span className="absolute inset-0 rounded-lg [background:var(--gradient-primary)] opacity-20" />
        <svg viewBox="0 0 24 24" className="relative size-4 text-primary" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2.5c.5 0 .9.4 1 .9l.9 6.2 6.4 2.1c.4.2.7.6.7 1s-.3.9-.7 1l-6.4 2.1-.9 6.2c-.1.5-.5.9-1 .9s-.9-.4-1-.9l-.9-6.2-6.4-2.1c-.4-.1-.7-.5-.7-1s.3-.8.7-1l6.4-2.1.9-6.2c.1-.5.5-.9 1-.9Z"
          />
        </svg>
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight">
        AeroTravel <span className="text-primary">AI</span>
      </span>
    </span>
  );
}

const NAV = [
  { to: "/trips", label: "My trips" },
  { to: "/plan", label: "New trip" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    setBusy(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 aurora opacity-60" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-hairline bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link to="/trips" className="shrink-0">
            <BrandMark />
          </Link>
          <nav className="ml-2 flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname === item.to
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {email ? (
              <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground sm:inline">
                {email}
              </span>
            ) : null}
            <button
              onClick={signOut}
              disabled={busy}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">{children}</main>
    </div>
  );
}
