import { requireRole } from "@/lib/core/session";

export default async function RecruiterDashboardLayout({ children }) {
  await requireRole("recruiter");

  return children;
}
