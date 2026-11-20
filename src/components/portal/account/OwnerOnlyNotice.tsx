import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Placeholder } from "../Alert";
import { BRAND, owedBookHandoffHref } from "../brand";
import { PageContainer } from "../Loading";
import { PageHeader } from "../PageHeader";

export function OwedBookLink({ primary }: { primary?: boolean }) {
  return (
    <Button asChild variant={primary ? "default" : "outline"}>
      <a href={owedBookHandoffHref()} data-testid="open-owedbook">
        Open {BRAND.owedBook} <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </Button>
  );
}

// The owner-managed billing restriction, shown to anyone who is not the account owner (the database decides: 0060
// owner_billing_overview). One wording for the billing screens and, since manual QA 20 Nov 2026, for /stores/add, where
// the server renders it BEFORE the form. No plan, price, card, invoice or store detail is shown.
export function OwnerOnlyNotice({ eyebrow, context }: { eyebrow: string; context?: string }) {
  return (
    <PageContainer width="3xl">
      <PageHeader eyebrow={eyebrow} title="Billing is managed by the account owner" />
      <div className="mt-5 border border-border bg-card p-4 sm:p-5" data-testid="denied-view">
        {context ? <p className="mb-2 text-sm font-medium text-foreground" data-testid="denied-context">{context}</p> : null}
        <p className="text-sm text-muted-foreground">
          You&apos;re signed in, but you aren&apos;t the billing owner of an account. Only the account owner can see or manage the plan, payment method and invoices, so none of that is shown here.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <OwedBookLink primary />
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Think you should be the billing owner? There&apos;s no self-service ownership transfer. Contact <Placeholder>{BRAND.supportEmail}</Placeholder>.
      </p>
    </PageContainer>
  );
}
