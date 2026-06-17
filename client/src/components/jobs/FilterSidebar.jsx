"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Data ─────────────────────────────────────────────────────────── */
const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

const CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Product",
  "Data & Analytics",
  "DevOps",
  "Sales",
  "Customer Success",
];

/* ── Section wrapper ──────────────────────────────────────────────── */
function FilterGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 last:border-b-0">
      <p className="font-heading text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

/* ── Checkbox row ─────────────────────────────────────────────────── */
function CheckboxItem({ label, checked, onChange }) {
  const id = `jt-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 group"
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-150",
          checked
            ? "border-primary bg-primary"
            : "border-border bg-popover group-hover:border-primary/60",
        )}
      >
        {checked && (
          /* simple check mark via SVG — no extra dep */
          <svg
            viewBox="0 0 10 10"
            className="size-2.5 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1.5,5 4,7.5 8.5,2.5" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        aria-label={label}
      />
      <span className="font-sans text-[14px] text-muted-foreground transition-colors group-hover:text-foreground">
        {label}
      </span>
    </label>
  );
}

/* ── Radio row ────────────────────────────────────────────────────── */
function RadioItem({ label, value, checked, onChange }) {
  const id = `cat-${value.toLowerCase().replace(/[\s&]+/g, "-")}`;
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 group"
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
          checked
            ? "border-primary bg-primary"
            : "border-border bg-popover group-hover:border-primary/60",
        )}
      >
        {checked && (
          <span className="size-1.5 rounded-full bg-primary-foreground" />
        )}
      </span>
      <input
        type="radio"
        id={id}
        name="category"
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        aria-label={label}
      />
      <span className="font-sans text-[14px] text-muted-foreground transition-colors group-hover:text-foreground">
        {label}
      </span>
    </label>
  );
}

/* ── Dual-handle salary range slider ─────────────────────────────── */
function SalarySlider({ min, max, value, onChange }) {
  const pct = (v) => ((v - min) / (max - min)) * 100;

  function handleMin(e) {
    const v = Math.min(Number(e.target.value), value[1] - 10);
    onChange([v, value[1]]);
  }
  function handleMax(e) {
    const v = Math.max(Number(e.target.value), value[0] + 10);
    onChange([value[0], v]);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Value labels */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-[13px] text-foreground">
          ${value[0]}K
        </span>
        <span className="font-sans text-[13px] text-foreground">
          ${value[1]}K
        </span>
      </div>

      {/* Track + thumbs */}
      <div className="relative h-5 flex items-center">
        {/* Base track */}
        <div className="absolute inset-x-0 h-1 rounded-full bg-border" />
        {/* Active track */}
        <div
          className="absolute h-1 rounded-full bg-primary"
          style={{
            left: `${pct(value[0])}%`,
            right: `${100 - pct(value[1])}%`,
          }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMin}
          aria-label="Minimum salary"
          className={cn(
            "absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent",
            "range-slider-thumb",
          )}
          style={{ zIndex: value[0] > max - 20 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMax}
          aria-label="Maximum salary"
          className={cn(
            "absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent",
            "range-slider-thumb",
          )}
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}

/* ── Main sidebar ─────────────────────────────────────────────────── */
export default function FilterSidebar({ filters, onChange }) {
  const { jobTypes, location, salary, category } = filters;

  function toggleJobType(type) {
    const next = jobTypes.includes(type)
      ? jobTypes.filter((t) => t !== type)
      : [...jobTypes, type];
    onChange({ ...filters, jobTypes: next });
  }

  function clearAll() {
    onChange({
      jobTypes: [],
      location: "",
      salary: [40, 200],
      category: "",
    });
  }

  return (
    <aside
      aria-label="Job filters"
      className={cn(
        "w-70 shrink-0 self-start",
        "sticky top-20" /* 16px navbar + 4px gap */,
        "rounded-xl border border-border bg-card",
        "overflow-hidden",
      )}
    >
      {/* ── Heading row ── */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-heading text-[16px] font-semibold text-foreground">
          Filters
        </h2>
        <button
          type="button"
          onClick={clearAll}
          className={cn(
            "font-sans text-[13px] font-medium text-primary",
            "transition-colors duration-150 hover:text-primary/75",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
          )}
        >
          Clear All
        </button>
      </div>

      <div className="px-5">
        {/* ── Job Type ── */}
        <FilterGroup label="Job Type">
          <div className="flex flex-col gap-2.5">
            {JOB_TYPES.map((type) => (
              <CheckboxItem
                key={type}
                label={type}
                checked={jobTypes.includes(type)}
                onChange={() => toggleJobType(type)}
              />
            ))}
          </div>
        </FilterGroup>

        {/* ── Location ── */}
        <FilterGroup label="Location">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="City, state, or remote"
              value={location}
              onChange={(e) =>
                onChange({ ...filters, location: e.target.value })
              }
              aria-label="Filter by location"
              className={cn(
                "h-9 w-full rounded-lg border border-border bg-popover pl-8 pr-3",
                "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
                "transition-colors outline-none",
                "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40",
              )}
            />
          </div>
        </FilterGroup>

        {/* ── Salary Range ── */}
        <FilterGroup label="Salary Range">
          <SalarySlider
            min={40}
            max={300}
            value={salary}
            onChange={(v) => onChange({ ...filters, salary: v })}
          />
          <p className="font-sans text-[12px] text-muted-foreground">
            Per year · USD · thousands
          </p>
        </FilterGroup>

        {/* ── Category ── */}
        <FilterGroup label="Category">
          <div className="flex flex-col gap-2.5">
            {CATEGORIES.map((cat) => (
              <RadioItem
                key={cat}
                label={cat}
                value={cat}
                checked={category === cat}
                onChange={() =>
                  onChange({
                    ...filters,
                    category: category === cat ? "" : cat,
                  })
                }
              />
            ))}
          </div>
        </FilterGroup>
      </div>
    </aside>
  );
}
