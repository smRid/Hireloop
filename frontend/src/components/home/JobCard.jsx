import Link from "next/link";
import { MapPin, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function JobCard({
  title,
  description,
  location,
  type,
  salary,
  company,
  href = "#",
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-card p-6 transition-all duration-200 hover:border-brand/30 hover:bg-card/80 hover:shadow-lg hover:shadow-brand/5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          {company && (
            <span className="text-xs font-medium text-muted-foreground">
              {company}
            </span>
          )}
          <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-brand transition-colors">
            {title}
          </h3>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant="secondary"
          className="gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium"
        >
          <MapPin className="size-3 text-brand" />
          {location}
        </Badge>
        <Badge
          variant="secondary"
          className="gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium"
        >
          <Clock className="size-3 text-brand" />
          {type}
        </Badge>
        <Badge
          variant="secondary"
          className="gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium"
        >
          <DollarSign className="size-3 text-brand" />
          {salary}
        </Badge>
      </div>
    </Link>
  );
}
