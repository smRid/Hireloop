import { cn } from "@/lib/utils";

export default function DashboardPanel({ children, className, as: Tag = "section" }) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-border/80 bg-card/95 p-5 shadow-sm shadow-black/10",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
