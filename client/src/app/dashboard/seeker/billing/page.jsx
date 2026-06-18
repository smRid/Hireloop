import SeekerBillingClient from "@/components/dashboardPage/seeker/SeekerBillingClient";
import { getPayments } from "@/lib/api/payments";
import { getPlans } from "@/lib/api/plans";
import { getSubscriptions } from "@/lib/api/subscriptions";
import { requireRole } from "@/lib/core/session";

export default async function SeekerBillingPage() {
  const user = await requireRole("seeker");
  const [plansResponse, subscriptionsResponse, paymentsResponse] =
    await Promise.all([
      getPlans({ active: true, audience: "seeker" }),
      getSubscriptions({ userId: user.id }),
      getPayments({ userId: user.id }),
    ]);

  return (
    <SeekerBillingClient
      payments={Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []}
      plans={Array.isArray(plansResponse.data) ? plansResponse.data : []}
      subscriptions={
        Array.isArray(subscriptionsResponse.data) ? subscriptionsResponse.data : []
      }
      user={user}
    />
  );
}
