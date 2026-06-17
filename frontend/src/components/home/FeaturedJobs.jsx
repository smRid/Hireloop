import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "./JobCard";

const JOBS = [
  {
    id: 1,
    company: "Stripe",
    title: "Frontend Engineer",
    description:
      "Build pixel-perfect UIs for millions of users. Own the design system and work closely with product.",
    location: "Remote",
    type: "Full-time",
    salary: "$120–$160K",
  },
  {
    id: 2,
    company: "Figma",
    title: "Product Designer",
    description:
      "Shape the future of collaborative design tools. Lead end-to-end product experiences.",
    location: "San Francisco",
    type: "Hybrid",
    salary: "$130–$170K",
  },
  {
    id: 3,
    company: "Vercel",
    title: "DevOps Engineer",
    description:
      "Scale the infrastructure that powers millions of deployments. Deep work on edge networks.",
    location: "Remote",
    type: "Full-time",
    salary: "$140–$180K",
  },
  {
    id: 4,
    company: "Linear",
    title: "Full Stack Developer",
    description:
      "Work on a fast-growing B2B SaaS product loved by engineering teams worldwide.",
    location: "New York",
    type: "Hybrid",
    salary: "$110–$150K",
  },
  {
    id: 5,
    company: "Notion",
    title: "AI/ML Engineer",
    description:
      "Integrate intelligence into a product used by 30M+ people. Research-to-production ownership.",
    location: "Remote",
    type: "Full-time",
    salary: "$150–$200K",
  },
  {
    id: 6,
    company: "Loom",
    title: "Backend Engineer",
    description:
      "Architect and scale video delivery infrastructure handling billions of minutes of content.",
    location: "Austin, TX",
    type: "Hybrid",
    salary: "$115–$155K",
  },
];

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
      <span className="font-sans text-xs font-semibold tracking-[0.18em] text-brand uppercase">
        {children}
      </span>
      <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
    </div>
  );
}

export function FeaturedJobs() {
  return (
    <section className="w-full bg-background py-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-16 px-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-5 text-center">
          <SectionLabel>Smart Job Discovery</SectionLabel>
          <h2 className="font-heading max-w-xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Roles you&apos;d never find
            <br className="hidden sm:block" /> by searching alone
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Our AI surfaces high-signal opportunities from top companies —
            matched to your skills, not just your keywords.
          </p>
        </div>

        {/* Grid */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {JOBS.map((job) => (
            <JobCard key={job.id} {...job} href={`/jobs/${job.id}`} />
          ))}
        </div>

        {/* CTA */}
        <Button
          asChild
          variant="outline"
          className="group gap-2 rounded-xl border-border px-7 py-5 text-sm font-semibold text-foreground hover:border-brand hover:text-brand"
        >
          <Link href="/jobs">
            View all open roles
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
