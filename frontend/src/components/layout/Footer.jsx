import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Job Discovery", href: "/jobs" },
      { label: "Worker AI", href: "/ai" },
      { label: "Companies", href: "/company" },
      { label: "Salary Data", href: "/salary" },
    ],
  },
  {
    heading: "Navigation",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Career Library", href: "/library" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Brand Guideline", href: "/brand" },
      { label: "Newsroom", href: "/news" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/6 bg-background px-4 pb-8 pt-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
            <Link href="/" aria-label="Seekcruitr home">
              <Image
                src="/logo.png"
                alt="Seekcruitr"
                width={110}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="max-w-45 text-sm leading-relaxed text-muted-foreground">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-card text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
              >
                <FaFacebook className="size-3.5" />
              </Link>
              <Link
                href="https://pinterest.com"
                aria-label="Pinterest"
                className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground transition-opacity hover:opacity-80"
              >
                <FaPinterestP className="size-3.5" />
              </Link>
              <Link
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="flex size-8 items-center justify-center rounded-lg border border-white/[0.07] bg-card text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
              >
                <FaLinkedinIn className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-brand uppercase">
                {heading}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground/60">
            © 2024 Seekcruitr · Programming Hero. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              Terms & Policy
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
