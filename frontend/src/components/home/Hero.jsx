import Image from "next/image";
import { HeroBadge } from "./HeroBadge";
import { HeroSearch } from "./HeroSearch";
import { HeroStats } from "./HeroStats";

export function Hero() {
  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
      {/* Globe background — fills the lower 70%, bleeds off bottom */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/globe.png"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="object-cover object-bottom opacity-90"
        />
        {/* top fade — navbar area */}
        <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-background via-background/80 to-transparent" />
        {/* bottom fade — into next section */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-background to-transparent" />
        {/* subtle vignette sides */}
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4">
        {/* Upper text block */}
        <div className="flex flex-col items-center gap-6 pt-40 text-center">
          <HeroBadge />

          <h1 className="font-heading max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Find Your{" "}
            <span className="bg-linear-to-r from-brand to-violet-300 bg-clip-text text-transparent">
              Dream Job
            </span>{" "}
            Today
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Seekcruitr connects top talent with world-class companies. Browse
            thousands of curated roles and land your next opportunity — faster.
          </p>

          <HeroSearch />
        </div>

        {/* Mid-section social proof */}
        <div className="mt-28 flex flex-col items-center gap-2 text-center">
          <p className="font-heading text-2xl font-semibold text-foreground/90 md:text-3xl">
            Assisting over{" "}
            <span className="text-brand">15,000 job seekers</span>
          </p>
          <p className="text-base text-muted-foreground">
            find their dream positions every month.
          </p>
        </div>

        {/* Stats — bottom */}
        <div className="mt-16 w-full pb-20">
          <HeroStats />
        </div>
      </div>
    </section>
  );
}
