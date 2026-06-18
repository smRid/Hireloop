"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const TRENDING_TAGS = ["Product Designer", "AI Engineering", "DevOps Engineer"];

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
      <rect width="100%" height="100%" fill="url(#dot-grid)" opacity="0.035" />
    </svg>
  );
}

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <section
      className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden border-b border-border/60 bg-background px-4 py-20"
      aria-labelledby="hero-heading"
    >
      <DotGrid />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/85 px-4 py-1.5 shadow-sm shadow-black/10 backdrop-blur">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          <span className="font-sans text-[12px] font-medium text-primary">
            50,000+ New Jobs This Month
          </span>
        </div>

        <h1
          id="hero-heading"
          className="font-heading text-[40px] font-bold leading-[1.04] text-foreground sm:text-[56px] lg:text-[72px]"
        >
          Find work that
          <br />
          <span className="text-primary">moves you forward</span>
        </h1>

        <p className="max-w-140 font-sans text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
          Search high-quality roles, compare companies, and keep your hiring
          journey organized from one focused workspace.
        </p>

        <div
          className={cn(
            "mt-2 flex h-14 w-full max-w-170 items-center rounded-xl border border-border/90 bg-popover/95",
            "overflow-hidden shadow-2xl shadow-black/20 transition-all duration-200 backdrop-blur",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          )}
          role="search"
        >
          <div className="flex flex-1 items-center gap-2.5 px-4">
            <Search
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Job title, skill, or company"
              aria-label="Job title, skill, or company"
              className={cn(
                "w-full border-none bg-transparent font-sans text-[14px] text-foreground",
                "placeholder:text-muted-foreground outline-none",
              )}
            />
          </div>

          <div className="h-7 w-px shrink-0 bg-border" aria-hidden="true" />

          <div className="hidden items-center gap-2.5 px-4 sm:flex">
            <MapPin
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Location"
              aria-label="Location"
              className={cn(
                "w-36 border-none bg-transparent font-sans text-[14px] text-foreground",
                "placeholder:text-muted-foreground outline-none",
              )}
            />
          </div>

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

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <span className="font-sans text-[13px] text-muted-foreground">
            Trending:
          </span>
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={cn(
                "rounded-full border border-border bg-card/70 px-3 py-1",
                "font-sans text-[12px] text-muted-foreground",
                "cursor-pointer transition-colors hover:border-primary/50 hover:text-primary",
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
