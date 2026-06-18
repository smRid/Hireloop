"use client";

import { useState, useRef } from "react";
import {
  Search,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Upload,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ALL_JOBS } from "@/lib/jobs-data";

/* ════════════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════════════ */

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
  "Internship",
];
const CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Finance",
  "Product",
  "Sales",
  "Data & Analytics",
  "DevOps",
  "Customer Success",
];
const SALARY_RANGES = [
  { label: "$0 – $50K", min: 0, max: 50 },
  { label: "$50K – $100K", min: 50, max: 100 },
  { label: "$100K – $150K", min: 100, max: 150 },
  { label: "$150K+", min: 150, max: Infinity },
];
const DATE_POSTED = [
  { label: "Any time", value: "any" },
  { label: "Last 24h", value: "1" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
];
const SORT_OPTIONS = [
  { label: "Most Relevant", value: "relevant" },
  { label: "Newest", value: "newest" },
  { label: "Salary High–Low", value: "salary" },
];

/* Applications remaining mock */
const APPS_USED = 24;
const APPS_TOTAL = 30;

/* ════════════════════════════════════════════════════════════════════
   COMPANY LOGO
   ════════════════════════════════════════════════════════════════════ */

function CompanyLogo({ initials }) {
  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-md",
        "border border-border bg-secondary",
        "font-heading text-[13px] font-semibold leading-none text-primary",
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   APPLY MODAL
   ════════════════════════════════════════════════════════════════════ */

function ApplyModal({ job, open, onClose }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    if (file.type !== "application/pdf") return;
    if (file.size > 5 * 1024 * 1024) return;
    setResumeFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    /* Mock submit — close modal */
    onClose();
  }

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={true}
        className={cn(
          "bg-card border border-border rounded-2xl p-8 max-w-120 w-full gap-0",
        )}
      >
        {/* ── Header ── */}
        <DialogHeader className="gap-1 mb-5">
          <DialogTitle className="font-heading text-[20px] font-semibold leading-tight text-foreground">
            {job.title}
          </DialogTitle>
          <DialogDescription className="font-sans text-[14px] text-muted-foreground">
            {job.company}
          </DialogDescription>
        </DialogHeader>

        {/* ── Divider ── */}
        <div className="h-px w-full bg-border mb-6" aria-hidden="true" />

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
          {/* Cover Letter */}
          <p className="font-sans text-[12px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Cover Letter
          </p>
          <textarea
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write a brief note to the recruiter... (optional)"
            className={cn(
              "w-full resize-none rounded-lg border border-border bg-secondary",
              "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
              "px-3 py-2.5 outline-none",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
              "transition-colors duration-150",
            )}
          />

          {/* Resume */}
          <p className="font-sans text-[12px] font-medium uppercase tracking-widest text-muted-foreground mt-5 mb-2">
            Resume
          </p>

          {resumeFile ? (
            /* ── Uploaded file pill ── */
            <div
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary px-4 py-3",
              )}
            >
              <span className="font-sans text-[14px] text-foreground truncate">
                {resumeFile.name}
              </span>
              <button
                type="button"
                onClick={() => setResumeFile(null)}
                aria-label="Remove resume"
                className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            /* ── Drop zone ── */
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              aria-label="Upload your resume"
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border",
                "bg-secondary px-6 py-5",
                "transition-all duration-150",
                "hover:border-primary hover:bg-primary/5",
                isDragOver && "border-primary bg-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <Upload
                className="size-6 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="font-sans text-[14px] text-muted-foreground">
                Upload your resume
              </span>
              <span className="font-sans text-[12px] text-muted-foreground">
                PDF up to 5MB
              </span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {/* ── Footer ── */}
          <div className="flex items-center justify-between gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-lg px-4",
                "font-sans text-[14px] font-medium text-muted-foreground",
                "border border-border bg-transparent",
                "hover:border-border hover:text-foreground",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-lg px-5",
                "bg-primary text-primary-foreground",
                "font-sans text-[14px] font-medium",
                "hover:opacity-90 transition-opacity duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Submit Application
            </button>
          </div>

          {/* ── Usage note ── */}
          <p className="mt-3 text-center font-sans text-[12px] text-muted-foreground">
            You have{" "}
            <span className="font-medium text-foreground">
              {APPS_USED} / {APPS_TOTAL}
            </span>{" "}
            applications remaining this month.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════════════════════════════════
   JOB CARD
   ════════════════════════════════════════════════════════════════════ */

function JobCard({ job, onApply }) {
  const [saved, setSaved] = useState(false);

  const isNew = job.daysAgo <= 3;

  return (
    <article
      className={cn(
        "flex flex-row items-start gap-4 rounded-xl border border-border bg-card p-5",
        "transition-all duration-200 ease-out",
        "hover:border-primary/50 hover:bg-card hover:shadow-sm",
      )}
      aria-label={`${job.title} at ${job.company}`}
    >
      {/* ── Left section (grows) ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Row 1: Logo + company + location */}
        <div className="flex items-center gap-3">
          <CompanyLogo initials={job.initials} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-sans text-[14px] font-medium text-foreground">
              {job.company}
            </span>
            <span className="flex items-center gap-1 font-sans text-[13px] text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              {job.location}
            </span>
          </div>
        </div>

        {/* Row 2: Job title */}
        <h2 className="mt-2 font-heading text-[18px] font-semibold leading-snug text-foreground">
          {job.title}
        </h2>

        {/* Row 3: Badge row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {/* Job type */}
          <span
            className={cn(
              "inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1",
              "font-sans text-[12px] text-primary",
            )}
          >
            {job.type}
          </span>
          {/* Category */}
          <span
            className={cn(
              "inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-1",
              "font-sans text-[12px] text-muted-foreground",
            )}
          >
            {job.category}
          </span>
          {/* NEW pill */}
          {isNew && (
            <span
              className={cn(
                "inline-flex items-center rounded-full border border-chart-3/20 bg-chart-3/10 px-2.5 py-1",
                "font-sans text-[12px] font-medium text-chart-3",
              )}
            >
              NEW
            </span>
          )}
        </div>

        {/* Row 4: Salary + deadline */}
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="font-heading text-[15px] font-semibold text-primary">
            {job.salary}
          </span>
          {job.deadline && (
            <span className="font-sans text-[12px] text-muted-foreground">
              Apply by {job.deadline}
            </span>
          )}
        </div>
      </div>

      {/* ── Right section (shrink, actions) ── */}
      <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
        {/* Bookmark */}
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
          aria-pressed={saved}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg border transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            saved
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary",
          )}
        >
          {saved ? (
            <BookmarkCheck className="size-4" aria-hidden="true" />
          ) : (
            <Bookmark className="size-4" aria-hidden="true" />
          )}
        </button>

        {/* Apply Now */}
        <button
          type="button"
          onClick={() => onApply(job)}
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg px-4",
            "bg-primary text-primary-foreground",
            "font-sans text-[14px] font-medium",
            "hover:opacity-90 transition-opacity duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          Apply Now
        </button>
      </div>
    </article>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FILTER SELECT — shared trigger style
   ════════════════════════════════════════════════════════════════════ */

function FilterSelect({ placeholder, value, onValueChange, children }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "h-9.5 rounded-lg border-border bg-card font-sans text-[14px] text-foreground",
          "data-placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">{children}</SelectContent>
    </Select>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function BrowseJobsPage() {
  /* ── Search state ── */
  const [keyword, setKeyword] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");
  const [activeLocation, setActiveLocation] = useState("");

  /* ── Filter state ── */
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [sortBy, setSortBy] = useState("relevant");

  /* ── Modal state ── */
  const [applyJob, setApplyJob] = useState(null);

  /* ── Clear filters ── */
  function clearFilters() {
    setJobType("");
    setCategory("");
    setSalaryRange("");
    setDatePosted("");
  }

  const hasFilters = jobType || category || salaryRange || datePosted;

  /* ── Search handler ── */
  function handleSearch() {
    setActiveKeyword(keyword.trim());
    setActiveLocation(locationInput.trim());
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  /* ── Derive filtered + sorted jobs ── */
  const NOW_DATE = new Date("2026-06-10");

  const filtered = ALL_JOBS.filter((job) => {
    /* Keyword search */
    if (activeKeyword) {
      const kw = activeKeyword.toLowerCase();
      const match =
        job.title.toLowerCase().includes(kw) ||
        job.company.toLowerCase().includes(kw) ||
        job.category.toLowerCase().includes(kw);
      if (!match) return false;
    }

    /* Location */
    if (activeLocation) {
      const loc = activeLocation.toLowerCase();
      if (!job.location.toLowerCase().includes(loc)) return false;
    }

    /* Job type filter */
    if (jobType) {
      /* "Remote" filter matches jobs with Remote in location */
      if (jobType === "Remote") {
        if (!job.location.toLowerCase().includes("remote")) return false;
      } else {
        if (job.type !== jobType) return false;
      }
    }

    /* Category */
    if (category && job.category !== category) return false;

    /* Salary range */
    if (salaryRange) {
      const range = SALARY_RANGES.find((r) => r.label === salaryRange);
      if (range) {
        if (job.salaryMax < range.min || job.salaryMin > range.max)
          return false;
      }
    }

    /* Date posted */
    if (datePosted && datePosted !== "any") {
      const days = parseInt(datePosted, 10);
      if (job.daysAgo > days) return false;
    }

    return true;
  });

  /* ── Sort ── */
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest") return a.daysAgo - b.daysAgo;
    if (sortBy === "salary") return b.salaryMax - a.salaryMax;
    /* Most Relevant — new jobs first, then by salary */
    if (a.daysAgo !== b.daysAgo) return a.daysAgo - b.daysAgo;
    return b.salaryMax - a.salaryMax;
  });

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* ══════════════════════════════════════════════════════════
            PAGE HEADER
            ══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
            Browse Jobs
          </h1>
          <p className="font-sans text-[14px] text-muted-foreground">
            Find and apply to your next opportunity.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SEARCH BAR
            ══════════════════════════════════════════════════════════ */}
        <div
          role="search"
          aria-label="Search jobs"
          className={cn(
            "flex h-12 w-full items-center overflow-hidden",
            "rounded-xl border border-border bg-card",
            "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
            "transition-all duration-200",
          )}
        >
          {/* Keyword input */}
          <div className="flex flex-1 items-center gap-2.5 px-4">
            <Search
              className="size-4.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Job title, skill, or keyword..."
              aria-label="Job title, skill, or keyword"
              className={cn(
                "h-full flex-1 bg-transparent",
                "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
                "outline-none border-none",
              )}
            />
          </div>

          {/* Divider */}
          <div className="h-6 w-px shrink-0 bg-border" aria-hidden="true" />

          {/* Location input */}
          <div className="flex items-center gap-2 px-4">
            <MapPin
              className="size-4.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Location or Remote"
              aria-label="Location or Remote"
              className={cn(
                "w-36 bg-transparent sm:w-44",
                "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
                "outline-none border-none",
              )}
            />
          </div>

          {/* Search button */}
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Search jobs"
            className={cn(
              "mx-1.5 inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-4",
              "bg-primary text-primary-foreground",
              "font-sans text-[14px] font-medium",
              "hover:opacity-90 transition-opacity duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            Search
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FILTER ROW
            ══════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden scrollbar-none"
          role="group"
          aria-label="Filter jobs"
        >
          {/* Job Type */}
          <FilterSelect
            placeholder="Job Type"
            value={jobType}
            onValueChange={setJobType}
          >
            {JOB_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </FilterSelect>

          {/* Category */}
          <FilterSelect
            placeholder="Category"
            value={category}
            onValueChange={setCategory}
          >
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </FilterSelect>

          {/* Salary Range */}
          <FilterSelect
            placeholder="Salary Range"
            value={salaryRange}
            onValueChange={setSalaryRange}
          >
            {SALARY_RANGES.map((r) => (
              <SelectItem key={r.label} value={r.label}>
                {r.label}
              </SelectItem>
            ))}
          </FilterSelect>

          {/* Date Posted */}
          <FilterSelect
            placeholder="Date Posted"
            value={datePosted}
            onValueChange={setDatePosted}
          >
            {DATE_POSTED.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </FilterSelect>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className={cn(
                "ml-auto shrink-0 font-sans text-[13px] text-primary",
                "hover:text-primary/75 transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
              )}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════
            RESULTS META ROW
            ══════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between gap-4">
          <p className="font-sans text-[14px] text-muted-foreground">
            <span className="font-medium text-foreground">{sorted.length}</span>{" "}
            job{sorted.length !== 1 ? "s" : ""} found
          </p>

          {/* Sort */}
          <FilterSelect
            placeholder="Sort by"
            value={sortBy}
            onValueChange={setSortBy}
          >
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </FilterSelect>
        </div>

        {/* ══════════════════════════════════════════════════════════
            JOB LISTING CARDS
            ══════════════════════════════════════════════════════════ */}
        {sorted.length > 0 ? (
          <ul
            className="flex flex-col gap-3"
            role="list"
            aria-label="Job listings"
          >
            {sorted.map((job) => (
              <li key={job.id}>
                <JobCard job={job} onApply={setApplyJob} />
              </li>
            ))}
          </ul>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center",
            )}
          >
            <p className="font-heading text-[18px] font-semibold text-foreground">
              No jobs found
            </p>
            <p className="mt-2 max-w-xs font-sans text-[14px] text-muted-foreground">
              Try adjusting your search terms or filters to find more
              opportunities.
            </p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          APPLY MODAL
          ══════════════════════════════════════════════════════════ */}
      <ApplyModal
        job={applyJob}
        open={!!applyJob}
        onClose={() => setApplyJob(null)}
      />
    </>
  );
}
