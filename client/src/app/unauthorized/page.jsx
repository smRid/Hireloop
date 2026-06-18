import { LogIn, ShieldAlert } from "lucide-react";

import AccessState from "@/components/shared/AccessState";

export const metadata = {
  title: "Unauthorized",
};

export default function UnauthorizedPage() {
  return (
    <AccessState
      eyebrow="Unauthorized"
      title="Sign in required"
      description="You need an active Hireloop account before you can view this page."
      primaryHref="/sign-in"
      primaryLabel="Sign In"
      primaryIcon={LogIn}
      secondaryHref="/"
      secondaryLabel="Back to Home"
      icon={ShieldAlert}
    />
  );
}
