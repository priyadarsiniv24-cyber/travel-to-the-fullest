import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";

import { Teddy } from "@/components/TeddyCompanion";
import { askCompanion } from "@/lib/companion.functions";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Where should I go today?",
  "Make today's plan less tiring",
  "Find hidden gems",
  "How can I make this trip cheaper?",
];

export function AiCompanionChat({ tripContext }: { tripContext?: string | null }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm Pippa — your travel companion 🌸 Ask me about your plans. If I don't have live data, I'll tell you instead of guessing.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askCompanion);

  const mutation = useMutation({
    mutationFn: (next: Msg[]) => ask({ data: { messages: next, tripContext: tripContext ?? null } }),
    onSuccess: (res) => setMessages((m) => [...m, { role: "assistant", content: res.reply }]),
    onError: () =>
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't reach my AI service just now. Try again in a moment." },
      ]),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mutation.isPending]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean || mutation.isPending) return;
    const next: Msg[] = [...messages.filter((m, i) => !(i === 0 && m.role === "assistant")), { role: "user", content: clean }];
    setMessages((m) => [...m, { role: "user", content: clean }]);
    setInput("");
    mutation.mutate(next.slice(-16));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-hairline bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      >
        <Teddy mood="wave" className="size-6" />
        {open ? "Close" : "Ask Pippa"}
      </button>

      {open ? (
        <div className="fixed bottom-20 right-3 z-40 flex h-[26rem] w-[min(23rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-hairline bg-surface shadow-[var(--shadow-panel)] sm:bottom-24 sm:right-6">
          <div className="flex items-center gap-2 border-b border-hairline bg-primary/15 px-4 py-3">
            <Teddy mood="happy" className="size-8" />
            <div>
              <p className="text-sm font-semibold">Pippa</p>
              <p className="text-[11px] text-muted-foreground">Your AI travel companion</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user"
                    ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-secondary text-secondary-foreground",
                )}
              >
                {m.content}
              </div>
            ))}
            {mutation.isPending ? (
              <div className="w-fit rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2.5 text-sm text-muted-foreground">
                Thinking…
              </div>
            ) : null}
            {messages.length <= 1 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-hairline p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your trip…"
              className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={mutation.isPending || !input.trim()}
              className="rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
