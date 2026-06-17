import {
  ScanSearch,
  TrendingUp,
  Building2,
  BookmarkCheck,
  MousePointerClick,
  FileText,
  Brain,
  Rocket,
} from "lucide-react";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Smart Search",
    description:
      "Laser-targeted filters surface the exact roles you're qualified for.",
  },
  {
    icon: TrendingUp,
    title: "Salary Intelligence",
    description:
      "Real-time compensation data from verified offers — negotiate with confidence.",
  },
  {
    icon: Building2,
    title: "Vetted Companies",
    description:
      "Every employer is reviewed for culture, pay transparency, and growth.",
  },
  {
    icon: BookmarkCheck,
    title: "Saved Jobs",
    description:
      "Bookmark, compare, and manage your pipeline from one clean dashboard.",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Apply",
    description:
      "Apply to any role instantly. Your profile does the work for you.",
  },
  {
    icon: FileText,
    title: "AI Resume Builder",
    description:
      "Generate a tailored resume for each role in under 30 seconds.",
  },
  {
    icon: Brain,
    title: "Skill-Based Matching",
    description:
      "AI maps your skills to open roles — not just titles and degrees.",
  },
  {
    icon: Rocket,
    title: "Career Acceleration",
    description: "Interview prep, salary guides, and growth tracks built in.",
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

export function Features() {
  return (
    <section className="w-full bg-background py-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-16 px-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-5 text-center">
          <SectionLabel>Platform Features</SectionLabel>
          <h2 className="font-heading max-w-xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Everything you need
            <br className="hidden sm:block" /> to land the role
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Built for ambitious professionals who want more signal and less
            noise in their job search.
          </p>
        </div>

        {/* Feature grid */}
        <div className="w-full rounded-2xl border border-white/[0.07] bg-card">
          {[FEATURES.slice(0, 4), FEATURES.slice(4)].map((row, rowIdx) => (
            <div key={rowIdx}>
              {rowIdx > 0 && <div className="h-px w-full bg-border" />}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {row.map((f, i) => {
                  const Icon = f.icon;
                  const isLast = i === row.length - 1;
                  return (
                    <div
                      key={f.title}
                      className={`flex flex-col gap-4 p-7 transition-colors hover:bg-accent/30 ${!isLast ? "lg:border-r border-border" : ""}`}
                    >
                      <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10">
                        <Icon className="size-5 text-brand" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <p className="font-heading text-sm font-semibold text-foreground">
                          {f.title}
                        </p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
