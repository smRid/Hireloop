import Link from "next/link";
import { cn } from "@/lib/utils";

/*
 * Floating orbs are pure CSS — keyframes injected via a <style> tag so we
 * stay in a Server Component (no "use client" needed) while still animating.
 * All colors reference CSS custom properties; no hardcoded values anywhere.
 */

const ORBS = [
  // { size, top, left, duration, delay, opacity }
  {
    size: 280,
    top: "-10%",
    left: "-8%",
    duration: "14s",
    delay: "0s",
    opacity: 0.35,
  },
  {
    size: 200,
    top: "55%",
    left: "70%",
    duration: "18s",
    delay: "3s",
    opacity: 0.28,
  },
  {
    size: 160,
    top: "20%",
    left: "55%",
    duration: "11s",
    delay: "6s",
    opacity: 0.22,
  },
  {
    size: 120,
    top: "70%",
    left: "10%",
    duration: "16s",
    delay: "1.5s",
    opacity: 0.26,
  },
  {
    size: 90,
    top: "5%",
    left: "82%",
    duration: "13s",
    delay: "4s",
    opacity: 0.2,
  },
];

export default function CTABanner() {
  return (
    <>
      {/* ── Keyframe definitions ── */}
      <style>{`
        @keyframes orb-float {
          0%   { transform: translate(0,    0)    scale(1);    }
          33%  { transform: translate(18px, -22px) scale(1.06); }
          66%  { transform: translate(-12px, 14px) scale(0.96); }
          100% { transform: translate(0,    0)    scale(1);    }
        }
        @keyframes orb-float-alt {
          0%   { transform: translate(0,    0)    scale(1);    }
          40%  { transform: translate(-20px, 16px) scale(1.04); }
          75%  { transform: translate(14px, -18px) scale(0.97); }
          100% { transform: translate(0,    0)    scale(1);    }
        }
      `}</style>

      <section
        className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
        style={{
          /* teal → deep-teal gradient entirely via CSS vars */
          background:
            "linear-gradient(135deg, var(--primary) 0%, color-mix(in oklch, var(--primary) 55%, var(--background)) 100%)",
        }}
        aria-labelledby="cta-heading"
      >
        {/* ── Floating orbs ── */}
        {ORBS.map((orb, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full blur-2xl"
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              /* lighter teal with white blend for better contrast against the gradient */
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--card) 85%, var(--primary)), transparent 70%)",
              opacity: orb.opacity,
              animation: `${i % 2 === 0 ? "orb-float" : "orb-float-alt"} ${orb.duration} ${orb.delay} ease-in-out infinite`,
            }}
          />
        ))}

        {/* ── Content ── */}
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          {/* Heading */}
          <h2
            id="cta-heading"
            className="font-heading text-[36px] font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-[48px]"
          >
            Your next role is already
            <br className="hidden sm:block" /> looking for you.
          </h2>

          {/* Sub-copy */}
          <p
            className={cn(
              "max-w-120 font-sans text-[16px] leading-relaxed",
              "text-primary-foreground/75",
            )}
          >
            Join over 2 million job seekers who found their next opportunity on
            Hireloop. Free to start, powerful from day one.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* White-filled primary CTA */}
            <Link
              href="/sign-up"
              className={cn(
                "inline-flex items-center justify-center rounded-md",
                "px-7 py-3 font-sans text-[15px] font-medium",
                /* white fill → dark text using design tokens */
                "bg-primary-foreground text-primary",
                "transition-all duration-200 hover:bg-primary-foreground/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
              )}
            >
              Create Free Account
            </Link>

            {/* Ghost — white border + white text */}
            <Link
              href="/pricing"
              className={cn(
                "inline-flex items-center justify-center rounded-md",
                "border border-primary-foreground/50 px-7 py-3",
                "font-sans text-[15px] font-medium text-primary-foreground",
                "transition-all duration-200",
                "hover:border-primary-foreground hover:bg-primary-foreground/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
              )}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
