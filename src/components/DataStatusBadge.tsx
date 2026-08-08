import { DATA_STATUS_META, type DataStatus } from "@/lib/travel";
import { cn } from "@/lib/utils";

const TOKEN_CLASS: Record<DataStatus, string> = {
  live: "border-live/40 bg-live/12 text-live",
  verified: "border-verified/40 bg-verified/12 text-verified",
  estimated: "border-estimated/40 bg-estimated/12 text-estimated",
  ai_recommendation: "border-suggested/40 bg-suggested/12 text-suggested",
};

export function DataStatusBadge({
  status,
  className,
  withDot = true,
}: {
  status: DataStatus;
  className?: string;
  withDot?: boolean;
}) {
  const meta = DATA_STATUS_META[status];
  return (
    <span
      title={meta.explanation}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest uppercase",
        TOKEN_CLASS[status],
        className,
      )}
    >
      {withDot ? <span className="size-1.5 rounded-full bg-current" /> : null}
      {meta.short}
    </span>
  );
}

export function NotConfiguredPanel({
  title,
  notice,
  links,
}: {
  title: string;
  notice: string;
  links?: { label: string; url: string }[];
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-5">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{notice}</p>
      {links?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
