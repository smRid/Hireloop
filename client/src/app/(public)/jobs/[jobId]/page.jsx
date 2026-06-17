"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  CalendarDays,
  CheckCircle2,
  Globe,
  Share2,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { FaLinkedin, FaXTwitter, FaLink } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { getJobById, getSimilarJobs } from "@/lib/jobs-data";

/* ────────────────────────────────────────────────────────────────────
   SHARED PRIMITIVES
   ──────────────────────────────────────────────────────────────────── */

function CompanyLogo({ initials, size = "md" }) {
  const sizeMap = {
    md: "size-12 text-[14px]",
    lg: "size-16 text-[18px]",
  };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-border bg-popover",
        sizeMap[size],
      )}
      aria-hidden="true"
    >
      <span
        className={cn("font-heading font-semibold leading-none text-primary")}
      >
        {initials}
      </span>
    </div>
  );
}

function TypeBadge({ type }) {
  const isAmber = ["Contract", "Part-time", "Internship", "Freelance"].includes(
    type,
  );
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 font-sans text-[12px] font-medium",
        isAmber ? "bg-chart-2/10 text-chart-2" : "bg-primary/10 text-primary",
      )}
    >
      {type}
    </span>
  );
}

function MetaBadge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-sans text-[13px] text-muted-foreground">
      <Icon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
      {label}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────
   MAIN CONTENT — TABS
   ──────────────────────────────────────────────────────────────────── */

const TABS = ["Overview", "Requirements", "Benefits"];

function TabBar({ active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Job detail sections"
      className="flex items-end gap-0 border-b border-border"
    >
      {TABS.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.toLowerCase()}`}
            id={`tab-${tab.toLowerCase()}`}
            onClick={() => onChange(tab)}
            className={cn(
              "relative px-5 py-3 font-sans text-[14px] font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-md",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
            {/* Active teal underline */}
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary transition-all duration-200",
                isActive ? "opacity-100" : "opacity-0",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

/* ── Section heading reused across tab panels ── */
function SectionHeading({ children }) {
  return (
    <h3 className="font-heading text-[18px] font-semibold text-foreground">
      {children}
    </h3>
  );
}

function Divider() {
  return <div className="h-px w-full bg-border" aria-hidden="true" />;
}

/* ── Overview tab ── */
function OverviewPanel({ job }) {
  const paragraphs = job.overview.split("\n\n");
  return (
    <section
      id="tabpanel-overview"
      role="tabpanel"
      aria-labelledby="tab-overview"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <SectionHeading>About the Role</SectionHeading>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-sans text-[15px] leading-relaxed text-muted-foreground"
          >
            {p}
          </p>
        ))}
      </div>

      <Divider />

      <div className="flex flex-col gap-4">
        <SectionHeading>About {job.company}</SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Industry", value: job.industry },
            { label: "Team size", value: job.employees },
            { label: "Location", value: job.location },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4"
            >
              <span className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
              <span className="font-sans text-[14px] font-medium text-foreground">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Requirements tab ── */
function RequirementsPanel({ job }) {
  return (
    <section
      id="tabpanel-requirements"
      role="tabpanel"
      aria-labelledby="tab-requirements"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <SectionHeading>Required Qualifications</SectionHeading>
        <ul
          className="flex flex-col gap-3"
          aria-label="Required qualifications"
        >
          {job.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="font-sans text-[15px] leading-relaxed text-muted-foreground">
                {req}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Divider />

      <div className="flex flex-col gap-4">
        <SectionHeading>Nice to Have</SectionHeading>
        <ul
          className="flex flex-col gap-3"
          aria-label="Nice to have qualifications"
        >
          {job.niceToHave.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50"
                aria-hidden="true"
              />
              <span className="font-sans text-[15px] leading-relaxed text-muted-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Benefits tab ── */
function BenefitsPanel({ job }) {
  return (
    <section
      id="tabpanel-benefits"
      role="tabpanel"
      aria-labelledby="tab-benefits"
      className="flex flex-col gap-6"
    >
      <SectionHeading>Perks &amp; Benefits</SectionHeading>
      <ul
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        aria-label="Job benefits"
      >
        {job.benefits.map((b, i) => (
          <li
            key={i}
            className={cn(
              "flex items-start gap-4 rounded-xl border border-border bg-card p-4",
              "transition-all duration-150 hover:border-primary/50 hover:bg-popover",
            )}
          >
            <span className="text-[22px] leading-none" aria-hidden="true">
              {b.icon}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-[14px] font-medium text-foreground">
                {b.label}
              </span>
              <span className="font-sans text-[13px] leading-relaxed text-muted-foreground">
                {b.detail}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   SIDEBAR
   ──────────────────────────────────────────────────────────────────── */

function ShareRow() {
  const shareItems = [
    { Icon: FaLinkedin, label: "Share on LinkedIn" },
    { Icon: FaXTwitter, label: "Share on X" },
    { Icon: FaLink, label: "Copy link" },
  ];
  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-[13px] text-muted-foreground">
        Share:
      </span>
      <div className="flex items-center gap-2">
        {shareItems.map(({ Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className={cn(
              "flex size-8 items-center justify-center rounded-md border border-border",
              "text-muted-foreground transition-colors duration-150",
              "hover:border-primary hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

function JobSidebar({ job }) {
  const [saved, setSaved] = useState(false);

  return (
    <aside
      aria-label="Apply and company info"
      className={cn(
        "w-full lg:w-85 lg:shrink-0 self-start",
        "sticky top-20",
        "flex flex-col gap-4",
      )}
    >
      {/* ── Apply card ── */}
      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
        {/* Salary */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[12px] uppercase tracking-widest text-muted-foreground">
            Compensation
          </span>
          <span className="font-heading text-[28px] font-bold leading-tight text-primary">
            {job.salary}
          </span>
          <span className="font-sans text-[13px] text-muted-foreground">
            Per year · USD · Full package
          </span>
        </div>

        <div className="h-px w-full bg-border" aria-hidden="true" />

        {/* Deadline */}
        <div className="flex items-center gap-2.5">
          <CalendarDays
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="font-sans text-[12px] uppercase tracking-widest text-muted-foreground">
              Application deadline
            </span>
            <span className="font-sans text-[14px] font-medium text-foreground">
              {job.deadline}
            </span>
          </div>
        </div>

        {/* Apply button */}
        <Link
          href={`/jobs/${job.id}/apply`}
          className={cn(
            "flex h-12 w-full items-center justify-center rounded-xl",
            "bg-primary text-primary-foreground",
            "font-heading text-[15px] font-semibold",
            "transition-all duration-150 hover:bg-primary/90",
            "hover:shadow-[0_4px_20px_-2px_color-mix(in_oklch,var(--primary)_35%,transparent)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          Apply Now
        </Link>

        {/* Save button */}
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved jobs" : "Save this job"}
          className={cn(
            "flex h-10 w-full items-center justify-center gap-2 rounded-xl border transition-colors duration-150",
            saved
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-transparent text-muted-foreground hover:border-primary hover:text-primary",
            "font-sans text-[14px] font-medium",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {saved ? (
            <BookmarkCheck className="size-4" aria-hidden="true" />
          ) : (
            <Bookmark className="size-4" aria-hidden="true" />
          )}
          {saved ? "Saved" : "Save Job"}
        </button>

        {/* Share row */}
        <ShareRow />
      </div>

      {/* ── Company card ── */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-heading text-[14px] font-semibold text-foreground">
          About the Company
        </h2>

        {/* Logo + name */}
        <div className="flex items-center gap-3">
          <CompanyLogo initials={job.initials} size="md" />
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-[16px] font-semibold text-foreground">
              {job.company}
            </span>
            <span className="font-sans text-[13px] text-muted-foreground">
              {job.industry}
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-border" aria-hidden="true" />

        {/* Details */}
        <dl className="flex flex-col gap-3">
          {[
            { icon: MapPin, label: "Location", value: job.location },
            { icon: Briefcase, label: "Team size", value: job.employees },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="flex flex-col">
                <dt className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground">
                  {label}
                </dt>
                <dd className="font-sans text-[13px] text-foreground">
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Visit website */}
        <a
          href={job.website}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-primary",
            "transition-colors duration-150 hover:text-primary/75",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
          )}
        >
          <Globe className="size-3.5" aria-hidden="true" />
          Visit Website
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}

/* ────────────────────────────────────────────────────────────────────
   SIMILAR JOBS — horizontal 3-col scroll
   ──────────────────────────────────────────────────────────────────── */

function SimilarJobCard({ job }) {
  const [saved, setSaved] = useState(false);
  const isNew = job.daysAgo <= 2;
  const isClosing = !isNew && job.closing;

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-5 min-w-70",
        "transition-all duration-200 ease-out",
        "hover:bg-popover hover:border-primary",
        "hover:shadow-[0_4px_24px_-4px_color-mix(in_oklch,var(--primary)_15%,transparent)]",
        isNew && "border-l-2 border-l-primary border-border",
        isClosing && "border-l-2 border-l-chart-2 border-border",
        !isNew && !isClosing && "border-border",
      )}
      aria-label={`${job.title} at ${job.company}`}
    >
      {/* Logo + company */}
      <div className="flex items-center gap-3">
        <CompanyLogo initials={job.initials} size="md" />
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="font-sans text-[13px] font-medium text-foreground truncate">
            {job.company}
          </span>
          <span className="inline-flex items-center gap-1 font-sans text-[12px] text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {job.location}
          </span>
        </div>
      </div>

      {/* Title */}
      <Link
        href={`/jobs/${job.id}`}
        className={cn(
          "font-heading text-[17px] font-semibold leading-snug text-foreground",
          "hover:text-primary transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
        )}
      >
        {job.title}
      </Link>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge type={job.type} />
        <span className="font-sans text-[12px] text-muted-foreground">
          {job.category}
        </span>
      </div>

      {/* Salary + Apply */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="font-heading text-[15px] font-semibold text-primary">
          {job.salary}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSaved((v) => !v)}
            aria-pressed={saved}
            aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
            className={cn(
              "flex size-7 items-center justify-center rounded-md border transition-colors duration-150",
              saved
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {saved ? (
              <BookmarkCheck className="size-3.5" aria-hidden="true" />
            ) : (
              <Bookmark className="size-3.5" aria-hidden="true" />
            )}
          </button>
          <Link
            href={`/jobs/${job.id}`}
            className={cn(
              "inline-flex h-7 items-center rounded-md px-3",
              "bg-primary text-primary-foreground",
              "font-sans text-[12px] font-medium",
              "transition-all duration-150 hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            Apply
          </Link>
        </div>
      </div>
    </article>
  );
}

function SimilarJobs({ jobs }) {
  if (!jobs.length) return null;
  return (
    <section aria-labelledby="similar-jobs-heading" className="w-full">
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex flex-col gap-1">
          <span
            className="font-sans text-[12px] font-medium uppercase tracking-widest text-primary"
            aria-hidden="true"
          >
            You might also like
          </span>
          <h2
            id="similar-jobs-heading"
            className="font-heading text-[26px] font-semibold text-foreground"
          >
            Similar Opportunities
          </h2>
        </div>
        <Link
          href="/jobs"
          className={cn(
            "hidden sm:inline-flex items-center gap-1 font-sans text-[13px] font-medium text-primary",
            "transition-colors duration-150 hover:text-primary/75",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
          )}
        >
          Browse all
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Horizontal scroll on mobile, 3-col grid on lg */}
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          "sm:grid-cols-2 lg:grid-cols-3",
        )}
        role="list"
        aria-label="Similar job listings"
      >
        {jobs.map((job) => (
          <div key={job.id} role="listitem">
            <SimilarJobCard job={job} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────────────────────────── */

export default function JobDetailPage() {
  const { jobId } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");

  const job = getJobById(jobId);

  /* ── 404 state ── */
  if (!job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="font-heading text-[24px] font-semibold text-foreground">
          Job not found
        </p>
        <p className="font-sans text-[15px] text-muted-foreground">
          This listing may have been removed or the link is invalid.
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-sans text-[14px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  const similarJobs = getSimilarJobs(job);
  const isNew = job.daysAgo <= 2;
  const isClosing = !isNew && job.closing;

  return (
    <div className="w-full bg-background">
      {/* ── Breadcrumb bar ── */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/jobs"
            className={cn(
              "inline-flex items-center gap-1.5 font-sans text-[13px] text-muted-foreground",
              "transition-colors duration-150 hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
            )}
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Browse Jobs
          </Link>
          <ChevronRight
            className="size-3.5 shrink-0 text-muted-foreground/40"
            aria-hidden="true"
          />
          <span className="font-sans text-[13px] text-foreground truncate max-w-50 sm:max-w-none">
            {job.title}
          </span>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* ════════════════════════════════
              MAIN CONTENT  (left / top)
              ════════════════════════════════ */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            {/* ── Header card ── */}
            <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
              {/* Company row */}
              <div className="flex items-start gap-4">
                <CompanyLogo initials={job.initials} size="lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading text-[15px] font-semibold text-foreground">
                      {job.company}
                    </span>
                    {/* Verified badge */}
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-sans text-[11px] font-medium text-primary"
                      title="Verified employer"
                    >
                      <CheckCircle2 className="size-3" aria-hidden="true" />
                      Verified
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-sans text-[13px]">
                      <MapPin
                        className="size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {job.location}
                    </span>
                    <span className="text-border" aria-hidden="true">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1 font-sans text-[13px]">
                      <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                      Posted{" "}
                      {job.daysAgo === 0 ? "today" : `${job.daysAgo}d ago`}
                    </span>
                    {(isNew || isClosing) && (
                      <>
                        <span className="text-border" aria-hidden="true">
                          ·
                        </span>
                        {isNew && (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 font-sans text-[11px] font-medium text-primary">
                            New
                          </span>
                        )}
                        {isClosing && (
                          <span className="inline-flex items-center rounded-full bg-chart-2/10 px-2 py-0.5 font-sans text-[11px] font-medium text-chart-2">
                            Closing Soon
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Job title */}
              <h1 className="font-heading text-[32px] font-bold leading-tight text-foreground sm:text-[36px]">
                {job.title}
              </h1>

              {/* Meta badge row */}
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type={job.type} />
                <MetaBadge icon={MapPin} label={job.location} />
                <MetaBadge icon={DollarSign} label={job.salary} />
                <MetaBadge
                  icon={CalendarDays}
                  label={`Deadline: ${job.deadline}`}
                />
              </div>
            </div>

            {/* ── Tab content card ── */}
            <div className="flex flex-col gap-0 rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 pt-2">
                <TabBar active={activeTab} onChange={setActiveTab} />
              </div>
              <div className="p-6">
                {activeTab === "Overview" && <OverviewPanel job={job} />}
                {activeTab === "Requirements" && (
                  <RequirementsPanel job={job} />
                )}
                {activeTab === "Benefits" && <BenefitsPanel job={job} />}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════
              SIDEBAR  (right)
              ════════════════════════════════ */}
          <JobSidebar job={job} />
        </div>

        {/* ── Similar jobs ── */}
        {similarJobs.length > 0 && (
          <div className="mt-14 border-t border-border pt-12">
            <SimilarJobs jobs={similarJobs} />
          </div>
        )}
      </div>
    </div>
  );
}
