import SeekerApplicationsClient from "@/components/dashboardPage/seeker/SeekerApplicationsClient";
import { getApplications } from "@/lib/api/applications";
import { requireRole } from "@/lib/core/session";

export default async function SeekerApplicationsPage() {
  await requireRole("seeker");
  const response = await getApplications();
  const applications = Array.isArray(response.data) ? response.data : [];

  return <SeekerApplicationsClient applications={applications} />;
}
