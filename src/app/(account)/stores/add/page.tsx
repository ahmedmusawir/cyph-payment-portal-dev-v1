import Link from "next/link";
import { requirePortalUser } from "@/services/auth/session";
import { ownerAccess } from "@/server/billing";
import { createClient } from "@/utils/supabase/server";
import { AddStoreFlow } from "@/components/portal/account/AddStoreFlow";
import { OwnerOnlyNotice } from "@/components/portal/account/OwnerOnlyNotice";
import { PageContainer } from "@/components/portal/Loading";
import { PageHeader } from "@/components/portal/PageHeader";
import { Alert } from "@/components/portal/Alert";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Add a pharmacy — Pharmacy Books" };
export const dynamic = "force-dynamic";

// APBM-007B — owner Add Store. Manual QA 20 Nov 2026: the page itself checks owner authority on the server BEFORE the form
// renders (same predicate as the APIs). A store admin or member gets the owner-managed billing restriction; a failed
// check fails closed. Every Add Store API still enforces owner authority and operation ownership on its own.
export default async function AddStorePage() {
  await requirePortalUser();
  const access = await ownerAccess(await createClient());
  if (access === "not_owner") {
    return <OwnerOnlyNotice eyebrow="Add a pharmacy" context="Adding a pharmacy changes the subscription, so only the account owner can do it." />;
  }
  if (access === "unavailable") {
    return (
      <PageContainer width="3xl">
        <PageHeader eyebrow="Add a pharmacy" title="We couldn't check your account right now" />
        <div className="mt-5" data-testid="access-check-failed">
          <Alert tone="destructive" title="Nothing was changed">
            Your access could not be confirmed, so the form is not shown. Try again in a moment.
          </Alert>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/stores/add">Try again</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }
  return <AddStoreFlow />;
}
