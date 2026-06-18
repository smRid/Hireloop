import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  CreditCard,
  Settings,
  Building2,
  Users,
  PlusSquare,
  BarChart2,
  ShieldCheck,
  DollarSign,
  Home,
  Search,
  List,
} from "lucide-react";

/* ── Section wrapper type ───────────────────────────────────────── */
// { type: "section", label }  — renders an uppercase section label
// { type: "link", label, href, icon }  — renders a nav item

/* ════════════════════════════════════════════════════════════════
   SEEKER NAV
   ════════════════════════════════════════════════════════════════ */
export const SEEKER_NAV = [
  { type: "section", label: "Dashboard" },
  {
    type: "link",
    label: "Overview",
    href: "/dashboard/seeker",
    icon: LayoutDashboard,
  },
  {
    type: "link",
    label: "My Applications",
    href: "/dashboard/seeker/applications",
    icon: FileText,
  },
  {
    type: "link",
    label: "Saved Jobs",
    href: "/dashboard/seeker/saved",
    icon: Bookmark,
  },
  {
    type: "link",
    label: "Browse Jobs",
    href: "/dashboard/seeker/jobs",
    icon: Search,
  },
  {
    type: "link",
    label: "Billing",
    href: "/dashboard/seeker/billing",
    icon: CreditCard,
  },
  {
    type: "link",
    label: "Settings",
    href: "/dashboard/seeker/settings",
    icon: Settings,
  },

  { type: "section", label: "Platform" },
  { type: "link", label: "Home", href: "/", icon: Home },
  { type: "link", label: "Browse Jobs", href: "/jobs", icon: Briefcase },
  { type: "link", label: "Companies", href: "/companies", icon: Building2 },
  { type: "link", label: "Pricing", href: "/pricing", icon: CreditCard },
];

/* ════════════════════════════════════════════════════════════════
   RECRUITER NAV
   ════════════════════════════════════════════════════════════════ */
export const RECRUITER_NAV = [
  { type: "section", label: "Dashboard" },
  {
    type: "link",
    label: "Overview",
    href: "/dashboard/recruiter",
    icon: LayoutDashboard,
  },
  {
    type: "link",
    label: "My Jobs",
    href: "/dashboard/recruiter/jobs",
    icon: List,
  },
  {
    type: "link",
    label: "Post a Job",
    href: "/dashboard/recruiter/jobs/new",
    icon: PlusSquare,
  },
  {
    type: "link",
    label: "Company Profile",
    href: "/dashboard/recruiter/company",
    icon: Building2,
  },
  {
    type: "link",
    label: "Analytics",
    href: "/dashboard/recruiter/analytics",
    icon: BarChart2,
  },
  {
    type: "link",
    label: "Billing",
    href: "/dashboard/recruiter/billing",
    icon: CreditCard,
  },
  {
    type: "link",
    label: "Settings",
    href: "/dashboard/recruiter/settings",
    icon: Settings,
  },

  { type: "section", label: "Platform" },
  { type: "link", label: "Home", href: "/", icon: Home },
  { type: "link", label: "Browse Jobs", href: "/jobs", icon: Briefcase },
  { type: "link", label: "Companies", href: "/companies", icon: Building2 },
  { type: "link", label: "Pricing", href: "/pricing", icon: CreditCard },
];

/* ════════════════════════════════════════════════════════════════
   ADMIN NAV
   ════════════════════════════════════════════════════════════════ */
export const ADMIN_NAV = [
  { type: "section", label: "Dashboard" },
  {
    type: "link",
    label: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  { type: "link", label: "Users", href: "/dashboard/admin/users", icon: Users },
  {
    type: "link",
    label: "Companies",
    href: "/dashboard/admin/companies",
    icon: Building2,
  },
  {
    type: "link",
    label: "Jobs",
    href: "/dashboard/admin/jobs",
    icon: Briefcase,
  },
  {
    type: "link",
    label: "Payments",
    href: "/dashboard/admin/payments",
    icon: DollarSign,
  },
  {
    type: "link",
    label: "Settings",
    href: "/dashboard/admin/settings",
    icon: ShieldCheck,
  },

  { type: "section", label: "Platform" },
  { type: "link", label: "Home", href: "/", icon: Home },
  { type: "link", label: "Browse Jobs", href: "/jobs", icon: Briefcase },
  { type: "link", label: "Companies", href: "/companies", icon: Building2 },
  { type: "link", label: "Pricing", href: "/pricing", icon: CreditCard },
];

/* ── Helper: pick nav by role ────────────────────────────────────── */
export function getNavByRole(role) {
  if (role === "recruiter") return RECRUITER_NAV;
  if (role === "admin") return ADMIN_NAV;
  return SEEKER_NAV;
}
