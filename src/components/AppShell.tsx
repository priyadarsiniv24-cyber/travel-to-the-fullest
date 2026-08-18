import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { AiCompanionChat } from "@/components/AiCompanionChat";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-8 place-items-center rounded-xl border border-primary/50 bg-primary/25">
        <svg viewBox="0 0 24 24" className="relative size-4 text-primary-foreground" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2.5c.5 0 .9.4 1 .9l.9 6.2 6.4 2.1c.4.2.7.6.7 1s-.3.9-.7 1l-6.4 2.1-.9 6.2c-.1.5-.5.9-1 .9s-.9-.4-1-.9l-.9-6.2-6.4-2.1c-.4-.1-.7-.5-.7-1s.3-.8.7-1l6.4-2.1.9-6.2c.1-.5.5-.9 1-.9Z"
          />
        </svg>
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight">
        AeroTravel <span className="text-primary-foreground/70">AI</span>
      </span>
    </span>
  );
}

const NAV = [
  { to: "/ai", label: "Plan", icon: "✨" },
  { to: "/trips", label: "My trips", icon: "🧳" },
] as const;

export function AppShell({ children, tripContext }: { children: ReactNode; tripContext?: string | null }) {
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
      <div className="pointer-events-none fixed inset-0 aurora opacity-70" aria-hidden="true" />
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="shrink-0" aria-label="AeroTravel AI home">
            <BrandMark />
          </Link>
          <nav className="ml-2 hidden items-center gap-1 sm:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname.startsWith(item.to)
                    ? "bg-primary/25 text-foreground"
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
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-6">{children}</main>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden"
      >
        <div className="flex items-stretch">
          {[{ to: "/", label: "Home", icon: "🏠" }, ...NAV].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
                (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to))
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <span aria-hidden="true" className="text-base leading-none">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <AiCompanionChat tripContext={tripContext ?? null} />
    </div>
  );
}
