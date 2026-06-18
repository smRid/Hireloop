import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import JobCard from "./featured-jobs/JobCard";

const JOBS = [
  {
    id: 1,
    company: "Figma",
    initials: "Fi",
    location: "San Francisco, CA",
    title: "Senior Product Designer",
    description:
      "Define and ship pixel-perfect experiences across web and mobile. Collaborate with PMs and engineers to turn complex problems into elegant interfaces.",
    salary: "$130K – $160K",
    type: "Full-time",
  },
  {
    id: 2,
    company: "Vercel",
    initials: "Ve",
    location: "Remote · Global",
    title: "AI Platform Engineer",
    description:
      "Build and scale AI-powered developer tooling on Vercel's edge infrastructure. Own the runtime pipeline from prompt to production deployment.",
    salary: "$150K – $185K",
    type: "Full-time",
  },
  {
    id: 3,
    company: "Linear",
    initials: "Li",
    location: "New York, NY",
    title: "DevOps Engineer",
    description:
      "Architect CI/CD pipelines, manage Kubernetes clusters, and ensure 99.99% uptime for a fast-growing SaaS product used by thousands of engineering teams.",
    salary: "$120K – $148K",
    type: "Contract",
  },
  {
    id: 4,
    company: "Stripe",
    initials: "St",
    location: "Dublin, Ireland",
    title: "Backend Engineer – Payments",
    description:
      "Develop highly reliable payment processing services at global scale. Work alongside world-class engineers on infrastructure that moves billions of dollars.",
    salary: "$140K – $175K",
    type: "Full-time",
  },
  {
    id: 5,
    company: "Notion",
    initials: "No",
    location: "Remote · US",
    title: "Growth Marketing Manager",
    description:
      "Own acquisition and activation experiments across paid, SEO, and lifecycle channels. Use data to turn insights into campaigns that drive real product growth.",
    salary: "$110K – $135K",
    type: "Full-time",
  },
  {
    id: 6,
    company: "Loom",
    initials: "Lo",
    location: "Austin, TX",
    title: "iOS Engineer",
    description:
      "Build smooth, performant video recording and playback features in Swift. Shape the mobile experience for millions of async communicators worldwide.",
    salary: "$125K – $155K",
    type: "Part-time",
  },
];

const FeaturedJobs = () => {
  return (
    <section
      className="w-full bg-background px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="featured-jobs-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* ── Section header ── */}
        <div className="mb-12 flex flex-col gap-3">
          <span
            className={cn(
              "font-sans text-[12px] font-medium uppercase tracking-widest text-primary",
            )}
            aria-hidden="true"
          >
            Smart Job Discovery
          </span>
          <h2
            id="featured-jobs-heading"
            className="font-heading text-[36px] font-semibold leading-tight text-foreground sm:text-[40px]"
          >
            Featured Opportunities
          </h2>
        </div>

        {/* ── Card grid ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* ── View all CTA ── */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/jobs"
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 shadow-sm shadow-black/10",
              "px-6 py-2.5 font-sans text-[14px] font-medium text-muted-foreground",
              "transition-all duration-200 hover:border-primary/60 hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            Browse All Jobs
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
