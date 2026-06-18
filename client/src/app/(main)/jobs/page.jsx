"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import FilterSidebar from "@/components/jobs/FilterSidebar";
import JobListings from "@/components/jobs/JobListings";

const DEFAULT_FILTERS = {
  jobTypes: [],
  location: "",
  salary: [40, 200],
  category: "",
};

export default function BrowseJobsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  return (
    <div className="w-full bg-background">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p
            className="font-sans text-[12px] font-medium uppercase tracking-widest text-primary mb-2"
            aria-hidden="true"
          >
            50,000+ Opportunities
          </p>
          <h1 className="font-heading text-[36px] font-semibold leading-tight text-foreground sm:text-[42px]">
            Browse Jobs
          </h1>
          <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted-foreground max-w-xl">
            Discover your next role from thousands of companies hiring right
            now.
          </p>
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-start gap-6",
            /* sidebar hidden below lg, stack on mobile */
            "flex-col lg:flex-row",
          )}
        >
          {/* ── Filter sidebar ── */}
          <div className="w-full lg:w-70 lg:shrink-0">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          {/* ── Job listings ── */}
          <JobListings filters={filters} />
        </div>
      </div>
    </div>
  );
}
