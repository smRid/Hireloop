import { requireRole } from "@/lib/core/session";

export default async function SeekerDashboardLayout({ children }) {
  await requireRole("seeker");

  return children;
}
