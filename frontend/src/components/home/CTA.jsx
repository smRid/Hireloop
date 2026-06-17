import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-36">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/cta-bg.png"
          alt=""
          fill
          aria-hidden="true"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-7 px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-1.5">
          <span className="text-xs font-semibold tracking-wider text-brand uppercase">
            Join 15,000+ professionals
          </span>
        </div>

        <h2 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Your next role is
          <br />
          already looking for you
        </h2>

        <p className="max-w-sm text-base text-muted-foreground">
          Build a profile in three minutes. AI-matched opportunities start
          arriving by morning.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="group gap-2 rounded-xl bg-brand px-7 py-5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 hover:bg-brand/90"
          >
            <Link href="/sign-up">
              Create free account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 px-7 py-5 text-sm font-semibold text-foreground backdrop-blur-sm hover:border-brand/40 hover:text-brand shadow-none"
          >
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
