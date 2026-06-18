"use client";

import { useState, useRef } from "react";
import {
  MapPin,
  Users,
  Globe,
  Building2,
  Plus,
  Upload,
  X,
  Link as LinkIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useCurrentUser from "@/lib/session/client";
import { registerCompany } from "@/services/companies.service";

/* ════════════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════════════ */

const INDUSTRIES = [
  "AI / Machine Learning",
  "Cloud Infrastructure",
  "Communications / CPaaS",
  "CRM / Marketing Automation",
  "Customer Messaging",
  "Design Tools",
  "Developer Tools",
  "E-Commerce",
  "Fintech / Payments",
  "Healthcare",
  "HR & IT Management",
  "IoT",
  "Productivity / SaaS",
  "Project Management",
  "Recruiting / HR Tech",
  "Security",
  "Other",
];

const EMPLOYEE_RANGES = [
  "1 – 10",
  "11 – 50",
  "51 – 200",
  "201 – 500",
  "501 – 1,000",
  "1,001 – 5,000",
  "5,001 – 10,000",
  "10,000+",
];

/* Lower-bound numeric value for each range — matches schema's Number type */
const EMPLOYEE_RANGE_TO_NUMBER = {
  "1 – 10": 1,
  "11 – 50": 11,
  "51 – 200": 51,
  "201 – 500": 201,
  "501 – 1,000": 501,
  "1,001 – 5,000": 1001,
  "5,001 – 10,000": 5001,
  "10,000+": 10000,
};

/* ── Status badge config ─────────────────────────────────────────── */
const STATUS_CONFIG = {
  PENDING: {
    label: "PENDING",
    cls: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  APPROVED: {
    label: "APPROVED",
    cls: "bg-primary/10 text-primary border-primary/20",
  },
  REJECTED: {
    label: "REJECTED",
    cls: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  },
};

/* ── Mock registered companies — start with 3 to show State 2 ────── */
/* Set to [] to preview the empty state */
const INITIAL_COMPANIES = [
  {
    id: 1,
    name: "NovaBridge",
    initials: "NB",
    industry: "Fintech / Payments",
    location: "San Francisco, CA",
    employees: "51 – 200",
    description:
      "NovaBridge is a next-generation payment infrastructure company connecting emerging markets to global financial systems through modern APIs and developer tooling.",
    website: "https://novabridge.io",
    status: "APPROVED",
  },
  {
    id: 2,
    name: "Solvora",
    initials: "So",
    industry: "AI / Machine Learning",
    location: "Remote · Global",
    employees: "11 – 50",
    description:
      "Solvora builds enterprise-grade AI workflows that automate complex document processing, contract review, and compliance checks at scale.",
    website: "https://solvora.ai",
    status: "PENDING",
  },
  {
    id: 3,
    name: "Archform",
    initials: "Ar",
    industry: "Design Tools",
    location: "New York, NY",
    employees: "1 – 10",
    description:
      "Archform is a collaborative 3D design platform for architecture and construction teams, enabling real-time co-creation across disciplines.",
    website: "https://archform.xyz",
    status: "REJECTED",
  },
];

/* ════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

/* ── Company logo / initials ── */
function CompanyMark({ initials, size = "md" }) {
  const sizeMap = { sm: "size-9 text-[12px]", md: "size-12 text-[14px]" };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md",
        "border border-border bg-popover",
        "font-heading font-semibold leading-none text-primary",
        sizeMap[size],
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ── Status pill ── */
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5",
        "font-sans text-[10px] font-semibold uppercase tracking-widest",
        cfg.cls,
      )}
    >
      {cfg.label}
    </span>
  );
}

/* ── Shared form-field label wrapper ── */
function FormLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-sans text-[13px] font-medium text-foreground"
    >
      {children}
    </label>
  );
}

/* ── Base input styling ── */
const inputCls = cn(
  "h-10 w-full rounded-lg border border-border bg-popover px-3",
  "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
  "outline-none transition-colors duration-150",
  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
);

/* ════════════════════════════════════════════════════════════════════
   REGISTER COMPANY MODAL
   ════════════════════════════════════════════════════════════════════ */

const EMPTY_FORM = {
  name: "",
  industry: "",
  website: "",
  location: "",
  employees: "",
  description: "",
  /* logo upload state */
  logoFile: null /* raw File object — for local preview */,
  logoPreview: null /* local object URL — shown while uploading */,
  logoUrl: null /* final imgbb URL — stored on submit */,
  logoUploading: false /* upload-in-progress flag */,
  logoError: null /* per-field upload error */,
};

function RegisterCompanyModal({ open, onClose, onSubmit, recruiterId }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    /* Show local preview immediately */
    const localPreview = URL.createObjectURL(file);
    setForm((f) => ({
      ...f,
      logoFile: file,
      logoPreview: localPreview,
      logoUrl: null,
      logoUploading: true,
      logoError: null,
    }));

    /* Upload to imgbb via our API route */
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload/logo", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Upload failed.");

      setForm((f) => ({
        ...f,
        logoUrl: data.url,
        logoUploading: false,
        logoError: null,
      }));
    } catch (err) {
      setForm((f) => ({
        ...f,
        logoUploading: false,
        logoError: err.message ?? "Upload failed. Try again.",
      }));
    }
  }

  function removeLogo() {
    setForm((f) => ({
      ...f,
      logoFile: null,
      logoPreview: null,
      logoUrl: null,
      logoUploading: false,
      logoError: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Company name is required.";
    if (!form.industry) e.industry = "Select an industry.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.employees) e.employees = "Select employee range.";
    if (!form.website.trim()) {
      e.website = "Website URL is required.";
    } else if (!/^https?:\/\/.+/.test(form.website)) {
      e.website = "Enter a valid URL starting with https://";
    }
    if (!form.description.trim()) e.description = "Add a brief description.";
    if (form.logoFile && !form.logoUrl && !form.logoUploading)
      e.logo = "Logo upload failed. Remove it or try again.";
    if (form.logoUploading) e.logo = "Logo is still uploading. Please wait.";
    return e;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    /* Guard: session must be resolved before we can attach recruiterId */
    if (!recruiterId) {
      setErrors({
        submit:
          "Your session hasn't loaded yet. Please wait a moment and try again.",
      });
      return;
    }

    setLoading(true);

    /* Build the payload to exactly match Company.model.js */
    const payload = {
      name: form.name.trim(),
      industry: form.industry,
      websiteUrl: form.website.trim(),
      location: form.location.trim(),
      employeeCount: EMPLOYEE_RANGE_TO_NUMBER[form.employees] ?? 1,
      logoUrl: form.logoUrl ?? "",
      description: form.description.trim(),
      recruiterId,
    };

    try {
      const { data, error } = await registerCompany(payload);

      if (error) throw new Error(error);

      /* Pass the server-returned document back to the page */
      const companyName = data.name ?? form.name.trim();
      onSubmit({
        id: data._id,
        name: companyName,
        initials: companyName.slice(0, 2),
        industry: data.industry,
        location: data.location,
        employees: form.employees /* keep the display label */,
        description: data.description,
        website: data.websiteUrl,
        logoUrl: data.logoUrl,
        status: data.status ?? "PENDING",
      });

      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.message ?? "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(open) {
    if (!open) {
      setForm(EMPTY_FORM);
      setErrors({});
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto",
          /* Override shadcn's sm:max-w-sm default — form needs more room */
          "sm:max-w-2xl w-full",
        )}
      >
        <DialogHeader className="mb-1">
          <DialogTitle className="font-heading text-[20px] font-semibold text-foreground">
            Register New Company
          </DialogTitle>
          <DialogDescription className="font-sans text-[13px] text-muted-foreground">
            Fill in your company details. Your listing will be reviewed before
            going live.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-5">
            {/* ── Row 1: Name + Industry ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Company Name */}
              <div className="flex flex-col gap-1.5">
                <FormLabel htmlFor="co-name">Company Name</FormLabel>
                <input
                  id="co-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Acme Corp"
                  aria-invalid={!!errors.name}
                  className={cn(inputCls, errors.name && "border-destructive")}
                />
                {errors.name && (
                  <p
                    className="font-sans text-[12px] text-destructive"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div className="flex flex-col gap-1.5">
                <FormLabel htmlFor="co-industry">Industry / Category</FormLabel>
                <Select
                  value={form.industry}
                  onValueChange={(v) => set("industry", v)}
                >
                  <SelectTrigger
                    id="co-industry"
                    aria-invalid={!!errors.industry}
                    className={cn(
                      "h-10 w-full rounded-lg border border-border bg-popover px-3",
                      "font-sans text-[14px] text-foreground",
                      "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
                      errors.industry && "border-destructive",
                    )}
                  >
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p
                    className="font-sans text-[12px] text-destructive"
                    role="alert"
                  >
                    {errors.industry}
                  </p>
                )}
              </div>
            </div>

            {/* ── Row 2: Website + Location ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Website */}
              <div className="flex flex-col gap-1.5">
                <FormLabel htmlFor="co-website">Website URL</FormLabel>
                <div className="flex h-10 overflow-hidden rounded-lg border border-border bg-popover focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30 transition-colors">
                  {/* Prefix addon */}
                  <span className="flex items-center border-r border-border bg-muted px-3">
                    <LinkIcon
                      className="size-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </span>
                  <input
                    id="co-website"
                    type="url"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="https://yourcompany.com"
                    aria-invalid={!!errors.website}
                    className={cn(
                      "flex-1 bg-transparent px-3",
                      "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
                      "outline-none border-none h-full",
                    )}
                  />
                </div>
                {errors.website && (
                  <p
                    className="font-sans text-[12px] text-destructive"
                    role="alert"
                  >
                    {errors.website}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <FormLabel htmlFor="co-location">Location</FormLabel>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="co-location"
                    type="text"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="City, Country or Remote"
                    aria-invalid={!!errors.location}
                    className={cn(
                      inputCls,
                      "pl-9",
                      errors.location && "border-destructive",
                    )}
                  />
                </div>
                {errors.location && (
                  <p
                    className="font-sans text-[12px] text-destructive"
                    role="alert"
                  >
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            {/* ── Row 3: Employees + Logo upload ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Employee Count */}
              <div className="flex flex-col gap-1.5">
                <FormLabel htmlFor="co-employees">Employee Count</FormLabel>
                <Select
                  value={form.employees}
                  onValueChange={(v) => set("employees", v)}
                >
                  <SelectTrigger
                    id="co-employees"
                    aria-invalid={!!errors.employees}
                    className={cn(
                      "h-10 w-full rounded-lg border border-border bg-popover px-3",
                      "font-sans text-[14px] text-foreground",
                      "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
                      errors.employees && "border-destructive",
                    )}
                  >
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      {EMPLOYEE_RANGES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r} employees
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.employees && (
                  <p
                    className="font-sans text-[12px] text-destructive"
                    role="alert"
                  >
                    {errors.employees}
                  </p>
                )}
              </div>

              {/* Logo upload */}
              <div className="flex flex-col gap-1.5">
                <FormLabel htmlFor="co-logo">Company Logo</FormLabel>
                <input
                  ref={fileInputRef}
                  id="co-logo"
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Upload company logo"
                />
                {form.logoPreview ? (
                  /* Preview with upload status */
                  <div
                    className={cn(
                      "relative flex h-18 items-center gap-3 rounded-lg border bg-popover px-4",
                      form.logoError ? "border-destructive" : "border-border",
                    )}
                  >
                    {/* Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.logoPreview}
                      alt="Logo preview"
                      className="size-10 rounded-md object-contain"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="font-sans text-[13px] font-medium text-foreground truncate max-w-35">
                        {form.logoFile?.name}
                      </span>

                      {/* Status line */}
                      {form.logoUploading ? (
                        <span className="flex items-center gap-1.5 font-sans text-[12px] text-muted-foreground">
                          <svg
                            className="size-3 animate-spin text-primary"
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
                          Uploading…
                        </span>
                      ) : form.logoError ? (
                        <span className="font-sans text-[12px] text-destructive">
                          {form.logoError}
                        </span>
                      ) : form.logoUrl ? (
                        <span className="font-sans text-[12px] text-chart-3">
                          Uploaded successfully
                        </span>
                      ) : (
                        <span className="font-sans text-[12px] text-muted-foreground">
                          {form.logoFile
                            ? `${(form.logoFile.size / 1024).toFixed(0)} KB`
                            : ""}
                        </span>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={removeLogo}
                      aria-label="Remove logo"
                      className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2",
                        "flex size-6 items-center justify-center rounded-md",
                        "text-muted-foreground transition-colors hover:text-destructive",
                      )}
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  /* Drop zone */
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex h-18 w-full flex-col items-center justify-center gap-1",
                      "rounded-lg border border-dashed border-border bg-popover",
                      "transition-colors duration-150",
                      "hover:border-primary/60 hover:bg-primary/5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                    aria-label="Upload company logo — click to browse"
                  >
                    <Upload
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="font-sans text-[12px] text-muted-foreground">
                      PNG, SVG · up to 5MB
                    </span>
                  </button>
                )}
                {errors.logo && (
                  <p
                    className="font-sans text-[12px] text-destructive"
                    role="alert"
                  >
                    {errors.logo}
                  </p>
                )}
              </div>
            </div>

            {/* ── Full-width: Description ── */}
            <div className="flex flex-col gap-1.5">
              <FormLabel htmlFor="co-description">Brief Description</FormLabel>
              <textarea
                id="co-description"
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe what your company does, its mission, and what makes it unique…"
                aria-invalid={!!errors.description}
                className={cn(
                  "w-full resize-none rounded-lg border border-border bg-popover px-3 py-2.5",
                  "font-sans text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground",
                  "outline-none transition-colors duration-150",
                  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
                  errors.description && "border-destructive",
                )}
              />
              {errors.description && (
                <p
                  className="font-sans text-[12px] text-destructive"
                  role="alert"
                >
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <DialogFooter className="mt-6">
            {/* Submit-level error */}
            {errors.submit && (
              <p
                className="w-full font-sans text-[12px] text-destructive sm:text-left"
                role="alert"
              >
                {errors.submit}
              </p>
            )}
            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "h-9 rounded-lg border border-border bg-transparent px-5",
                "font-sans text-[14px] font-medium text-muted-foreground",
                "transition-colors duration-150 hover:border-primary/40 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Cancel
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-lg px-5",
                "bg-primary text-primary-foreground",
                "font-sans text-[14px] font-medium",
                "transition-all duration-150 hover:bg-primary/90",
                "hover:shadow-[0_4px_16px_-2px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
              )}
            >
              {loading ? (
                <>
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
                  Registering…
                </>
              ) : (
                "Register Company"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ════════════════════════════════════════════════════════════════════ */

function EmptyState({ onRegister }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      {/* SVG illustration — building outline */}
      <div
        className={cn(
          "mb-6 flex size-24 items-center justify-center rounded-2xl",
          "border border-border bg-popover",
        )}
        aria-hidden="true"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground/40"
        >
          {/* Building outline */}
          <rect x="8" y="12" width="32" height="30" rx="2" />
          <polyline points="8,12 24,4 40,12" />
          {/* Windows */}
          <rect x="14" y="18" width="6" height="6" rx="0.5" />
          <rect x="28" y="18" width="6" height="6" rx="0.5" />
          <rect x="14" y="28" width="6" height="6" rx="0.5" />
          <rect x="28" y="28" width="6" height="6" rx="0.5" />
          {/* Door */}
          <rect x="20" y="34" width="8" height="8" rx="0.5" />
        </svg>
      </div>

      <h2 className="font-heading text-[20px] font-semibold text-foreground">
        No company registered yet
      </h2>
      <p className="mt-2 max-w-xs font-sans text-[14px] leading-relaxed text-muted-foreground">
        Register your company to start posting jobs and finding top candidates.
      </p>

      <button
        type="button"
        onClick={onRegister}
        className={cn(
          "mt-6 inline-flex h-10 items-center gap-2 rounded-xl px-6",
          "bg-primary text-primary-foreground",
          "font-sans text-[14px] font-medium",
          "transition-all duration-150 hover:bg-primary/90",
          "hover:shadow-[0_4px_20px_-2px_color-mix(in_oklch,var(--primary)_35%,transparent)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <Plus className="size-4" aria-hidden="true" />
        Register a Company
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   COMPANY CARD
   ════════════════════════════════════════════════════════════════════ */

function CompanyCard({ company }) {
  return (
    <article
      className={cn(
        "relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6",
        "transition-all duration-200 ease-out",
        "hover:border-primary",
        "hover:shadow-[0_8px_32px_-4px_color-mix(in_oklch,var(--primary)_14%,transparent)]",
      )}
      aria-label={`${company.name} — ${company.status}`}
    >
      {/* ── Top row: logo + status badge ── */}
      <div className="flex items-start justify-between gap-3">
        <CompanyMark initials={company.initials} size="md" />
        <StatusBadge status={company.status} />
      </div>

      {/* ── Name + industry ── */}
      <div className="flex flex-col gap-0.5">
        <h2 className="font-heading text-[18px] font-semibold leading-snug text-foreground">
          {company.name}
        </h2>
        <p className="font-sans text-[14px] text-muted-foreground">
          {company.industry}
        </p>
      </div>

      {/* ── Description: 3-line clamp ── */}
      <p className="flex-1 font-sans text-[14px] leading-relaxed text-muted-foreground line-clamp-3">
        {company.description}
      </p>

      {/* ── Bottom metadata row ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Location */}
          <span className="inline-flex items-center gap-1.5 font-sans text-[13px] text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {company.location}
          </span>
          {/* Employees */}
          <span className="inline-flex items-center gap-1.5 font-sans text-[13px] text-muted-foreground">
            <Users className="size-3.5 shrink-0" aria-hidden="true" />
            {company.employees}
          </span>
        </div>

        {/* Visit website */}
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1 font-sans text-[13px] font-medium text-primary",
            "transition-colors duration-150 hover:text-primary/75",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
          )}
          aria-label={`Visit ${company.name} website`}
        >
          <Globe className="size-3.5 shrink-0" aria-hidden="true" />
          Visit Website
        </a>
      </div>
    </article>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function MyCompanyPage() {
  const { user } = useCurrentUser();
  const recruiterId = user?.id ?? null;
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [modalOpen, setModalOpen] = useState(false);

  const hasCompanies = companies.length > 0;

  function handleRegister(company) {
    setCompanies((prev) => [...prev, company]);
    setModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Conditional render: header only when companies exist ── */}
      {hasCompanies && (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          {/* Left — heading + subtext */}
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
              My Companies
            </h1>
            <p className="font-sans text-[14px] leading-relaxed text-muted-foreground max-w-md">
              Manage your registered companies and their verification states.
            </p>
          </div>

          {/* Right — register button */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={cn(
              "inline-flex shrink-0 h-10 items-center gap-2 rounded-xl px-5",
              "bg-primary text-primary-foreground",
              "font-sans text-[14px] font-medium",
              "transition-all duration-150 hover:bg-primary/90",
              "hover:shadow-[0_4px_20px_-2px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Plus className="size-4" aria-hidden="true" />
            Register a Company
          </button>
        </div>
      )}

      {/* ── Content: empty state OR card grid ── */}
      {hasCompanies ? (
        <div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Registered companies"
        >
          {companies.map((company) => (
            <div key={company.id} role="listitem">
              <CompanyCard company={company} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState onRegister={() => setModalOpen(true)} />
      )}

      {/* ── Register Company Modal ── */}
      <RegisterCompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRegister}
        recruiterId={recruiterId}
      />
    </div>
  );
}
