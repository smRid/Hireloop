import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  active: "bg-primary/10 text-primary border-primary/20",
  applied: "bg-secondary text-secondary-foreground border-transparent",
  approved: "bg-primary/10 text-primary border-primary/20",
  closed: "bg-muted text-muted-foreground border-border",
  draft: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  offered: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  pending: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  rejected: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  removed: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  shortlisted: "bg-primary/10 text-primary border-primary/20",
  under_review: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  verified: "bg-primary/10 text-primary border-primary/20",
};

const labelForStatus = (status = "") => {
  return status
    .split("_")
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
};

export default function StatusPill({ status, children, className }) {
  const key = String(status ?? "").toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5",
        "font-sans text-[12px] font-medium leading-none",
        STATUS_STYLE[key] ?? "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      {children ?? labelForStatus(key)}
    </span>
  );
}
