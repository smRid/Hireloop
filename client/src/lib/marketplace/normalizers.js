const MONEY = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const COMPACT = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});

export const compactNumber = (value) => {
  const number = Number(value) || 0;
  return COMPACT.format(number);
};

const getId = (item) => item?._id?.toString?.() ?? item?.id?.toString?.() ?? "";

const initialsFromName = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstTwo = parts.length > 1 ? [parts[0], parts[1]] : [name.slice(0, 2)];

  return firstTwo
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const daysSince = (date) => {
  if (!date) return 0;

  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return 0;

  return Math.max(0, Math.floor((Date.now() - then) / 86400000));
};

const isClosingSoon = (date) => {
  if (!date) return false;

  const deadline = new Date(date).getTime();
  if (Number.isNaN(deadline)) return false;

  const daysLeft = (deadline - Date.now()) / 86400000;
  return daysLeft >= 0 && daysLeft <= 7;
};

const formatSalary = (job) => {
  if (job.salaryRange) return job.salaryRange;

  if (job.salaryMin && job.salaryMax) {
    return `${MONEY.format(job.salaryMin)} - ${MONEY.format(job.salaryMax)}`;
  }

  if (job.salaryMin) return `From ${MONEY.format(job.salaryMin)}`;
  if (job.salaryMax) return `Up to ${MONEY.format(job.salaryMax)}`;

  return "Salary undisclosed";
};

const normalizeTextList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeBenefits = (value) => {
  const benefits = normalizeTextList(value);

  return benefits.map((benefit) => ({
    detail: benefit,
    icon: "+",
    label: benefit,
  }));
};

export const normalizeJob = (job = {}) => {
  const company = job.companyName ?? job.company ?? "Unknown company";
  const id = getId(job);
  const createdAt = job.createdAt ?? job.postedAt;

  return {
    ...job,
    id,
    category: job.jobCategory ?? job.category ?? "General",
    closing: isClosingSoon(job.applicationDeadline ?? job.deadline),
    company,
    daysAgo: daysSince(createdAt),
    deadline: job.applicationDeadline
      ? new Date(job.applicationDeadline).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Open until filled",
    description: job.description ?? job.overview ?? "No description provided.",
    employees: job.employees ?? "Team size unavailable",
    industry: job.industry ?? job.jobCategory ?? "Hiring",
    initials: job.initials ?? initialsFromName(company),
    location: job.location ?? (job.isRemote ? "Remote" : "Location flexible"),
    niceToHave: normalizeTextList(job.niceToHave),
    overview: job.overview ?? job.description ?? "No overview provided.",
    requirements: normalizeTextList(job.requirements),
    responsibilities: normalizeTextList(job.responsibilities),
    benefits: normalizeBenefits(job.benefits),
    salary: formatSalary(job),
    salaryMax: Number(job.salaryMax) || 999,
    salaryMin: Number(job.salaryMin) || 0,
    title: job.jobTitle ?? job.title ?? "Untitled role",
    type: job.jobType ?? job.type ?? "Full-time",
    website: job.website ?? job.companyWebsite ?? "#",
  };
};

export const normalizeCompany = (company = {}, jobs = []) => {
  const id = getId(company);
  const companyJobs = jobs.filter((job) => {
    return job.companyId === id || job.company === company.name;
  });

  return {
    ...company,
    id,
    description: company.description ?? "No company description provided.",
    employees: company.employeeCount
      ? `${company.employeeCount.toLocaleString()}+`
      : "Team size unavailable",
    initials: company.initials ?? initialsFromName(company.name),
    location: company.location ?? "Location flexible",
    openJobs: company.jobCount ?? companyJobs.length,
    website: company.websiteUrl ?? company.website ?? "#",
  };
};

const formatPlanPrice = (plan) => {
  if (plan.interval === "custom") return "Custom";
  if (!plan.price) return "$0";

  return MONEY.format(plan.price);
};

const planCta = (plan) => {
  const roleParam = plan.audience === "recruiter" ? "?role=recruiter" : "";
  if (plan.price === 0) return { cta: "Start Free", ctaHref: `/sign-up${roleParam}` };
  return { cta: "Get Started", ctaHref: `/sign-up?plan=${plan.planId}` };
};

export const normalizePlan = (plan = {}, index = 0) => {
  const cta = planCta(plan);

  return {
    ...plan,
    ...cta,
    badge: index === 1 ? "Most Popular" : plan.badge,
    featured: index === 1 || Boolean(plan.featured),
    features: Array.isArray(plan.features) ? plan.features : [],
    id: plan.planId ?? getId(plan),
    missing: [],
    name: plan.name ?? "Plan",
    period: plan.interval ?? "month",
    price: formatPlanPrice(plan),
    priceNote: plan.interval === "forever" ? "forever" : `/ ${plan.interval ?? "month"}`,
    tagline: plan.tagline ?? "Built for modern hiring workflows.",
  };
};
