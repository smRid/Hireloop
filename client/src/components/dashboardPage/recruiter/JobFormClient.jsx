"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Send, Save } from "lucide-react";

import CompanyLogo from "@/components/shared/CompanyLogo";
import DashboardPanel from "@/components/shared/DashboardPanel";
import PageHeader from "@/components/shared/PageHeader";
import StatusPill from "@/components/shared/StatusPill";
import { createJob, updateJob } from "@/lib/actions/jobs";
import { cn } from "@/lib/utils";

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

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "SGD", "INR"];

const inputClass = cn(
  "h-10 w-full rounded-lg border border-border bg-popover px-3",
  "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
  "outline-none transition-colors focus-visible:border-primary",
  "focus-visible:ring-2 focus-visible:ring-ring/30",
);

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const toMultiline = (value) => {
  if (Array.isArray(value)) return value.join("\n");
  return value ?? "";
};

const toList = (value) =>
  String(value ?? "")
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-*]\s?/, "").trim())
    .filter(Boolean);

const getId = (item) => item?._id ?? item?.id ?? "";

const emptyForm = {
  benefits: "",
  category: "",
  companyId: "",
  currency: "USD",
  deadline: "",
  description: "",
  isRemote: false,
  location: "",
  requirements: "",
  responsibilities: "",
  salaryMax: "",
  salaryMin: "",
  status: "active",
  title: "",
  type: "",
};

const formFromJob = (job = {}) => ({
  benefits: toMultiline(job.benefits),
  category: job.jobCategory ?? job.category ?? "",
  companyId: job.companyId ?? "",
  currency: job.currency ?? "USD",
  deadline: toDateInput(job.applicationDeadline),
  description: job.description ?? "",
  isRemote: Boolean(job.isRemote),
  location: job.location ?? "",
  requirements: toMultiline(job.requirements),
  responsibilities: toMultiline(job.responsibilities),
  salaryMax: job.salaryMax ? String(job.salaryMax) : "",
  salaryMin: job.salaryMin ? String(job.salaryMin) : "",
  status: job.status ?? "active",
  title: job.jobTitle ?? job.title ?? "",
  type: job.jobType ?? job.type ?? "",
});

function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-sans text-[13px] font-medium">
        {label}
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

export default function JobFormClient({
  approvedCompanies = [],
  initialJob = null,
  mode = "create",
  recruiterId,
}) {
  const router = useRouter();
  const firstCompanyId = getId(approvedCompanies[0]);
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...formFromJob(initialJob ?? {}),
    companyId: initialJob?.companyId ?? firstCompanyId,
  }));
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();
  const isEdit = mode === "edit";

  const selectedCompany = useMemo(
    () => approvedCompanies.find((company) => getId(company) === form.companyId),
    [approvedCompanies, form.companyId],
  );

  const hasApprovedCompany = approvedCompanies.length > 0;

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, submit: undefined }));
  }

  function validate(status) {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Job title is required.";
    if (!form.companyId) nextErrors.companyId = "Choose an approved company.";
    if (!form.category) nextErrors.category = "Select a category.";
    if (!form.type) nextErrors.type = "Select a job type.";
    if (!form.location.trim()) nextErrors.location = "Location is required.";
    if (!form.description.trim()) nextErrors.description = "Add a job summary.";
    if (!form.responsibilities.trim()) {
      nextErrors.responsibilities = "Add at least one responsibility.";
    }
    if (!form.requirements.trim()) {
      nextErrors.requirements = "Add at least one requirement.";
    }
    if (form.salaryMin && Number(form.salaryMin) < 0) {
      nextErrors.salaryMin = "Enter a valid salary.";
    }
    if (form.salaryMax && Number(form.salaryMax) < 0) {
      nextErrors.salaryMax = "Enter a valid salary.";
    }
    if (
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) >= Number(form.salaryMax)
    ) {
      nextErrors.salaryMax = "Maximum salary must exceed minimum salary.";
    }
    if (status === "active" && !form.deadline) {
      nextErrors.deadline = "Add an application deadline before publishing.";
    }
    return nextErrors;
  }

  function submitWithStatus(status) {
    const nextErrors = validate(status);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      applicationDeadline: form.deadline || undefined,
      benefits: toList(form.benefits),
      companyId: form.companyId,
      currency: form.currency,
      description: form.description.trim(),
      isRemote: form.isRemote,
      jobCategory: form.category,
      jobTitle: form.title.trim(),
      jobType: form.type,
      location: form.location.trim(),
      recruiterId,
      requirements: toList(form.requirements),
      responsibilities: toList(form.responsibilities),
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      status,
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateJob(getId(initialJob), payload)
        : await createJob(payload);

      if (result.error) {
        setErrors({ submit: result.error });
        return;
      }

      router.push("/dashboard/recruiter/jobs");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title={isEdit ? "Edit Job" : "Post a Job"}
        description="Publish roles from approved company profiles and manage them from your recruiter dashboard."
        actions={
          <Link
            href="/dashboard/recruiter/jobs"
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4",
              "font-sans text-[14px] font-medium text-muted-foreground",
              "transition-colors hover:bg-popover hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Link>
        }
      />

      {!hasApprovedCompany && (
        <DashboardPanel className="border-chart-2/30 bg-chart-2/5">
          <p className="font-sans text-[14px] text-muted-foreground">
            You need an approved company before posting jobs.{" "}
            <Link
              href="/dashboard/recruiter/company"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Add or edit your company profile
            </Link>
            .
          </p>
        </DashboardPanel>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitWithStatus(isEdit ? form.status : "active");
        }}
        className="mx-auto flex w-full max-w-3xl flex-col gap-6"
      >
        <DashboardPanel className="flex flex-col gap-5">
          <h2 className="font-heading text-[18px] font-semibold">Role Details</h2>
          <Field id="job-title" label="Job Title" error={errors.title}>
            <input
              id="job-title"
              value={form.title}
              onChange={(event) => setField("title", event.target.value)}
              className={inputClass}
              placeholder="Senior Product Designer"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="job-category" label="Category" error={errors.category}>
              <select
                id="job-category"
                value={form.category}
                onChange={(event) => setField("category", event.target.value)}
                className={inputClass}
              >
                <option value="">Select category</option>
                {JOB_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="job-type" label="Job Type" error={errors.type}>
              <select
                id="job-type"
                value={form.type}
                onChange={(event) => setField("type", event.target.value)}
                className={inputClass}
              >
                <option value="">Select type</option>
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field id="job-company" label="Company" error={errors.companyId}>
            <select
              id="job-company"
              value={form.companyId}
              disabled={!hasApprovedCompany}
              onChange={(event) => setField("companyId", event.target.value)}
              className={inputClass}
            >
              {!hasApprovedCompany && <option value="">No approved company</option>}
              {approvedCompanies.map((company) => (
                <option key={getId(company)} value={getId(company)}>
                  {company.name}
                </option>
              ))}
            </select>
          </Field>

          {selectedCompany && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-popover p-3">
              <CompanyLogo
                name={selectedCompany.name}
                src={selectedCompany.logoUrl}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[14px] font-medium">
                  {selectedCompany.name}
                </p>
                <p className="truncate font-sans text-[13px] text-muted-foreground">
                  {selectedCompany.industry}
                </p>
              </div>
              <StatusPill status={selectedCompany.status} />
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel className="flex flex-col gap-5">
          <h2 className="font-heading text-[18px] font-semibold">Compensation</h2>
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_120px]">
            <Field id="salary-min" label="Salary Min" error={errors.salaryMin}>
              <input
                id="salary-min"
                type="number"
                min="0"
                value={form.salaryMin}
                onChange={(event) => setField("salaryMin", event.target.value)}
                className={inputClass}
                placeholder="80000"
              />
            </Field>
            <Field id="salary-max" label="Salary Max" error={errors.salaryMax}>
              <input
                id="salary-max"
                type="number"
                min="0"
                value={form.salaryMax}
                onChange={(event) => setField("salaryMax", event.target.value)}
                className={inputClass}
                placeholder="120000"
              />
            </Field>
            <Field id="currency" label="Currency">
              <select
                id="currency"
                value={form.currency}
                onChange={(event) => setField("currency", event.target.value)}
                className={inputClass}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </DashboardPanel>

        <DashboardPanel className="flex flex-col gap-5">
          <h2 className="font-heading text-[18px] font-semibold">Location</h2>
          <Field id="job-location" label="Location" error={errors.location}>
            <input
              id="job-location"
              value={form.location}
              onChange={(event) => setField("location", event.target.value)}
              className={inputClass}
              placeholder="Remote, United States"
            />
          </Field>
          <label className="flex items-center gap-3 rounded-xl border border-border bg-popover p-3">
            <input
              type="checkbox"
              checked={form.isRemote}
              onChange={(event) => setField("isRemote", event.target.checked)}
              className="size-4 accent-primary"
            />
            <span className="font-sans text-[14px]">This role is remote friendly</span>
          </label>
          <Field id="deadline" label="Application Deadline" error={errors.deadline}>
            <input
              id="deadline"
              type="date"
              value={form.deadline}
              onChange={(event) => setField("deadline", event.target.value)}
              className={inputClass}
            />
          </Field>
        </DashboardPanel>

        <DashboardPanel className="flex flex-col gap-5">
          <h2 className="font-heading text-[18px] font-semibold">Description</h2>
          <Field id="description" label="Job Summary" error={errors.description}>
            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
              className={cn(inputClass, "h-auto resize-none py-2.5 leading-relaxed")}
              placeholder="A concise overview of the role and team."
            />
          </Field>
          <Field
            id="responsibilities"
            label="Responsibilities"
            error={errors.responsibilities}
          >
            <textarea
              id="responsibilities"
              rows={5}
              value={form.responsibilities}
              onChange={(event) => setField("responsibilities", event.target.value)}
              className={cn(inputClass, "h-auto resize-none py-2.5 leading-relaxed")}
              placeholder={"Lead product discovery\nPartner with engineering\nImprove hiring workflows"}
            />
          </Field>
          <Field id="requirements" label="Requirements" error={errors.requirements}>
            <textarea
              id="requirements"
              rows={5}
              value={form.requirements}
              onChange={(event) => setField("requirements", event.target.value)}
              className={cn(inputClass, "h-auto resize-none py-2.5 leading-relaxed")}
              placeholder={"5+ years of relevant experience\nStrong communication skills"}
            />
          </Field>
          <Field id="benefits" label="Benefits">
            <textarea
              id="benefits"
              rows={4}
              value={form.benefits}
              onChange={(event) => setField("benefits", event.target.value)}
              className={cn(inputClass, "h-auto resize-none py-2.5 leading-relaxed")}
              placeholder={"Competitive salary\nFlexible schedule\nLearning budget"}
            />
          </Field>
        </DashboardPanel>

        {isEdit && (
          <DashboardPanel className="flex flex-col gap-3">
            <Field id="status" label="Job Status">
              <select
                id="status"
                value={form.status}
                onChange={(event) => setField("status", event.target.value)}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </Field>
          </DashboardPanel>
        )}

        {errors.submit && (
          <p className="font-sans text-[13px] text-destructive" role="alert">
            {errors.submit}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          {!isEdit && (
            <button
              type="button"
              disabled={isPending || !hasApprovedCompany}
              onClick={() => submitWithStatus("draft")}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-5",
                "font-sans text-[14px] font-medium text-muted-foreground",
                "transition-colors hover:bg-popover hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              <FileText className="size-4" aria-hidden="true" />
              Save Draft
            </button>
          )}
          <button
            type="submit"
            disabled={isPending || !hasApprovedCompany}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5",
              "font-sans text-[14px] font-medium text-primary-foreground",
              "transition-colors hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {isEdit ? (
              <Save className="size-4" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
            {isPending ? "Saving..." : isEdit ? "Save Job" : "Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
