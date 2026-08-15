import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type TeddyMood = "happy" | "wave" | "excited" | "celebrate" | "sleepy" | "surprised" | "concerned";

const MOOD_BROW: Record<TeddyMood, string> = {
  happy: "M8.5 10.6q1.6-1 3.2 0",
  wave: "M8.5 10.6q1.6-1 3.2 0",
  excited: "M8.4 10.2q1.6-1.3 3.4 0",
  celebrate: "M8.4 10.2q1.6-1.3 3.4 0",
  sleepy: "M8.6 11.2q1.6.6 3.2 0",
  surprised: "M8.4 10q1.7-.6 3.4 0",
  concerned: "M8.4 11.4q1.6 1 3.4 0",
};

/** A small hand-drawn style teddy mascot. Purely decorative UI companion. */
export function Teddy({ mood = "happy", className }: { mood?: TeddyMood; className?: string }) {
  const sleepy = mood === "sleepy";
  const surprised = mood === "surprised";
  return (
    <svg viewBox="0 0 40 40" className={cn("size-12", className)} aria-hidden="true">
      {/* ears */}
      <circle cx="10" cy="9" r="5.4" className="fill-primary" />
      <circle cx="30" cy="9" r="5.4" className="fill-primary" />
      <circle cx="10" cy="9" r="2.6" className="fill-accent" />
      <circle cx="30" cy="9" r="2.6" className="fill-accent" />
      {/* head */}
      <circle cx="20" cy="21" r="13.5" className="fill-primary" />
      <ellipse cx="20" cy="25.5" rx="7.4" ry="6" className="fill-accent" />
      {/* eyes */}
      {sleepy ? (
        <>
          <path d="M12.4 19.5q2.4 1.8 4.8 0" className="stroke-primary-foreground" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M22.8 19.5q2.4 1.8 4.8 0" className="stroke-primary-foreground" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="14.8" cy="19.4" r={surprised ? 2.5 : 2} className="fill-primary-foreground" />
          <circle cx="25.2" cy="19.4" r={surprised ? 2.5 : 2} className="fill-primary-foreground" />
          <circle cx="15.6" cy="18.6" r="0.7" className="fill-background" />
          <circle cx="26" cy="18.6" r="0.7" className="fill-background" />
        </>
      )}
      {/* brows */}
      <path d={MOOD_BROW[mood]} className="stroke-primary-foreground" strokeWidth="1.1" fill="none" strokeLinecap="round" transform="translate(4 3)" opacity="0.55" />
      <path d={MOOD_BROW[mood]} className="stroke-primary-foreground" strokeWidth="1.1" fill="none" strokeLinecap="round" transform="translate(14.4 3) scale(-1 1) translate(-20.4 0)" opacity="0.55" />
      {/* nose + mouth */}
      <ellipse cx="20" cy="23.6" rx="1.9" ry="1.4" className="fill-primary-foreground" />
      {surprised ? (
        <ellipse cx="20" cy="27.6" rx="1.6" ry="2" className="fill-primary-foreground" opacity="0.85" />
      ) : mood === "concerned" ? (
        <path d="M17 28.4q3 -2 6 0" className="stroke-primary-foreground" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M17 26.6q3 3 6 0" className="stroke-primary-foreground" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      )}
      {/* cheeks */}
      <circle cx="11.4" cy="24.4" r="1.9" className="fill-destructive" opacity="0.22" />
      <circle cx="28.6" cy="24.4" r="1.9" className="fill-destructive" opacity="0.22" />
    </svg>
  );
}

const HIDE_KEY = "aerotravel.teddy.hidden";

/**
 * Floating mascot with a short contextual line. Never blocks content:
 * it sits above the bottom-left corner and can be hidden permanently.
 */
export function TeddyCompanion({
  message,
  mood = "happy",
}: {
  message: string;
  mood?: TeddyMood;
}) {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(HIDE_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready || hidden) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 flex items-end gap-2 sm:bottom-6 sm:left-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Hide companion message" : "Show companion message"}
        className="pointer-events-auto grid size-14 place-items-center rounded-full border border-hairline bg-surface shadow-[var(--shadow-panel)] transition-transform hover:scale-105"
      >
        <Teddy mood={mood} className="size-11 teddy-bob" />
      </button>
      {open ? (
        <div className="pointer-events-auto teddy-pop max-w-[15rem] rounded-2xl rounded-bl-sm border border-hairline bg-surface px-3.5 py-2.5 shadow-[var(--shadow-panel)]">
          <p className="text-xs leading-relaxed text-foreground">{message}</p>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(HIDE_KEY, "1");
              setHidden(true);
            }}
            className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Hide companion
          </button>
        </div>
      ) : null}
    </div>
  );
}
