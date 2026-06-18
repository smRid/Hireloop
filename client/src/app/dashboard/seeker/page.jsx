import SeekerOverview from "@/components/dashboardPage/seeker/SeekerOverview";
import { getApplications } from "@/lib/api/applications";
import { getPayments } from "@/lib/api/payments";
import { getSavedJobs } from "@/lib/api/saved-jobs";
import { getSubscriptions } from "@/lib/api/subscriptions";
import { requireRole } from "@/lib/core/session";

export default async function SeekerDashboardPage() {
  const user = await requireRole("seeker");
  const [applicationsResponse, savedResponse, subscriptionsResponse, paymentsResponse] =
    await Promise.all([
      getApplications(),
      getSavedJobs(),
      getSubscriptions({ userId: user.id }),
      getPayments({ userId: user.id }),
    ]);

  return (
    <SeekerOverview
      applications={
        Array.isArray(applicationsResponse.data) ? applicationsResponse.data : []
      }
      payments={Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []}
      savedJobs={Array.isArray(savedResponse.data) ? savedResponse.data : []}
      subscriptions={
        Array.isArray(subscriptionsResponse.data) ? subscriptionsResponse.data : []
      }
      user={user}
    />
  );
}
