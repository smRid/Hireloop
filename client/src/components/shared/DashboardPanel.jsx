import { cn } from "@/lib/utils";

export default function DashboardPanel({ children, className, as: Tag = "section" }) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
