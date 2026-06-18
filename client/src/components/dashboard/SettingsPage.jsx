"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  User,
  Shield,
  Bell,
  FileText,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Plus,
  X,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════
   MOCK USER DATA
   ════════════════════════════════════════════════════════════════════ */

const MOCK_USERS = {
  seeker: {
    name: "Jordan Rivera",
    email: "jordan.rivera@example.com",
    initials: "JR",
    headline: "Frontend Engineer · Open to Work",
    bio: "Passionate frontend engineer with 5+ years building React applications. Looking for my next opportunity at a product-led team.",
    skills: ["React", "TypeScript", "Node.js", "Figma", "GraphQL"],
    resumeFile: "jordan_rivera_resume_2026.pdf",
  },
  recruiter: {
    name: "Alex Johnson",
    email: "alex@example.com",
    initials: "AJ",
  },
  admin: {
    name: "Tom Eriksson",
    email: "tom.eriksson@seekcruitr.io",
    initials: "TE",
  },
};

/* ════════════════════════════════════════════════════════════════════
   TAB CONFIG
   ════════════════════════════════════════════════════════════════════ */

const BASE_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const SEEKER_EXTRA_TABS = [
  { id: "resume", label: "Resume & Skills", icon: FileText },
];

/* ════════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

const inputCls = cn(
  "h-10 w-full rounded-lg border border-border bg-popover px-3",
  "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
  "outline-none transition-colors duration-150",
  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
);

const inputReadonlyCls = cn(
  "h-10 w-full rounded-lg border border-border bg-card px-3",
  "font-sans text-[14px] text-muted-foreground",
  "outline-none cursor-default select-none",
);

const textareaCls = cn(
  "w-full resize-none rounded-lg border border-border bg-popover px-3 py-2.5",
  "font-sans text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground",
  "outline-none transition-colors duration-150",
  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
);

/* ── Form field wrapper ── */
function Field({ id, label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-sans text-[13px] font-medium text-foreground"
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="font-sans text-[12px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/* ── Section divider ── */
function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground/60 whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

/* ── Save button ── */
function SaveButton({ loading, label = "Save Changes" }) {
  return (
    <div className="flex justify-end pt-2">
      <button
        type="submit"
        disabled={loading}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-xl px-6",
          "bg-primary text-primary-foreground",
          "font-sans text-[14px] font-medium",
          "transition-all duration-150 hover:bg-primary/90",
          "hover:shadow-[0_4px_20px_-2px_color-mix(in_oklch,var(--primary)_30%,transparent)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
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
            Saving…
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

/* ── Password input with show/hide ── */
function PasswordInput({ id, value, onChange, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(inputCls, "pr-11")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2",
          "flex size-6 items-center justify-center rounded-md",
          "text-muted-foreground transition-colors hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   AVATAR UPLOAD
   ════════════════════════════════════════════════════════════════════ */

function AvatarUpload({ initials, preview, onFileChange }) {
  const fileRef = useRef(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Circle */}
        <div
          className={cn(
            "flex size-20 items-center justify-center rounded-full",
            "border-2 border-border bg-popover",
            "font-heading text-[24px] font-bold leading-none text-primary",
            "overflow-hidden",
          )}
          aria-hidden="true"
        >
          {preview ? (
            <Image
              src={preview}
              alt="Avatar preview"
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Camera overlay button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Change profile photo"
          className={cn(
            "absolute -bottom-0.5 -right-0.5",
            "flex size-6 items-center justify-center rounded-full",
            "border-2 border-card bg-primary text-primary-foreground",
            "transition-colors hover:bg-primary/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <Camera className="size-3" aria-hidden="true" />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onFileChange}
        className="sr-only"
        aria-label="Upload profile photo"
      />

      {/* Text link */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className={cn(
          "font-sans text-[14px] font-medium text-primary",
          "transition-colors hover:text-primary/75",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
        )}
      >
        Change Photo
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PROFILE TAB
   ════════════════════════════════════════════════════════════════════ */

function ProfileTab({ user }) {
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleAvatar(e) {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <AvatarUpload
          initials={user.initials}
          preview={avatarPreview}
          onFileChange={handleAvatar}
        />
      </div>

      {/* ── Personal Info ── */}
      <SectionDivider label="Personal Info" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name */}
        <Field id="name" label="Full Name">
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your full name"
            className={inputCls}
          />
        </Field>

        {/* Email — read-only with change link */}
        <Field id="email" label="Email Address">
          <div className="flex flex-col gap-1">
            <input
              id="email"
              type="email"
              value={form.email}
              readOnly
              aria-readonly="true"
              className={inputReadonlyCls}
            />
            <button
              type="button"
              className={cn(
                "self-start font-sans text-[12px] font-medium text-primary",
                "transition-colors hover:text-primary/75",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
              )}
            >
              Change Email
            </button>
          </div>
        </Field>
      </div>

      {/* ── Password ── */}
      <SectionDivider label="Change Password" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field id="current-password" label="Current Password">
          <PasswordInput
            id="current-password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>
        <Field id="new-password" label="New Password">
          <PasswordInput
            id="new-password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>
        <Field id="confirm-password" label="Confirm New Password">
          <PasswordInput
            id="confirm-password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>
      </div>

      <SaveButton loading={saving} />
    </form>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECURITY TAB
   ════════════════════════════════════════════════════════════════════ */

/* ── Simple toggle row ── */
function ToggleRow({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={id}
          className="cursor-pointer font-sans text-[14px] font-medium text-foreground"
        >
          {label}
        </label>
        {description && (
          <p className="font-sans text-[13px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full",
          "border-2 border-transparent transition-colors duration-200",
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

function SecurityTab() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  const [saving, setSaving] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      <SectionDivider label="Two-Factor Authentication" />
      <ToggleRow
        id="two-factor"
        label="Enable Two-Factor Authentication"
        description="Require a verification code in addition to your password when signing in."
        checked={twoFactor}
        onChange={setTwoFactor}
      />

      <SectionDivider label="Session & Alerts" />
      <div className="flex flex-col gap-5">
        <ToggleRow
          id="login-alerts"
          label="Login Alerts"
          description="Receive an email whenever a new device signs into your account."
          checked={loginAlerts}
          onChange={setLoginAlerts}
        />
        <ToggleRow
          id="session-timeout"
          label="Auto Session Timeout"
          description="Automatically sign out after 30 minutes of inactivity."
          checked={sessionTimeout}
          onChange={setSessionTimeout}
        />
      </div>

      <SectionDivider label="Connected Accounts" />
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3",
        )}
      >
        <div className="flex items-center gap-3">
          {/* Google G mark */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
              fill="#EA4335"
            />
          </svg>
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-[14px] font-medium text-foreground">
              Google
            </span>
            <span className="font-sans text-[12px] text-muted-foreground">
              Connected
            </span>
          </div>
        </div>
        <button
          type="button"
          className={cn(
            "h-8 rounded-lg border border-border bg-transparent px-3",
            "font-sans text-[13px] font-medium text-muted-foreground",
            "transition-colors hover:border-chart-4/50 hover:text-chart-4",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          Disconnect
        </button>
      </div>

      <SaveButton loading={saving} />
    </form>
  );
}

/* ════════════════════════════════════════════════════════════════════
   NOTIFICATIONS TAB
   ════════════════════════════════════════════════════════════════════ */

const NOTIFICATION_GROUPS = [
  {
    section: "Job Alerts",
    items: [
      {
        id: "notif-new-jobs",
        label: "New job matches",
        description: "Notify when new jobs match your saved searches.",
        default: true,
      },
      {
        id: "notif-job-expiry",
        label: "Saved job closing soon",
        description: "Alert when a saved job is closing within 48 hours.",
        default: true,
      },
    ],
  },
  {
    section: "Applications",
    items: [
      {
        id: "notif-app-status",
        label: "Application status changes",
        description: "Notify on every status update from recruiters.",
        default: true,
      },
      {
        id: "notif-messages",
        label: "Recruiter messages",
        description: "Receive alerts when a recruiter contacts you.",
        default: true,
      },
    ],
  },
  {
    section: "Platform",
    items: [
      {
        id: "notif-newsletter",
        label: "Weekly job digest",
        description: "A weekly email with top matching jobs.",
        default: false,
      },
      {
        id: "notif-product",
        label: "Product updates",
        description: "Occasional emails about new Seekcruitr features.",
        default: false,
      },
    ],
  },
];

function NotificationsTab() {
  const [prefs, setPrefs] = useState(() => {
    const map = {};
    NOTIFICATION_GROUPS.forEach((g) =>
      g.items.forEach((item) => {
        map[item.id] = item.default;
      }),
    );
    return map;
  });

  const [saving, setSaving] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      {NOTIFICATION_GROUPS.map((group) => (
        <div key={group.section} className="flex flex-col gap-5">
          <SectionDivider label={group.section} />
          {group.items.map((item) => (
            <ToggleRow
              key={item.id}
              id={item.id}
              label={item.label}
              description={item.description}
              checked={prefs[item.id]}
              onChange={(v) => setPrefs((p) => ({ ...p, [item.id]: v }))}
            />
          ))}
        </div>
      ))}
      <SaveButton loading={saving} />
    </form>
  );
}

/* ════════════════════════════════════════════════════════════════════
   RESUME & SKILLS TAB  (Seeker only)
   ════════════════════════════════════════════════════════════════════ */

function ResumeSkillsTab({ user }) {
  const fileRef = useRef(null);
  const skillRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(user.resumeFile ?? null);
  const [skills, setSkills] = useState(user.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [headline, setHeadline] = useState(user.headline ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  /* ── Resume handlers ── */
  function handleResumeDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") setResumeFile(file.name);
  }

  function handleResumeChange(e) {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file.name);
  }

  /* ── Skill handlers ── */
  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((s) => [...s, trimmed]);
    }
    setSkillInput("");
    skillRef.current?.focus();
  }

  function handleSkillKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
    if (e.key === "Backspace" && !skillInput && skills.length) {
      setSkills((s) => s.slice(0, -1));
    }
  }

  function removeSkill(skill) {
    setSkills((s) => s.filter((sk) => sk !== skill));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      {/* ── Resume Upload ── */}
      <SectionDivider label="Resume" />

      {resumeFile ? (
        /* File present — show file row */
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3",
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-chart-4/10"
              aria-hidden="true"
            >
              <FileText className="size-4 text-chart-4" />
            </div>
            <span className="font-sans text-[14px] font-medium text-foreground truncate">
              {resumeFile}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setResumeFile(null)}
            aria-label="Remove resume"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md",
              "text-muted-foreground transition-colors",
              "hover:bg-chart-4/10 hover:text-chart-4",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload resume — drag and drop or click to browse"
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleResumeDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10",
            "cursor-pointer transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/50 hover:bg-primary/3",
          )}
        >
          <div
            className="flex size-11 items-center justify-center rounded-xl bg-popover border border-border"
            aria-hidden="true"
          >
            <Upload className="size-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="font-sans text-[14px] text-muted-foreground">
              Drag &amp; drop or{" "}
              <span className="font-medium text-primary">click to upload</span>
            </p>
            <p className="font-sans text-[12px] text-muted-foreground/60">
              PDF only · up to 10 MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        onChange={handleResumeChange}
        className="sr-only"
        aria-label="Resume file input"
      />

      {/* ── Skills ── */}
      <SectionDivider label="Skills" />

      <div className="flex flex-col gap-3">
        {/* Pills + inline input */}
        <div
          className={cn(
            "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-lg border border-border bg-popover px-3 py-2",
            "transition-colors duration-150",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30",
          )}
          onClick={() => skillRef.current?.focus()}
          aria-label="Skills — press Enter to add"
        >
          {skills.map((skill) => (
            <span
              key={skill}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border border-border bg-card pl-2.5 pr-1.5 py-0.5",
                "font-sans text-[13px] text-foreground",
              )}
            >
              {skill}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSkill(skill);
                }}
                aria-label={`Remove ${skill}`}
                className={cn(
                  "flex size-4 items-center justify-center rounded-full",
                  "text-muted-foreground transition-colors hover:bg-chart-4/10 hover:text-chart-4",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                )}
              >
                <X className="size-2.5" aria-hidden="true" />
              </button>
            </span>
          ))}

          {/* Inline text input */}
          <input
            ref={skillRef}
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKey}
            placeholder={
              skills.length === 0
                ? "Type a skill and press Enter…"
                : "Add more…"
            }
            aria-label="Add a skill"
            className={cn(
              "min-w-24 flex-1 bg-transparent",
              "font-sans text-[14px] text-foreground placeholder:text-muted-foreground",
              "outline-none border-none",
            )}
          />
        </div>

        {/* Add Skill button — shown when input has value */}
        {skillInput.trim() && (
          <button
            type="button"
            onClick={addSkill}
            className={cn(
              "self-start inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3",
              "font-sans text-[13px] font-medium text-primary",
              "transition-colors hover:bg-primary/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add &ldquo;{skillInput.trim()}&rdquo;
          </button>
        )}

        <p className="font-sans text-[12px] text-muted-foreground">
          Press{" "}
          <kbd className="rounded border border-border bg-card px-1 py-0.5 font-mono text-[11px]">
            Enter
          </kbd>{" "}
          to add ·{" "}
          <kbd className="rounded border border-border bg-card px-1 py-0.5 font-mono text-[11px]">
            Backspace
          </kbd>{" "}
          to remove last
        </p>
      </div>

      {/* ── Headline ── */}
      <SectionDivider label="Public Profile" />

      <Field id="headline" label="Headline">
        <input
          id="headline"
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. Senior Frontend Engineer · Open to Remote"
          className={inputCls}
        />
      </Field>

      {/* ── Bio ── */}
      <Field
        id="bio"
        label="Bio"
        hint="Shown on your public profile. Keep it concise and compelling."
      >
        <textarea
          id="bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell recruiters a little about yourself, your experience, and what you're looking for…"
          className={textareaCls}
        />
      </Field>

      <SaveButton loading={saving} />
    </form>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SIDEBAR TAB ITEM
   ════════════════════════════════════════════════════════════════════ */

function TabItem({ tab, active, onClick }) {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onClick(tab.id)}
      className={cn(
        "group relative flex h-9 w-full items-center gap-3 rounded-lg px-3",
        "font-sans text-[14px] transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? [
              "bg-popover font-medium text-primary",
              /* inset left border via shadow */
              "shadow-[inset_2px_0_0_0_var(--primary)]",
            ]
          : ["text-muted-foreground", "hover:bg-popover hover:text-foreground"],
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors duration-150",
          active
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
        strokeWidth={active ? 2 : 1.75}
        aria-hidden="true"
      />
      <span className="truncate">{tab.label}</span>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   EXPORTED PAGE COMPONENT
   ════════════════════════════════════════════════════════════════════ */

export default function SettingsPage({ role = "seeker" }) {
  const user = MOCK_USERS[role] ?? MOCK_USERS.seeker;
  const isSeeker = role === "seeker";

  const tabs = isSeeker ? [...BASE_TABS, ...SEEKER_EXTRA_TABS] : BASE_TABS;

  const [activeTab, setActiveTab] = useState("profile");

  function renderPanel() {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} />;
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab />;
      case "resume":
        return isSeeker ? <ResumeSkillsTab user={user} /> : null;
      default:
        return null;
    }
  }

  const activeTabLabel =
    tabs.find((t) => t.id === activeTab)?.label ?? "Settings";

  return (
    <div className="flex flex-col gap-7">
      {/* ── Page heading ── */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-bold leading-tight text-foreground">
          Settings
        </h1>
        <p className="font-sans text-[14px] text-muted-foreground">
          Manage your account preferences and profile information.
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ── Left: vertical tab nav (200px) ── */}
        <nav
          className="w-full shrink-0 lg:w-50"
          aria-label="Settings sections"
          role="tablist"
          aria-orientation="vertical"
        >
          <div
            className={cn(
              "flex flex-row gap-1 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden",
              "lg:flex-col lg:overflow-visible lg:pb-0",
              "lg:rounded-xl lg:border lg:border-border lg:bg-card lg:p-2",
            )}
          >
            {tabs.map((tab) => (
              <TabItem
                key={tab.id}
                tab={tab}
                active={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </nav>

        {/* ── Right: form panel ── */}
        <section
          aria-label={`${activeTabLabel} settings`}
          className={cn(
            "min-w-0 flex-1",
            "rounded-xl border border-border bg-card p-6 lg:p-8",
          )}
        >
          {/* Panel heading */}
          <div className="mb-7 flex flex-col gap-1 border-b border-border pb-5">
            <h2 className="font-heading text-[20px] font-semibold text-foreground">
              {activeTabLabel}
            </h2>
            <p className="font-sans text-[14px] text-muted-foreground">
              {activeTab === "profile" &&
                "Update your personal information and password."}
              {activeTab === "security" &&
                "Control your account security and connected services."}
              {activeTab === "notifications" &&
                "Choose what updates you receive and how."}
              {activeTab === "resume" &&
                "Upload your resume and showcase your skills to recruiters."}
            </p>
          </div>

          {/* Tab content */}
          {renderPanel()}
        </section>
      </div>
    </div>
  );
}
