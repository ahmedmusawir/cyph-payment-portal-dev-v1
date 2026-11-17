import { requirePortalUser } from "@/services/auth/session";
import { AddStoreFlow } from "@/components/portal/account/AddStoreFlow";

export const metadata = { title: "Add a pharmacy — Pharmacy Books" };
export const dynamic = "force-dynamic";

// APBM-007B — owner Add Store. Page-level guard as on the dashboard; the API enforces owner authority itself.
export default async function AddStorePage() {
  await requirePortalUser();
  return <AddStoreFlow />;
}
