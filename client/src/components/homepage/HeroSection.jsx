"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const TRENDING_TAGS = ["Product Designer", "AI Engineering", "DevOps Engineer"];

/* ── Wavy SVG underline beneath "Dream Role" ─────────────────────── */
function WavyUnderline() {
  return (
    <svg
      viewBox="0 0 260 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -bottom-2 left-0 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 8 C 30 2, 60 12, 90 6 S 150 2, 180 7 S 230 12, 258 5"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Dot-grid SVG background pattern ─────────────────────────────── */
function DotGrid() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dot-grid"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.5" fill="var(--foreground)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" opacity="0.04" />
    </svg>
  );
}

/* ── Main Hero Section ────────────────────────────────────────────── */
export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <section
      className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-20"
      aria-labelledby="hero-heading"
    >
      {/* ── Radial teal glow at center-bottom ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-120 w-180 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, color-mix(in oklch, var(--primary) 8%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Dot grid ── */}
      <DotGrid />

      {/* ── Content stack ── */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/8 px-4 py-1.5">
          <span className="text-primary" aria-hidden="true">
            ✦
          </span>
          <span className="font-sans text-[12px] font-medium text-primary">
            50,000+ New Jobs This Month
          </span>
        </div>

        {/* Main heading */}
        <h1
          id="hero-heading"
          className="font-heading font-bold leading-[1.05] tracking-tight text-foreground text-[40px] sm:text-[56px] lg:text-[72px]"
        >
          Find Your Next
          <br />
          <span className="relative inline-block text-primary">
            Dream Role
            <WavyUnderline />
          </span>
        </h1>

        {/* Subheadline */}
        <p className="font-sans text-[16px] sm:text-[18px] text-muted-foreground max-w-130 leading-relaxed">
          Connect with top companies, discover roles that match your ambition,
          and take your career to the next level.
        </p>

        {/* ── Search bar ── */}
        <div
          className={cn(
            "mt-2 flex w-full max-w-160 items-center rounded-xl border border-border bg-popover",
            "h-13 overflow-hidden transition-all duration-200",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          )}
          role="search"
        >
          {/* Job input */}
          <div className="flex flex-1 items-center gap-2.5 px-4">
            <Search
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, skill, or company"
              aria-label="Job title, skill, or company"
              className={cn(
                "w-full bg-transparent font-sans text-[14px] text-foreground",
                "placeholder:text-muted-foreground",
                "outline-none border-none",
              )}
            />
          </div>

          {/* Divider */}
          <div className="h-7 w-px shrink-0 bg-border" aria-hidden="true" />

          {/* Location input — hidden on very small screens */}
          <div className="hidden items-center gap-2.5 px-4 sm:flex">
            <MapPin
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              aria-label="Location"
              className={cn(
                "w-32 bg-transparent font-sans text-[14px] text-foreground",
                "placeholder:text-muted-foreground",
                "outline-none border-none",
              )}
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            aria-label="Search jobs"
            className={cn(
              "flex h-full items-center gap-2 px-5",
              "bg-primary text-primary-foreground",
              "font-sans text-[14px] font-medium",
              "transition-colors hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            )}
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* ── Trending tags ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
          <span className="font-sans text-[13px] text-muted-foreground">
            Trending:
          </span>
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={cn(
                "rounded-full border border-primary/25 bg-primary/8 px-3 py-1",
                "font-sans text-[12px] text-primary/80",
                "transition-colors hover:border-primary/50 hover:text-primary",
                "cursor-pointer",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
