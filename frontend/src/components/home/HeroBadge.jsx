import { Sparkles } from "lucide-react";

export function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-1.5">
      <Sparkles className="size-3.5 text-brand" />
      <span className="text-xs font-semibold tracking-wider text-brand uppercase">
        50,000+ New Jobs This Month
      </span>
    </div>
  );
}
