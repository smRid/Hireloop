"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import FilterSidebar from "@/components/jobsPage/FilterSidebar";
import JobListings from "@/components/jobsPage/JobListings";

const DEFAULT_FILTERS = {
  category: "",
  jobTypes: [],
  location: "",
  salary: [40, 200],
};

export default function BrowseJobsClient({ jobs = [], total = 0 }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  return (
    <div className="w-full bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p
            className="mb-2 font-sans text-[12px] font-medium uppercase tracking-widest text-primary"
            aria-hidden="true"
          >
            {total.toLocaleString()} Opportunities
          </p>
          <h1 className="font-heading text-[36px] font-semibold leading-tight text-foreground sm:text-[42px]">
            Browse Jobs
          </h1>
          <p className="mt-2 max-w-xl font-sans text-[15px] leading-relaxed text-muted-foreground">
            Discover your next role from companies hiring right now.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className={cn("flex items-start gap-6", "flex-col lg:flex-row")}>
          <div className="w-full lg:w-70 lg:shrink-0">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          <JobListings filters={filters} jobs={jobs} />
        </div>
      </div>
    </div>
  );
}
