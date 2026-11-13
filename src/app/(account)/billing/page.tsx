import { requirePortalUser } from "@/services/auth/session";
import { DashboardView } from "@/components/portal/account/DashboardView";

export const metadata = { title: "Billing — Pharmacy Books" };

// Owner billing area; the Stripe Billing Portal returns here. Any signed-in user may open the page:
// whether billing is shown is decided by the server's overview (owner-only in the database).
export default async function BillingPage() {
  await requirePortalUser();
  return <DashboardView page="billing" />;
}
