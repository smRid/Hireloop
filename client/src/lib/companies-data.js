/* ── Company data ────────────────────────────────────────────────── */
/* Derived from ALL_JOBS companies + extra entries for grid variety   */

export const ALL_COMPANIES = [
  {
    id: 1,
    name: "Figma",
    initials: "Fi",
    industry: "Design Tools",
    industryFull: "Design Tools / SaaS",
    location: "San Francisco, CA",
    employees: "1,000 – 5,000",
    openJobs: 8,
    description:
      "Figma is the collaborative interface design tool that's changing how teams build products together. Used by over 4 million designers worldwide.",
    website: "https://figma.com",
    tags: ["Design Tools", "SaaS"],
  },
  {
    id: 2,
    name: "Vercel",
    initials: "Ve",
    industry: "Developer Tools",
    industryFull: "Cloud Infrastructure / Developer Tools",
    location: "Remote · Global",
    employees: "500 – 1,000",
    openJobs: 14,
    description:
      "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
    website: "https://vercel.com",
    tags: ["Developer Tools", "AI"],
  },
  {
    id: 3,
    name: "Linear",
    initials: "Li",
    industry: "Developer Tools",
    industryFull: "Project Management / SaaS",
    location: "New York, NY",
    employees: "50 – 200",
    openJobs: 5,
    description:
      "Linear is the issue tracking tool built for high-performance teams. Designed for speed, it streamlines software projects, sprints, and tasks.",
    website: "https://linear.app",
    tags: ["Developer Tools", "SaaS"],
  },
  {
    id: 4,
    name: "Stripe",
    initials: "St",
    industry: "Fintech",
    industryFull: "Fintech / Payments",
    location: "Dublin, Ireland",
    employees: "8,000+",
    openJobs: 23,
    description:
      "Stripe builds the economic infrastructure for the internet. Millions of companies of every size use Stripe to accept payments and manage their businesses.",
    website: "https://stripe.com",
    tags: ["Fintech"],
  },
  {
    id: 5,
    name: "Notion",
    initials: "No",
    industry: "SaaS",
    industryFull: "Productivity / SaaS",
    location: "Remote · US",
    employees: "500 – 1,000",
    openJobs: 11,
    description:
      "Notion is the all-in-one workspace for notes, documents, and collaboration. Teams use it to manage projects, build wikis, and run their companies.",
    website: "https://notion.so",
    tags: ["SaaS", "AI"],
  },
  {
    id: 6,
    name: "Shopify",
    initials: "Sh",
    industry: "E-Commerce",
    industryFull: "E-Commerce / Platform",
    location: "Remote · Canada",
    employees: "10,000+",
    openJobs: 37,
    description:
      "Shopify is the commerce platform for over 2 million businesses worldwide. Merchants use Shopify to sell online, in-store, and everywhere in between.",
    website: "https://shopify.com",
    tags: ["E-Commerce"],
  },
  {
    id: 7,
    name: "Atlassian",
    initials: "At",
    industry: "Developer Tools",
    industryFull: "Project Management / SaaS",
    location: "Sydney, Australia",
    employees: "10,000+",
    openJobs: 19,
    description:
      "Atlassian makes tools that help teams collaborate. Jira, Confluence, and Trello are used by over 300,000 teams at companies of all sizes.",
    website: "https://atlassian.com",
    tags: ["Developer Tools", "SaaS"],
  },
  {
    id: 8,
    name: "GitHub",
    initials: "Gh",
    industry: "Developer Tools",
    industryFull: "Developer Tools / Microsoft",
    location: "Remote · Global",
    employees: "3,000 – 5,000",
    openJobs: 16,
    description:
      "GitHub is the world's leading software development platform. Over 100 million developers use GitHub to build, ship, and maintain software together.",
    website: "https://github.com",
    tags: ["Developer Tools", "AI"],
  },
  {
    id: 9,
    name: "HubSpot",
    initials: "Hu",
    industry: "SaaS",
    industryFull: "CRM / Marketing Automation",
    location: "Boston, MA",
    employees: "7,000+",
    openJobs: 28,
    description:
      "HubSpot's CRM platform connects marketing, sales, and customer service. Trusted by over 150,000 companies in 120+ countries.",
    website: "https://hubspot.com",
    tags: ["SaaS"],
  },
  {
    id: 10,
    name: "Intercom",
    initials: "In",
    industry: "AI",
    industryFull: "Customer Messaging / SaaS",
    location: "Dublin, Ireland",
    employees: "1,000 – 3,000",
    openJobs: 9,
    description:
      "Intercom is the AI-first customer service platform. It helps businesses build relationships and deliver world-class support through conversational AI.",
    website: "https://intercom.com",
    tags: ["AI", "SaaS"],
  },
  {
    id: 11,
    name: "Anthropic",
    initials: "An",
    industry: "AI",
    industryFull: "AI Safety / Research",
    location: "San Francisco, CA",
    employees: "500 – 1,000",
    openJobs: 21,
    description:
      "Anthropic is an AI safety company working to build reliable, interpretable, and steerable AI systems. Creators of Claude, the AI assistant.",
    website: "https://anthropic.com",
    tags: ["AI"],
  },
  {
    id: 12,
    name: "Twilio",
    initials: "Tw",
    industry: "Developer Tools",
    industryFull: "Communications API / CPaaS",
    location: "San Francisco, CA",
    employees: "5,000 – 8,000",
    openJobs: 12,
    description:
      "Twilio powers real-time business communications. Developers use Twilio's APIs to add messaging, voice, and video capabilities to any application.",
    website: "https://twilio.com",
    tags: ["Developer Tools"],
  },
  {
    id: 13,
    name: "Plaid",
    initials: "Pl",
    industry: "Fintech",
    industryFull: "Fintech / Open Banking",
    location: "San Francisco, CA",
    employees: "1,000 – 3,000",
    openJobs: 7,
    description:
      "Plaid is the data network that powers the fintech ecosystem. It enables applications to connect with users' bank accounts across thousands of institutions.",
    website: "https://plaid.com",
    tags: ["Fintech"],
  },
  {
    id: 14,
    name: "Cloudflare",
    initials: "Cf",
    industry: "Developer Tools",
    industryFull: "Cloud Security / Edge Infrastructure",
    location: "Austin, TX",
    employees: "3,000 – 5,000",
    openJobs: 18,
    description:
      "Cloudflare's mission is to help build a better internet. It provides security, performance, and reliability services to millions of websites globally.",
    website: "https://cloudflare.com",
    tags: ["Developer Tools"],
  },
  {
    id: 15,
    name: "Rippling",
    initials: "Ri",
    industry: "SaaS",
    industryFull: "HR & IT Management / SaaS",
    location: "San Francisco, CA",
    employees: "1,000 – 3,000",
    openJobs: 32,
    description:
      "Rippling is the HR and IT platform that makes it easy to manage your employees, their apps, and their devices in one place.",
    website: "https://rippling.com",
    tags: ["SaaS"],
  },
  {
    id: 16,
    name: "Tempus",
    initials: "Te",
    industry: "Healthcare",
    industryFull: "Healthcare / AI Diagnostics",
    location: "Chicago, IL",
    employees: "1,000 – 3,000",
    openJobs: 14,
    description:
      "Tempus is a technology company advancing precision medicine through the practical application of AI and machine learning in healthcare.",
    website: "https://tempus.com",
    tags: ["Healthcare", "AI"],
  },
  {
    id: 17,
    name: "Samsara",
    initials: "Sa",
    industry: "SaaS",
    industryFull: "IoT / Fleet Management SaaS",
    location: "San Francisco, CA",
    employees: "3,000 – 5,000",
    openJobs: 24,
    description:
      "Samsara is the pioneer of the Connected Operations Cloud. It helps organizations with physical operations improve safety, efficiency, and sustainability.",
    website: "https://samsara.com",
    tags: ["SaaS"],
  },
  {
    id: 18,
    name: "Cohere",
    initials: "Co",
    industry: "AI",
    industryFull: "AI / Enterprise NLP",
    location: "Toronto, Canada",
    employees: "200 – 500",
    openJobs: 10,
    description:
      "Cohere builds NLP models for enterprises to power their AI transformation. It provides the industry's most versatile large language model platform.",
    website: "https://cohere.com",
    tags: ["AI"],
  },
];

export const INDUSTRY_TABS = [
  "All",
  "AI",
  "Fintech",
  "Developer Tools",
  "E-Commerce",
  "SaaS",
  "Healthcare",
];

export function getCompaniesByIndustry(industry) {
  if (!industry || industry === "All") return ALL_COMPANIES;
  return ALL_COMPANIES.filter((c) => c.tags.includes(industry));
}

export function searchCompanies(companies, query) {
  if (!query.trim()) return companies;
  const q = query.trim().toLowerCase();
  return companies.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.industryFull.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q),
  );
}
