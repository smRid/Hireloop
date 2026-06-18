import { cn } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

/* ── Company logo placeholder ──────────────────────────────────────── */
const CompanyLogo = ({ initials }) => {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-md bg-popover border border-border"
      aria-hidden="true"
    >
      <span className="font-heading text-[13px] font-semibold text-primary leading-none">
        {initials}
      </span>
    </div>
  );
};

/* ── Job type badge — teal for salary, amber for job type ─────────── */
const SalaryBadge = ({ salary }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1",
        "bg-primary/10 text-primary",
        "font-sans text-[12px] font-medium",
      )}
    >
      {salary}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1",
        "bg-chart-2/10 text-chart-2",
        "font-sans text-[12px] font-medium",
      )}
    >
      {type}
    </span>
  );
};

const JobCard = ({ job }) => {
  return (
    <article
      className={cn(
        "group flex flex-col gap-4 rounded-xl border border-border bg-card p-5",
        "transition-all duration-250 ease-out",
        "hover:-translate-y-1 hover:border-primary",
        "hover:shadow-[0_8px_32px_-4px_color-mix(in_oklch,var(--primary)_18%,transparent)]",
      )}
    >
      {/* ── Top row: logo + company + location ── */}
      <div className="flex items-start gap-3">
        <CompanyLogo initials={job.initials} />
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[13px] font-medium text-foreground truncate">
            {job.company}
          </p>
          <div className="mt-0.5 flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            <span className="font-sans text-[12px] truncate">
              {job.location}
            </span>
          </div>
        </div>
      </div>

      {/* ── Job title ── */}
      <h3 className="font-heading text-[18px] font-semibold leading-snug text-foreground">
        {job.title}
      </h3>

      {/* ── Description — 2-line clamp ── */}
      <p className="font-sans text-[14px] leading-relaxed text-muted-foreground line-clamp-2 flex-1">
        {job.description}
      </p>

      {/* ── Bottom row: badges + apply link ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <SalaryBadge salary={job.salary} />
          <TypeBadge type={job.type} />
        </div>
        <Link
          href={`/jobs/${job.id}`}
          className={cn(
            "inline-flex items-center gap-1 font-sans text-[13px] font-medium text-primary",
            "transition-all duration-200 hover:gap-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
          )}
          aria-label={`Apply for ${job.title} at ${job.company}`}
        >
          Apply Now
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default JobCard;
