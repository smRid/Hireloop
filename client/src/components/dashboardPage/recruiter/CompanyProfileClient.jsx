"use client";

import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import LogoUploadField from "@/components/dashboardPage/recruiter/LogoUploadField";
import CompanyLogo from "@/components/shared/CompanyLogo";
import DashboardPanel from "@/components/shared/DashboardPanel";
import PageHeader from "@/components/shared/PageHeader";
import StatusPill from "@/components/shared/StatusPill";
import { createCompany, updateCompany } from "@/lib/actions/companies";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  "AI / Machine Learning",
  "Cloud Infrastructure",
  "Customer Messaging",
  "Design Tools",
  "Developer Tools",
  "E-Commerce",
  "Fintech / Payments",
  "Healthcare",
  "Recruiting / HR Tech",
  "Security",
  "Other",
];

const emptyForm = {
  description: "",
  employeeCount: "",
  industry: "",
  location: "",
  logoUrl: "",
  name: "",
  websiteUrl: "",
};

const getId = (item) => item?._id ?? item?.id ?? "";

const asForm = (company = {}) => ({
  description: company.description ?? "",
  employeeCount: company.employeeCount ? String(company.employeeCount) : "",
  industry: company.industry ?? "",
  location: company.location ?? "",
  logoUrl: company.logoUrl ?? "",
  name: company.name ?? "",
  websiteUrl: company.websiteUrl ?? "",
});

function FormField({ id, label, error, children }) {
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

const inputClass = cn(
  "h-10 w-full rounded-lg border border-border bg-popover px-3",
  "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
  "outline-none transition-colors focus-visible:border-primary",
  "focus-visible:ring-2 focus-visible:ring-ring/30",
);

export default function CompanyProfileClient({
  initialCompanies = [],
  recruiterId,
}) {
  const router = useRouter();
  const [companies, setCompanies] = useState(initialCompanies);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const editingCompany = useMemo(
    () => companies.find((company) => getId(company) === editingId),
    [companies, editingId],
  );

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, submit: undefined }));
    setMessage("");
  }

  function beginCreate() {
    setEditingId("");
    setForm(emptyForm);
    setErrors({});
    setMessage("");
  }

  function beginEdit(company) {
    setEditingId(getId(company));
    setForm(asForm(company));
    setErrors({});
    setMessage("");
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Company name is required.";
    if (!form.industry) nextErrors.industry = "Industry is required.";
    if (!form.location.trim()) nextErrors.location = "Location is required.";
    if (!form.websiteUrl.trim()) {
      nextErrors.websiteUrl = "Website URL is required.";
    } else if (!/^https?:\/\/.+/.test(form.websiteUrl)) {
      nextErrors.websiteUrl = "Use a full URL starting with http:// or https://.";
    }
    if (!form.employeeCount || Number(form.employeeCount) < 1) {
      nextErrors.employeeCount = "Enter a team size.";
    }
    if (!form.description.trim()) {
      nextErrors.description = "Company description is required.";
    }
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      ...form,
      employeeCount: Number(form.employeeCount),
      recruiterId,
    };

    startTransition(async () => {
      const result = editingId
        ? await updateCompany(editingId, payload)
        : await createCompany(payload);

      if (result.error) {
        setErrors({ submit: result.error });
        return;
      }

      const savedCompany = result.data;
      setCompanies((current) => {
        if (!editingId) return [savedCompany, ...current];
        return current.map((company) =>
          getId(company) === editingId ? savedCompany : company,
        );
      });
      setEditingId(getId(savedCompany));
      setForm(asForm(savedCompany));
      setMessage(editingId ? "Company profile updated." : "Company submitted for review.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        title="Company Profile"
        description="Create and maintain the company profile recruiters use for job posts."
        actions={
          <button
            type="button"
            onClick={beginCreate}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4",
              "font-sans text-[14px] font-medium text-primary-foreground",
              "transition-colors hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Plus className="size-4" aria-hidden="true" />
            New Company
          </button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {companies.length === 0 ? (
            <DashboardPanel className="sm:col-span-2">
              <p className="font-sans text-[14px] text-muted-foreground">
                No company profile yet. Add your company to start posting jobs
                after approval.
              </p>
            </DashboardPanel>
          ) : (
            companies.map((company) => (
              <DashboardPanel key={getId(company)} className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <CompanyLogo
                    name={company.name}
                    src={company.logoUrl}
                    size="lg"
                  />
                  <StatusPill status={company.status} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading text-[18px] font-semibold">
                    {company.name}
                  </h2>
                  <p className="font-sans text-[13px] text-muted-foreground">
                    {company.industry}
                  </p>
                </div>
                <p className="line-clamp-3 flex-1 font-sans text-[14px] leading-relaxed text-muted-foreground">
                  {company.description}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="font-sans text-[13px] text-muted-foreground">
                    {company.location} - {company.employeeCount?.toLocaleString?.() ?? 0}+ people
                  </span>
                  <button
                    type="button"
                    onClick={() => beginEdit(company)}
                    className={cn(
                      "inline-flex h-8 items-center gap-2 rounded-lg border border-border px-3",
                      "font-sans text-[13px] font-medium text-muted-foreground",
                      "transition-colors hover:bg-popover hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Edit
                  </button>
                </div>
              </DashboardPanel>
            ))
          )}
        </div>

        <DashboardPanel className="h-fit">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-[18px] font-semibold">
                  {editingCompany ? "Edit Company" : "Add Company"}
                </h2>
                <p className="font-sans text-[13px] text-muted-foreground">
                  Profiles are reviewed before they appear publicly.
                </p>
              </div>
              {editingCompany && (
                <button
                  type="button"
                  onClick={beginCreate}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-popover"
                  aria-label="Reset form"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <FormField id="company-name" label="Company Name" error={errors.name}>
              <input
                id="company-name"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                className={inputClass}
                placeholder="Acme Inc."
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="company-industry" label="Industry" error={errors.industry}>
                <select
                  id="company-industry"
                  value={form.industry}
                  onChange={(event) => setField("industry", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                id="company-employees"
                label="Team Size"
                error={errors.employeeCount}
              >
                <input
                  id="company-employees"
                  type="number"
                  min="1"
                  value={form.employeeCount}
                  onChange={(event) => setField("employeeCount", event.target.value)}
                  className={inputClass}
                  placeholder="50"
                />
              </FormField>
            </div>

            <FormField id="company-location" label="Location" error={errors.location}>
              <input
                id="company-location"
                value={form.location}
                onChange={(event) => setField("location", event.target.value)}
                className={inputClass}
                placeholder="Remote, United States"
              />
            </FormField>

            <FormField id="company-website" label="Website" error={errors.websiteUrl}>
              <input
                id="company-website"
                type="url"
                value={form.websiteUrl}
                onChange={(event) => setField("websiteUrl", event.target.value)}
                className={inputClass}
                placeholder="https://company.com"
              />
            </FormField>

            <LogoUploadField
              key={editingId || "new-company-logo"}
              name={form.name}
              value={form.logoUrl}
              onChange={(url) => setField("logoUrl", url)}
            />

            <FormField
              id="company-description"
              label="Description"
              error={errors.description}
            >
              <textarea
                id="company-description"
                rows={5}
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                className={cn(inputClass, "h-auto resize-none py-2.5 leading-relaxed")}
                placeholder="What does your company build, and why should candidates care?"
              />
            </FormField>

            {errors.submit && (
              <p className="font-sans text-[13px] text-destructive" role="alert">
                {errors.submit}
              </p>
            )}
            {message && (
              <p className="font-sans text-[13px] text-primary" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5",
                "font-sans text-[14px] font-medium text-primary-foreground",
                "transition-colors hover:bg-primary/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              <Save className="size-4" aria-hidden="true" />
              {isPending ? "Saving..." : editingCompany ? "Save Changes" : "Submit Company"}
            </button>
          </form>
        </DashboardPanel>
      </div>
    </div>
  );
}
