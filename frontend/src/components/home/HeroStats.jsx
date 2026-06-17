import { Briefcase, Building2, Users, Star } from "lucide-react";

const STATS = [
  {
    icon: Briefcase,
    value: "50K+",
    label: "Active Jobs",
    color: "text-violet-400",
  },
  {
    icon: Building2,
    value: "12K+",
    label: "Top Companies",
    color: "text-blue-400",
  },
  {
    icon: Users,
    value: "2M+",
    label: "Job Seekers",
    color: "text-emerald-400",
  },
  {
    icon: Star,
    value: "97%",
    label: "Satisfaction Rate",
    color: "text-amber-400",
  },
];

export function HeroStats() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
      {STATS.map(({ icon: Icon, value, label, color }) => (
        <div
          key={label}
          className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-card/70 p-5 backdrop-blur-sm"
        >
          <Icon className={cn("size-5", color)} strokeWidth={1.5} />
          <div>
            <p className="font-heading text-3xl font-bold text-foreground">
              {value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// inline cn to avoid extra import overhead
function cn(...c) {
  return c.filter(Boolean).join(" ");
}
