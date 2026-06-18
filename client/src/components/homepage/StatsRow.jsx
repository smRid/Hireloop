import { cn } from "@/lib/utils";

const STATS = [
  { value: "50K+", label: "Active Jobs" },
  { value: "12K+", label: "Companies" },
  { value: "2M+", label: "Job Seekers" },
  { value: "97%", label: "Satisfaction Rate" },
];

export default function StatsRow() {
  return (
    <section
      className="w-full bg-background px-4 pb-20 sm:px-6 lg:px-8"
      aria-label="Platform statistics"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ value, label }) => (
          <div
            key={label}
            className={cn(
              "group flex flex-col items-center justify-center gap-1 rounded-xl",
              "border border-border bg-card px-6 py-6",
              "transition-all duration-200",
              "hover:border-primary hover:shadow-[0_0_20px_0px_color-mix(in_oklch,var(--primary)_12%,transparent)]",
            )}
          >
            <span className="font-heading text-[48px] font-bold leading-none text-primary">
              {value}
            </span>
            <span className="font-sans text-[14px] text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
