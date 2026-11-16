import { requirePortalUser } from "@/services/auth/session";
import { DashboardView } from "@/components/portal/account/DashboardView";

export const metadata = { title: "Your account — Pharmacy Books" };

// Signed-in landing. Page-level guard: Next renders a page in parallel with its
// layout, so the layout redirect alone would still stream this page's payload
// into the signed-out 307 body. Same predicate as the layout.
export default async function DashboardPage() {
  await requirePortalUser();
  return <DashboardView page="dashboard" />;
}
