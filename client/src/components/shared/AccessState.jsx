import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

import { cn } from "@/lib/utils";

export default function AccessState({
  eyebrow,
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Go Home",
  primaryIcon: PrimaryIcon = Home,
  secondaryHref,
  secondaryLabel,
  icon: Icon,
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <section className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
        {Icon ? (
          <div
            className="flex size-14 items-center justify-center rounded-xl border border-border bg-card text-primary"
            aria-hidden="true"
          >
            <Icon className="size-7" />
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <p className="font-sans text-[12px] font-medium uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
          <h1 className="font-heading text-[34px] font-bold leading-tight text-foreground sm:text-[42px]">
            {title}
          </h1>
          <p className="mx-auto max-w-md font-sans text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5",
              "font-sans text-[14px] font-medium text-primary-foreground",
              "transition-colors hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <PrimaryIcon className="size-4" aria-hidden="true" />
            {primaryLabel}
          </Link>

          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-5",
                "font-sans text-[14px] font-medium text-muted-foreground",
                "transition-colors hover:border-primary hover:text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
