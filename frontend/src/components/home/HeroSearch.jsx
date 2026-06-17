"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const TRENDING = [
  "Product Designer",
  "AI Engineering",
  "DevOps Engineer",
  "Data Analyst",
];

export function HeroSearch() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      {/* Search bar */}
      <div className="flex w-full items-center rounded-2xl border border-white/10 bg-card/90 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-sm">
        <div className="flex flex-1 items-center gap-2.5 px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Job title, skill or company"
            aria-label="Job title, skill or company"
            className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex flex-1 items-center gap-2.5 px-3">
          <MapPin className="size-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Location or Remote"
            aria-label="Location or Remote"
            className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <Button
          aria-label="Search jobs"
          size="icon"
          className="size-10 shrink-0 rounded-xl bg-brand text-brand-foreground shadow-none hover:bg-brand/90"
        >
          <Search className="size-4" />
        </Button>
      </div>

      {/* Trending */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground/60">Trending:</span>
        {TRENDING.map((tag) => (
          <button
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-brand/50 hover:bg-brand/10 hover:text-brand"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
