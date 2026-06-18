"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, MapPin, Users, Briefcase, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────
   COMPANY LOGO PLACEHOLDER
   ──────────────────────────────────────────────────────────────────── */
function CompanyLogo({ initials }) {
  return (
    <div
      className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-border bg-popover"
      aria-hidden="true"
    >
      <span className="font-heading text-[16px] font-semibold leading-none text-primary">
        {initials}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   INDUSTRY BADGE  (amber — matches job type badge convention)
   ──────────────────────────────────────────────────────────────────── */
function IndustryBadge({ label }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1",
        "bg-chart-2/10 text-chart-2",
        "font-sans text-[11px] font-medium",
      )}
    >
      {label}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────
   OPEN JOBS BADGE  (teal pill)
   ──────────────────────────────────────────────────────────────────── */
function OpenJobsBadge({ count }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
        "bg-primary/10 text-primary",
        "font-sans text-[12px] font-medium",
      )}
    >
      <Briefcase className="size-3 shrink-0" aria-hidden="true" />
      {count} open {count === 1 ? "job" : "jobs"}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────
   COMPANY CARD
   ──────────────────────────────────────────────────────────────────── */
function CompanyCard({ company }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:border-primary",
        "hover:shadow-[0_8px_32px_-4px_color-mix(in_oklch,var(--primary)_16%,transparent)]",
      )}
      aria-label={`${company.name} — ${company.industry}`}
    >
      {/* ── Top row: logo + industry badge ── */}
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo initials={company.initials} />
        <IndustryBadge label={company.industry} />
      </div>

      {/* ── Name ── */}
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-[18px] font-semibold leading-snug text-foreground">
          {company.name}
        </h2>

        {/* Location */}
        <span className="inline-flex items-center gap-1.5 font-sans text-[14px] text-muted-foreground">
          <MapPin
            className="size-3.5 shrink-0 text-muted-foreground/70"
            aria-hidden="true"
          />
          {company.location}
        </span>
      </div>

      {/* ── Description: 2-line clamp ── */}
      <p className="font-sans text-[14px] leading-relaxed text-muted-foreground line-clamp-2 flex-1">
        {company.description}
      </p>

      {/* ── Bottom row: employee count + open jobs ── */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
        <span className="inline-flex items-center gap-1.5 font-sans text-[13px] text-muted-foreground">
          <Users className="size-3.5 shrink-0" aria-hidden="true" />
          {company.employees}
        </span>
        <Link
          href={`/jobs?company=${encodeURIComponent(company.name)}`}
          aria-label={`View ${company.openJobs} open jobs at ${company.name}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          tabIndex={0}
        >
          <OpenJobsBadge count={company.openJobs} />
        </Link>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
   INDUSTRY FILTER TABS  (horizontal scroll)
   ──────────────────────────────────────────────────────────────────── */
function IndustryTabs({ active, industries, onChange }) {
  const scrollRef = useRef(null);

  return (
    /* Outer mask — fades at right edge to hint scrollability */
    <div
      className="relative"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 2%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 2%, black 92%, transparent 100%)",
      }}
    >
      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Filter companies by industry"
        className={cn(
          "flex items-center gap-2 overflow-x-auto px-1 py-1",
          /* Hide scrollbar cross-browser */
          "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]",
        )}
      >
        {industries.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab)}
              className={cn(
                "inline-flex shrink-0 items-center rounded-full px-4 py-1.5",
                "font-sans text-[14px] font-medium whitespace-nowrap",
                "transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_2px_8px_-1px_color-mix(in_oklch,var(--primary)_30%,transparent)]"
                  : [
                      "border border-border bg-popover text-muted-foreground",
                      "hover:border-primary/50 hover:text-foreground",
                    ],
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   SEARCH BAR
   ──────────────────────────────────────────────────────────────────── */
function CompanySearchBar({ value, onChange }) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-full max-w-120 items-center",
        "rounded-xl border border-border bg-popover",
        "transition-all duration-200",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30",
      )}
    >
      <Search
        className="ml-4 size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search companies, industries, or locations…"
        aria-label="Search companies"
        className={cn(
          "flex-1 bg-transparent px-3",
          "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
          "outline-none border-none h-full",
        )}
      />
      {/* Clear button — only visible when there's input */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className={cn(
            "mr-3 flex size-5 shrink-0 items-center justify-center rounded-full",
            "bg-muted-foreground/20 text-muted-foreground",
            "transition-colors hover:bg-muted-foreground/30",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   EMPTY STATE
   ──────────────────────────────────────────────────────────────────── */
function EmptyState({ query, industry }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
      <div
        className="mb-4 flex size-14 items-center justify-center rounded-full border border-border bg-popover"
        aria-hidden="true"
      >
        <Search className="size-6 text-muted-foreground/50" />
      </div>
      <p className="font-heading text-[18px] font-semibold text-foreground">
        No companies found
      </p>
      <p className="mt-2 max-w-xs font-sans text-[14px] leading-relaxed text-muted-foreground">
        {query
          ? `No results for "${query}"${industry !== "All" ? ` in ${industry}` : ""}. Try a different search.`
          : `No companies in ${industry} yet. Try a different industry.`}
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────────────────────────── */
export default function CompaniesClient({ companies = [] }) {
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const industries = useMemo(() => {
    const uniqueIndustries = companies
      .map((company) => company.industry)
      .filter(Boolean);
    return ["All", ...Array.from(new Set(uniqueIndustries))];
  }, [companies]);

  /* Derived: filter by industry then search query */
  const filteredCompanies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return companies.filter((company) => {
      if (activeIndustry !== "All" && company.industry !== activeIndustry) {
        return false;
      }

      if (!query) return true;

      return [company.name, company.industry, company.location, company.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [activeIndustry, companies, searchQuery]);

  /* Total open jobs across visible companies */
  const totalOpenJobs = useMemo(
    () => filteredCompanies.reduce((sum, c) => sum + c.openJobs, 0),
    [filteredCompanies],
  );

  function handleIndustryChange(tab) {
    setActiveIndustry(tab);
  }

  return (
    <div className="w-full bg-background">
      {/* ══════════════════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════════════════ */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <p
            className="mb-2 font-sans text-[12px] font-medium uppercase tracking-widest text-primary"
            aria-hidden="true"
          >
            {companies.length} Companies Hiring
          </p>

          {/* Heading + search — two rows stacked, then side-by-side on md */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-[36px] font-bold leading-tight text-foreground sm:text-[40px]">
                Explore Companies
              </h1>
              <p className="font-sans text-[15px] leading-relaxed text-muted-foreground max-w-md">
                Discover the teams shaping the future — and find your place
                among them.
              </p>
            </div>

            {/* Search bar */}
            <CompanySearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          INDUSTRY TABS + RESULTS COUNT
          ══════════════════════════════════════════════════════════════ */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <IndustryTabs
            active={activeIndustry}
            industries={industries}
            onChange={handleIndustryChange}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          COMPANY GRID
          ══════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Results meta row */}
        <div className="mb-6 flex items-center justify-between">
          <p className="font-sans text-[14px] text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredCompanies.length}
            </span>{" "}
            {filteredCompanies.length === 1 ? "company" : "companies"}
            {activeIndustry !== "All" && (
              <span>
                {" "}
                in <span className="text-foreground">{activeIndustry}</span>
              </span>
            )}
          </p>
          {filteredCompanies.length > 0 && (
            <p className="font-sans text-[13px] text-muted-foreground">
              <span className="font-medium text-primary">{totalOpenJobs}</span>{" "}
              open roles total
            </p>
          )}
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Company listings"
        >
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div key={company.id} role="listitem">
                <CompanyCard company={company} />
              </div>
            ))
          ) : (
            <EmptyState query={searchQuery} industry={activeIndustry} />
          )}
        </div>
      </div>
    </div>
  );
}
