import { LockKeyhole } from "lucide-react";

import AccessState from "@/components/shared/AccessState";

export const metadata = {
  title: "Forbidden",
};

export default function ForbiddenPage() {
  return (
    <AccessState
      eyebrow="Forbidden"
      title="This area is restricted"
      description="Your current role does not have permission to access this Hireloop workspace."
      primaryHref="/"
      primaryLabel="Go Home"
      secondaryHref="/jobs"
      secondaryLabel="Browse Jobs"
      icon={LockKeyhole}
    />
  );
}
