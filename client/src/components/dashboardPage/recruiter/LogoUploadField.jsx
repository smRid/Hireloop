"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

import CompanyLogo from "@/components/shared/CompanyLogo";
import { cn } from "@/lib/utils";

export default function LogoUploadField({ label = "Company Logo", name, value, onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file) {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Logo must be 5MB or smaller.");
      return;
    }

    setError("");
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload/logo", {
        body: formData,
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Logo upload failed.");
      }

      setPreview(data.url);
      onChange(data.url);
    } catch (uploadError) {
      setError(uploadError.message ?? "Logo upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function clearLogo() {
    setPreview("");
    setError("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="font-sans text-[13px] font-medium text-foreground">
        {label}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="sr-only"
        onChange={(event) => upload(event.target.files?.[0])}
      />
      <div
        className={cn(
          "flex min-h-20 items-center gap-4 rounded-xl border border-border bg-popover p-3",
          error && "border-destructive",
        )}
      >
        <CompanyLogo name={name} src={preview} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[13px] font-medium text-foreground">
            {uploading ? "Uploading logo..." : preview ? "Logo uploaded" : "Upload a logo"}
          </p>
          <p className="font-sans text-[12px] text-muted-foreground">
            PNG, JPG, WEBP, or SVG. Maximum 5MB.
          </p>
          {error && (
            <p className="mt-1 font-sans text-[12px] text-destructive">
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex size-9 items-center justify-center rounded-lg border border-border",
              "text-muted-foreground transition-colors hover:bg-card hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            aria-label="Upload logo"
          >
            <Upload className="size-4" aria-hidden="true" />
          </button>
          {preview && (
            <button
              type="button"
              onClick={clearLogo}
              className={cn(
                "flex size-9 items-center justify-center rounded-lg border border-border",
                "text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="Remove logo"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
