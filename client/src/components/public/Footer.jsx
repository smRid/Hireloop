import Link from "next/link";
import { FaLinkedin, FaGithub, FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import BrandMark from "@/components/shared/BrandMark";

const SEEKER_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Saved Jobs", href: "/saved" },
  { label: "My Applications", href: "/applications" },
  { label: "Pricing", href: "/pricing" },
  { label: "Sign Up", href: "/sign-up" },
];

const EMPLOYER_LINKS = [
  { label: "Post a Job", href: "/employer/post" },
  { label: "Manage Jobs", href: "/employer/jobs" },
  { label: "View Applicants", href: "/employer/applicants" },
  { label: "Recruiter Pricing", href: "/pricing#employers" },
  { label: "Register Company", href: "/employer/register" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/hireloop",
    icon: FaLinkedin,
  },
  { label: "GitHub", href: "https://github.com/hireloop", icon: FaGithub },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/hireloop",
    icon: FaXTwitter,
  },
];

/* ── Footer link component ─────────────────────────────────────────── */
function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="font-sans text-[14px] text-muted-foreground transition-colors duration-200 hover:text-primary"
    >
      {children}
    </Link>
  );
}

/* ── Column heading ────────────────────────────────────────────────── */
function ColumnHeading({ children }) {
  return (
    <h3 className="mb-4 font-sans text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

/* ── Main Footer ───────────────────────────────────────────────────── */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card px-4 pt-16 pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Top section: 4-column grid ── */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-5">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 select-none"
              aria-label="Hireloop home"
            >
              <BrandMark />
              <span className="font-heading text-[20px] font-bold leading-none text-foreground tracking-tight">
                Hireloop
              </span>
            </Link>

            {/* Tagline */}
            <p className="font-sans text-[14px] leading-relaxed text-muted-foreground max-w-65">
              Bridging talent and opportunity — faster.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-md",
                    "border border-border bg-secondary",
                    "text-muted-foreground transition-all duration-200",
                    "hover:border-primary hover:text-primary",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — For Job Seekers */}
          <div>
            <ColumnHeading>Job Seekers</ColumnHeading>
            <nav aria-label="Job Seeker Links">
              <ul className="flex flex-col gap-3" role="list">
                {SEEKER_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3 — For Employers */}
          <div>
            <ColumnHeading>Employers</ColumnHeading>
            <nav aria-label="Employer Links">
              <ul className="flex flex-col gap-3" role="list">
                {EMPLOYER_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 4 — Company */}
          <div>
            <ColumnHeading>Company</ColumnHeading>
            <nav aria-label="Company Links">
              <ul className="flex flex-col gap-3" role="list">
                {COMPANY_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="my-12 h-px w-full bg-border" aria-hidden="true" />

        {/* ── Bottom row: copyright + legal links ── */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <p className="font-sans text-[13px] text-muted-foreground">
            © {currentYear} Hireloop. All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-1 font-sans text-[13px]">
            <Link
              href="/privacy"
              className="text-muted-foreground transition-colors duration-200 hover:text-primary"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">
              {" · "}
            </span>
            <Link
              href="/terms"
              className="text-muted-foreground transition-colors duration-200 hover:text-primary"
            >
              Terms
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">
              {" · "}
            </span>
            <Link
              href="/cookies"
              className="text-muted-foreground transition-colors duration-200 hover:text-primary"
            >
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
