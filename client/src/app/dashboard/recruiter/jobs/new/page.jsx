"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Send,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════════════ */

const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Product",
  "Data & Analytics",
  "DevOps",
  "Sales",
  "Customer Success",
  "Operations",
  "Finance",
  "Legal",
  "HR & People",
  "Other",
];

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "SGD", "INR"];

/* ── Mock approved company — null = no approved company ── */
/* Set to null to preview the warning card state */
const MOCK_COMPANY = {
  name: "NovaBridge",
  initials: "NB",
  industry: "Fintech / Payments",
  status: "APPROVED",
};

/* ── Empty form state ── */
const EMPTY_FORM = {
  title: "",
  category: "",
  type: "",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  locationCity: "",
  locationCountry: "",
  isRemote: false,
  deadline: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
};

/* ════════════════════════════════════════════════════════════════════
   DESIGN PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

/* ── Shared input class ── */
const inputCls = cn(
  "h-10 w-full rounded-lg border border-border bg-popover px-3",
  "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
  "outline-none transition-colors duration-150",
  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
);

const inputErrorCls = "border-destructive focus-visible:ring-destructive/30";

/* ── Select trigger styled to match inputCls ── */
const selectTriggerCls = cn(
  "h-10 w-full rounded-lg border border-border bg-popover px-3",
  "font-sans text-[14px] text-foreground",
  "outline-none transition-colors duration-150",
  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
  /* override shadcn defaults */
  "justify-between",
);

/* ── Section divider ── */
function SectionHeader({ label }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

/* ── Form field wrapper ── */
function Field({ id, label, error, optional, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-[13px] font-medium text-foreground"
      >
        {label}
        {optional && (
          <span className="ml-1.5 font-sans text-[12px] font-normal text-muted-foreground">
            (Optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="font-sans text-[12px] text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Custom Switch ── */
function Switch({ checked, onChange, id, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full",
          "border-2 border-transparent",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-primary" : "bg-border",
        )}
      >
        <span
          className={cn(
            "pointer-events-none block size-4 rounded-full bg-white shadow-sm",
            "transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0",
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPANY CARD (Section 3)
   ════════════════════════════════════════════════════════════════════ */

function ApprovedCompanyCard({ company }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-border bg-card p-4",
      )}
      role="status"
      aria-label={`Posting under ${company.name}`}
    >
      {/* Logo mark */}
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg",
          "border border-border bg-popover",
          "font-heading text-[14px] font-semibold leading-none text-primary",
        )}
        aria-hidden="true"
      >
        {company.initials}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-sans text-[14px] font-medium text-foreground truncate">
          {company.name}
        </span>
        <span className="font-sans text-[13px] text-muted-foreground truncate">
          {company.industry}
        </span>
      </div>

      {/* Approved badge */}
      <span
        className={cn(
          "shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5",
          "font-sans text-[10px] font-semibold uppercase tracking-widest",
          "bg-primary/10 text-primary border-primary/20",
        )}
      >
        Approved
      </span>
    </div>
  );
}

function ApprovedCompanyNote() {
  return (
    <p className="font-sans text-[14px] text-muted-foreground">
      This job will be posted under this company.
    </p>
  );
}

function NoCompanyWarning() {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-chart-2/30 bg-chart-2/5 p-4",
      )}
      role="alert"
    >
      <AlertTriangle
        className="mt-0.5 size-4.5 shrink-0 text-chart-2"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-0.5">
        <span className="font-sans text-[14px] font-medium text-chart-2">
          No approved company found
        </span>
        <span className="font-sans text-[13px] leading-relaxed text-muted-foreground">
          You need an approved company before posting.{" "}
          <a
            href="/dashboard/recruiter/company"
            className={cn(
              "font-medium text-primary underline-offset-2 hover:underline",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
            )}
          >
            Register your company first.
          </a>
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LOADING SPINNER
   ════════════════════════════════════════════════════════════════════ */

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-75"
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   VALIDATION
   ════════════════════════════════════════════════════════════════════ */

function validate(form) {
  const e = {};
  if (!form.title.trim()) e.title = "Job title is required.";
  if (!form.category) e.category = "Select a category.";
  if (!form.type) e.type = "Select a job type.";
  if (!form.salaryMin) e.salaryMin = "Enter minimum salary.";
  else if (isNaN(Number(form.salaryMin)) || Number(form.salaryMin) < 0)
    e.salaryMin = "Enter a valid amount.";
  if (!form.salaryMax) e.salaryMax = "Enter maximum salary.";
  else if (isNaN(Number(form.salaryMax)) || Number(form.salaryMax) < 0)
    e.salaryMax = "Enter a valid amount.";
  if (
    form.salaryMin &&
    form.salaryMax &&
    Number(form.salaryMin) >= Number(form.salaryMax)
  )
    e.salaryMax = "Max salary must exceed minimum.";
  if (!form.isRemote && !form.locationCity.trim())
    e.locationCity = "City is required for non-remote jobs.";
  if (!form.isRemote && !form.locationCountry.trim())
    e.locationCountry = "Country is required for non-remote jobs.";
  if (!form.deadline) e.deadline = "Application deadline is required.";
  if (!form.responsibilities.trim())
    e.responsibilities = "Responsibilities are required.";
  if (!form.requirements.trim()) e.requirements = "Requirements are required.";
  return e;
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function PostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const company = MOCK_COMPANY; /* replace with real auth/company lookup */
  const hasApprovedCompany = !!company && company.status === "APPROVED";

  /* ── Field updater ── */
  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  /* ── Clear location errors when remote toggled on ── */
  function toggleRemote(val) {
    set("isRemote", val);
    if (val) {
      setErrors((e) => ({
        ...e,
        locationCity: undefined,
        locationCountry: undefined,
      }));
    }
  }

  /* ── Save as Draft ── */
  function handleDraft() {
    setSavingDraft(true);
    setTimeout(() => {
      setSavingDraft(false);
      router.push("/dashboard/recruiter/jobs");
    }, 900);
  }

  /* ── Publish ── */
  function handleSubmit(evt) {
    evt.preventDefault();
    const e = validate(form);
    if (Object.keys(e).length) {
      setErrors(e);
      /* Scroll to first error */
      const firstErrorId = Object.keys(e)[0];
      document.getElementById(firstErrorId)?.focus();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      router.push("/dashboard/recruiter/jobs");
    }, 1200);
  }

  return (
    /* ── Page shell ── */
    <div className="flex flex-col gap-8">
      {/* ────────────────────────────────────────────────────────────
          PAGE HEADER
          ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className={cn(
            "self-start -ml-1 mb-1 flex items-center gap-1.5 rounded-md px-1 py-0.5",
            "font-sans text-[13px] text-muted-foreground",
            "transition-colors hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Jobs
        </button>
        <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
          Post a New Job
        </h1>
        <p className="font-sans text-[14px] text-muted-foreground">
          Fill in the details below to publish your listing.
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────────
          FORM — max-width 720px centered
          ──────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto w-full max-w-180"
        aria-label="Post a job form"
      >
        <div className="flex flex-col gap-10">
          {/* ══════════════════════════════════════════════════════
              SECTION 1 — Job Info
              ══════════════════════════════════════════════════════ */}
          <section aria-labelledby="section-job-info">
            <div className="flex flex-col gap-6">
              <SectionHeader label="Job Info" />

              {/* ── Job Title — full span ── */}
              <Field id="title" label="Job Title" error={errors.title}>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Senior Product Designer"
                  aria-invalid={!!errors.title}
                  className={cn(inputCls, errors.title && inputErrorCls)}
                />
              </Field>

              {/* ── Row: Category | Job Type ── */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  id="category"
                  label="Job Category"
                  error={errors.category}
                >
                  <Select
                    value={form.category}
                    onValueChange={(v) => set("category", v)}
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={!!errors.category}
                      className={cn(
                        selectTriggerCls,
                        errors.category && inputErrorCls,
                      )}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {JOB_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field id="type" label="Job Type" error={errors.type}>
                  <Select
                    value={form.type}
                    onValueChange={(v) => set("type", v)}
                  >
                    <SelectTrigger
                      id="type"
                      aria-invalid={!!errors.type}
                      className={cn(
                        selectTriggerCls,
                        errors.type && inputErrorCls,
                      )}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {JOB_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* ── Row: Salary Min | Salary Max | Currency ── */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_100px]">
                <Field
                  id="salaryMin"
                  label="Salary Min"
                  error={errors.salaryMin}
                >
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-[14px] text-muted-foreground pointer-events-none"
                      aria-hidden="true"
                    >
                      $
                    </span>
                    <input
                      id="salaryMin"
                      type="number"
                      min="0"
                      value={form.salaryMin}
                      onChange={(e) => set("salaryMin", e.target.value)}
                      placeholder="80,000"
                      aria-invalid={!!errors.salaryMin}
                      className={cn(
                        inputCls,
                        "pl-6",
                        errors.salaryMin && inputErrorCls,
                      )}
                    />
                  </div>
                </Field>

                <Field
                  id="salaryMax"
                  label="Salary Max"
                  error={errors.salaryMax}
                >
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-[14px] text-muted-foreground pointer-events-none"
                      aria-hidden="true"
                    >
                      $
                    </span>
                    <input
                      id="salaryMax"
                      type="number"
                      min="0"
                      value={form.salaryMax}
                      onChange={(e) => set("salaryMax", e.target.value)}
                      placeholder="120,000"
                      aria-invalid={!!errors.salaryMax}
                      className={cn(
                        inputCls,
                        "pl-6",
                        errors.salaryMax && inputErrorCls,
                      )}
                    />
                  </div>
                </Field>

                <Field id="currency" label="Currency">
                  <Select
                    value={form.currency}
                    onValueChange={(v) => set("currency", v)}
                  >
                    <SelectTrigger id="currency" className={selectTriggerCls}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* ── Row: Location City | Location Country ── */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  id="locationCity"
                  label="City"
                  error={errors.locationCity}
                >
                  <input
                    id="locationCity"
                    type="text"
                    value={form.locationCity}
                    onChange={(e) => set("locationCity", e.target.value)}
                    placeholder="e.g. San Francisco"
                    disabled={form.isRemote}
                    aria-invalid={!!errors.locationCity}
                    aria-disabled={form.isRemote}
                    className={cn(
                      inputCls,
                      errors.locationCity && inputErrorCls,
                      form.isRemote && "opacity-40 cursor-not-allowed",
                    )}
                  />
                </Field>

                <Field
                  id="locationCountry"
                  label="Country"
                  error={errors.locationCountry}
                >
                  <input
                    id="locationCountry"
                    type="text"
                    value={form.locationCountry}
                    onChange={(e) => set("locationCountry", e.target.value)}
                    placeholder="e.g. United States"
                    disabled={form.isRemote}
                    aria-invalid={!!errors.locationCountry}
                    aria-disabled={form.isRemote}
                    className={cn(
                      inputCls,
                      errors.locationCountry && inputErrorCls,
                      form.isRemote && "opacity-40 cursor-not-allowed",
                    )}
                  />
                </Field>
              </div>

              {/* ── Remote toggle — full row ── */}
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3",
                )}
              >
                <label
                  htmlFor="isRemote"
                  className="cursor-pointer font-sans text-[14px] text-foreground select-none"
                >
                  This is a remote position
                </label>
                <Switch
                  id="isRemote"
                  checked={form.isRemote}
                  onChange={toggleRemote}
                  label="Toggle remote position"
                />
              </div>

              {/* ── Application Deadline ── */}
              <Field
                id="deadline"
                label="Application Deadline"
                error={errors.deadline}
              >
                <div className="relative">
                  <Calendar
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set("deadline", e.target.value)}
                    aria-invalid={!!errors.deadline}
                    className={cn(
                      inputCls,
                      "pl-9 scheme-dark",
                      errors.deadline && inputErrorCls,
                    )}
                  />
                </div>
              </Field>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              SECTION 2 — Job Description
              ══════════════════════════════════════════════════════ */}
          <section aria-labelledby="section-job-desc">
            <div className="flex flex-col gap-6">
              <SectionHeader label="Job Description" />

              {/* ── Responsibilities ── */}
              <Field
                id="responsibilities"
                label="Responsibilities"
                error={errors.responsibilities}
              >
                <textarea
                  id="responsibilities"
                  rows={6}
                  value={form.responsibilities}
                  onChange={(e) => set("responsibilities", e.target.value)}
                  placeholder={`• Lead end-to-end design for key product surfaces\n• Collaborate with engineering and PM to ship features\n• Define and evolve the design system`}
                  aria-invalid={!!errors.responsibilities}
                  className={cn(
                    "w-full resize-none rounded-lg border border-border bg-popover px-3 py-2.5",
                    "font-sans text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground",
                    "outline-none transition-colors duration-150",
                    "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
                    errors.responsibilities && inputErrorCls,
                  )}
                />
              </Field>

              {/* ── Requirements ── */}
              <Field
                id="requirements"
                label="Requirements"
                error={errors.requirements}
              >
                <textarea
                  id="requirements"
                  rows={6}
                  value={form.requirements}
                  onChange={(e) => set("requirements", e.target.value)}
                  placeholder={`• 5+ years of product design experience\n• Expert Figma proficiency\n• Strong systems-thinking and interaction design portfolio`}
                  aria-invalid={!!errors.requirements}
                  className={cn(
                    "w-full resize-none rounded-lg border border-border bg-popover px-3 py-2.5",
                    "font-sans text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground",
                    "outline-none transition-colors duration-150",
                    "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
                    errors.requirements && inputErrorCls,
                  )}
                />
              </Field>

              {/* ── Benefits — optional ── */}
              <Field id="benefits" label="Benefits" optional>
                <textarea
                  id="benefits"
                  rows={4}
                  value={form.benefits}
                  onChange={(e) => set("benefits", e.target.value)}
                  placeholder={`• Competitive salary + equity\n• Remote-friendly + flexible hours\n• $2,000 annual learning budget`}
                  className={cn(
                    "w-full resize-none rounded-lg border border-border bg-popover px-3 py-2.5",
                    "font-sans text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground",
                    "outline-none transition-colors duration-150",
                    "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
                  )}
                />
              </Field>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              SECTION 3 — Company
              ══════════════════════════════════════════════════════ */}
          <section aria-labelledby="section-company">
            <div className="flex flex-col gap-4">
              <SectionHeader label="Company" />

              {hasApprovedCompany ? (
                <div className="flex flex-col gap-3">
                  <ApprovedCompanyCard company={company} />
                  <ApprovedCompanyNote />
                </div>
              ) : (
                <NoCompanyWarning />
              )}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              FORM FOOTER
              ══════════════════════════════════════════════════════ */}
          <div
            className={cn(
              "flex flex-col-reverse gap-3 border-t border-border pt-6",
              "sm:flex-row sm:items-center sm:justify-end",
            )}
          >
            {/* Save as Draft */}
            <button
              type="button"
              onClick={handleDraft}
              disabled={savingDraft || submitting}
              aria-label="Save job as draft"
              className={cn(
                "flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-transparent px-5",
                "font-sans text-[14px] font-medium text-muted-foreground",
                "transition-all duration-150",
                "hover:border-primary/40 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "sm:w-auto sm:min-w-36",
              )}
            >
              {savingDraft ? (
                <>
                  <Spinner />
                  Saving…
                </>
              ) : (
                <>
                  <FileText className="size-4" aria-hidden="true" />
                  Save as Draft
                </>
              )}
            </button>

            {/* Publish Job */}
            <button
              type="submit"
              disabled={submitting || savingDraft || !hasApprovedCompany}
              aria-label={
                !hasApprovedCompany
                  ? "Publish job — requires approved company"
                  : "Publish job listing"
              }
              className={cn(
                "flex h-10 w-full items-center justify-center gap-2 rounded-xl px-5",
                "bg-primary text-primary-foreground",
                "font-sans text-[14px] font-medium",
                "transition-all duration-150",
                "hover:bg-primary/90",
                "hover:shadow-[0_4px_20px_-2px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                "sm:w-auto sm:min-w-36",
              )}
            >
              {submitting ? (
                <>
                  <Spinner />
                  Publishing…
                </>
              ) : (
                <>
                  <Send className="size-4" aria-hidden="true" />
                  Publish Job
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
