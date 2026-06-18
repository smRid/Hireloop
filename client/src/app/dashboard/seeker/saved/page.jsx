import SavedJobsClient from "@/components/dashboardPage/seeker/SavedJobsClient";
import { getSavedJobs } from "@/lib/api/saved-jobs";
import { requireRole } from "@/lib/core/session";

export default async function SavedJobsPage() {
  await requireRole("seeker");
  const response = await getSavedJobs();
  const savedJobs = Array.isArray(response.data) ? response.data : [];

  return <SavedJobsClient savedJobs={savedJobs} />;
}
