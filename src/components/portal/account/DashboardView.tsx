"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Home, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, Placeholder } from "../Alert";
import { BRAND } from "../brand";
import { DataTable } from "../DataTable";
import { EmptyState } from "../EmptyState";
import { PageContainer } from "../Loading";
import { PageHeader } from "../PageHeader";
import { Pill, type PillTone } from "../Pill";
import { STORE_PILL, SUBSCRIPTION_PILL } from "./status";
import { StoreRemovalControl } from "./StoreRemovalControl";
import { OwedBookLink, OwnerOnlyNotice } from "./OwnerOnlyNotice";
import { externalRedirect, formatDate, portalApi } from "@/services/portal";
import type { BillingOverview, BillingOverviewResponse, PaymentMethodState } from "@/types/portal/api";

type Store = BillingOverview["stores"][number];
type View =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "not_owner" }
  | { kind: "ready"; data: BillingOverviewResponse };

const words = (v: string) => v.replace(/_/g, " ");
const date = (v: string | null | undefined) => (v ? formatDate(v) : "");

function pillFor<K extends string>(map: Record<K, { tone: PillTone; label: string }>, value: string | null): { tone: PillTone; label: string } {
  if (value && value in map) return map[value as K];
  return { tone: "muted", label: value ? words(value) : "Unknown" };
}

function cardLine(pm: PaymentMethodState): string | null {
  if (pm === "not_applicable") return null;
  if (pm === "unknown") return "Couldn't check your card right now";
  if (!pm.onFile) return "No payment method on file — add one";
  if (pm.brand && pm.last4) return `${pm.brand.charAt(0).toUpperCase()}${pm.brand.slice(1)} •••• ${pm.last4}`;
  return "Card on file";
}

// C12 Your account (`/dashboard`) and Billing (`/billing`). Both read the signed-in owner's billing
// overview from the server; the database decides who the owner is. Payment method, invoices and
// cancellation all live on Stripe's Billing Portal, reached through "Manage billing" — there are no
// separate invoice or cancel pages here. Adding a pharmacy is the paid Add Store flow (/stores/add); staff are invited in OwedBook.
export function DashboardView({ page }: { page: "dashboard" | "billing" }) {
  const router = useRouter();
  const [view, setView] = useState<View>({ kind: "loading" });
  const [busy, setBusy] = useState<"portal" | "undo" | "reload" | null>(null);
  const [actionError, setActionError] = useState<{ title: string; body: string } | null>(null);
  const seq = useRef(0);

  const load = useCallback(async () => {
    const mine = ++seq.current;
    const r = await portalApi.getBillingOverview();
    if (mine !== seq.current) return;
    if (r.ok) setView({ kind: "ready", data: r.value });
    else if (r.code === "not_owner") setView({ kind: "not_owner" });
    else if (r.code === "sign_in_required") router.replace("/login?reason=session_expired");
    else setView({ kind: "error", message: r.message });
  }, [router]);

  // Also the return point from Stripe's Billing Portal: simply read the overview again.
  useEffect(() => {
    void load();
  }, [load]);

  async function reload() {
    setBusy("reload");
    await load();
    setBusy(null);
  }

  async function manageBilling() {
    setBusy("portal");
    setActionError(null);
    const r = await portalApi.openBillingPortal();
    if (r.ok) {
      externalRedirect(r.value); // Stripe Billing Portal; returns to /billing
      return;
    }
    setBusy(null);
    setActionError({ title: "We couldn't open Stripe's billing page", body: `${r.message} Nothing on your account changed.` });
  }

  async function undoCancel() {
    setBusy("undo");
    setActionError(null);
    const r = await portalApi.undoCancel();
    if (!r.ok) {
      setBusy(null);
      setActionError({ title: "We couldn't undo the cancellation", body: `${r.message} Your subscription is still set to end.` });
      return;
    }
    await load();
    setBusy(null);
  }

  const eyebrow = page === "billing" ? "Billing" : "Your account";

  if (view.kind === "loading") {
    return (
      <PageContainer width="6xl">
        <div aria-busy="true" aria-live="polite" className="space-y-4" data-testid="dashboard-loading">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-48 w-full" />
          <p className="text-sm text-muted-foreground">Loading your account…</p>
        </div>
      </PageContainer>
    );
  }

  if (view.kind === "error") {
    return (
      <PageContainer width="3xl">
        <PageHeader eyebrow={eyebrow} title="We couldn't load your account" />
        <Alert tone="destructive" className="mt-5" title="Something went wrong on our side">
          {view.message} Your subscription and pharmacies are unaffected; we just couldn&apos;t fetch the summary.
        </Alert>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button type="button" onClick={reload} disabled={busy !== null} aria-busy={busy === "reload" || undefined} data-testid="load-retry">
            {busy === "reload" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Try again
          </Button>
          <OwedBookLink />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Still stuck? Contact <Placeholder>{BRAND.supportEmail}</Placeholder>.</p>
      </PageContainer>
    );
  }

  if (view.kind === "not_owner") return <OwnerOnlyNotice eyebrow={eyebrow} />;

  const { overview, paymentMethod } = view.data;
  const sub = overview.subscription;
  const stores = overview.stores;
  const synthetic = sub?.origin === "synthetic_seed";
  const real = sub !== null && !synthetic;
  const access = overview.access;
  const cancelScheduled = real && access.cancel_scheduled === true;
  const ended = access.state === "ended";
  const card = cardLine(paymentMethod);
  const working = busy !== null;
  const canAdd = real && !ended && !access.read_only && !cancelScheduled && access.state === "active";
  const leaving = stores.filter((s) => s.removal_effective_at);

  const manageButton = (label: string, testId: string, variant: "default" | "outline" = "outline") => (
    <Button type="button" variant={variant} disabled={working} onClick={manageBilling} aria-busy={busy === "portal" || undefined} data-testid={testId}>
      {busy === "portal" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {label} <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </Button>
  );

  const storePill = (s: Store) => {
    const p = pillFor(STORE_PILL, s.status);
    return <Pill tone={p.tone}>{p.label}</Pill>;
  };
  const columns = [
    { key: "name", header: "Pharmacy", primary: true, cell: (s: Store) => <span className="break-words font-medium text-foreground">{s.name}</span> },
    { key: "npi", header: "NPI", cell: (s: Store) => <span className="tabular-nums text-foreground">{s.npi}</span> },
    { key: "status", header: "Status", cell: storePill },
    // APBM-007B: period-end removal/undo for an active Stripe subscription (never the last store; server-enforced).
    ...(real && !ended && !access.read_only ? [{ key: "actions", header: "Changes", cell: (s: Store) => (stores.length > 1 || s.removal_effective_at)
      ? <StoreRemovalControl storeId={s.id} storeName={s.name} periodEnd={sub?.current_period_end ?? null} removalEffectiveAt={s.removal_effective_at ?? null} onChanged={() => void load()} />
      : <span className="text-xs text-muted-foreground">Only store — cancel the subscription to stop</span> }] : []),
  ];

  const storesSection = (
    <section aria-labelledby="ph-h" className="mt-8" data-testid="pharmacies-section">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 id="ph-h" className="text-xl font-bold text-foreground">Pharmacies on this account</h2>
          <span className="text-sm tabular-nums text-muted-foreground" data-testid="pharmacy-count">
            {stores.length} {stores.length === 1 ? "pharmacy" : "pharmacies"}
          </span>
          {canAdd ? null : (
            <p className="text-sm text-muted-foreground" data-testid="add-store-unavailable">
              {real ? "Adding a store needs an active subscription with no overdue payment or scheduled cancellation." : "Adding a store needs a paid subscription."}
            </p>
          )}
        </div>
        {/* Manual QA 19 Nov 2026 (R1): a prominent button, full width on phones, instead of a small text link. */}
        {canAdd ? (
          <Button asChild size="lg" className="w-full sm:w-auto" data-testid="add-store-link">
            <Link href="/stores/add"><Plus className="mr-2 h-4 w-4" aria-hidden="true" />Add a pharmacy</Link>
          </Button>
        ) : null}
      </div>
      <DataTable
        columns={columns}
        rows={stores}
        getRowKey={(s) => s.id}
        tableClassName="border border-border bg-card"
        mobileLabel="Pharmacies on this account"
        empty={
          <EmptyState
            icon={Home}
            title="No pharmacies on this account yet"
            description="If you've just paid, setup may still be finishing. Check again in a minute."
            action={{ label: "Check again", onClick: () => void reload() }}
          />
        }
      />
    </section>
  );

  const subPill = cancelScheduled ? SUBSCRIPTION_PILL.cancel_scheduled : pillFor(SUBSCRIPTION_PILL, sub?.status ?? null);
  const showsPaidThrough = cancelScheduled || ended || sub?.status === "canceled";

  return (
    <PageContainer width="6xl">
      <PageHeader
        eyebrow={eyebrow}
        title={page === "billing" ? "Your subscription" : "Your account"}
        meta={
          <button type="button" className="portal-link inline-flex min-h-[44px] items-center" onClick={reload} disabled={working} aria-busy={busy === "reload" || undefined} data-testid="refresh">
            {busy === "reload" ? "Refreshing…" : "Refresh"}
          </button>
        }
      />

      <div className="mt-5 space-y-3" data-testid="dashboard-banners" aria-live="polite">
        {actionError ? (
          <Alert tone="destructive" title={actionError.title}>
            {actionError.body}
          </Alert>
        ) : null}
        {real && access.state === "grace" ? (
          <Alert tone="warning" title="We couldn't collect your last payment" action={manageButton("Update your card", "grace-update-card")}>
            {access.grace_ends_at ? `Update your card by ${date(access.grace_ends_at)} to avoid read-only access.` : "Update your card to avoid read-only access."}
          </Alert>
        ) : null}
        {real && access.state === "read_only" ? (
          <Alert tone="destructive" role="status" title="Your account is read-only until billing is fixed" action={manageButton("Fix billing", "read-only-fix")}>
            Your data is safe. Update your payment method on Stripe&apos;s billing page to restore full access.
          </Alert>
        ) : null}
        {real && ended ? (
          <Alert tone="destructive" role="status" title="Your subscription has ended. Your data is kept read-only." />
        ) : null}
        {cancelScheduled ? (
          <Alert
            tone="info"
            title={sub?.paid_through ? `Your subscription ends on ${date(sub.paid_through)}` : "Your subscription is set to end"}
            action={
              <Button type="button" variant="outline" disabled={working} onClick={undoCancel} aria-busy={busy === "undo" || undefined} data-testid="undo-cancel">
                {busy === "undo" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Undoing cancellation…</> : "Undo cancellation"}
              </Button>
            }
          >
            You keep full access until then. Changed your mind? Undo the cancellation and your subscription simply continues.
          </Alert>
        ) : null}
      </div>

      {sub === null ? (
        <section className="mt-5 border border-border bg-card p-4 sm:p-5" data-testid="no-subscription">
          <h2 className="text-xl font-bold text-foreground">No subscription yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {stores.length === 0 ? "This account doesn't have a subscription or a pharmacy yet." : "This account doesn't have a subscription on record."}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {stores.length === 0 ? (
              <Button asChild>
                <Link href="/register/plan">Start a subscription</Link>
              </Button>
            ) : null}
            <OwedBookLink />
          </div>
        </section>
      ) : synthetic ? (
        <section className="mt-5 border-2 border-dashed border-border bg-card p-4 sm:p-5" data-testid="synthetic-panel">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="info">Test account</Pill>
            <h2 className="text-xl font-bold text-foreground">Test account — no billing</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            This account was set up for testing and isn&apos;t connected to a payment provider. There is no plan to pay for, no payment method, no invoices and nothing to manage here.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <OwedBookLink />
          </div>
        </section>
      ) : (
        <section aria-labelledby="plan-h" className="mt-5 border border-border bg-card p-4 sm:p-5" data-testid="plan-summary">
          <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-10">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Plan</p>
                <span data-testid="subscription-status"><Pill tone={subPill.tone}>{subPill.label}</Pill></span>
              </div>
              <h2 id="plan-h" className="mt-1 text-xl font-bold text-foreground">
                {BRAND.owedBook} <span className="text-sm font-normal text-muted-foreground">· monthly</span>
              </h2>
              {/* Manual QA 19 Nov 2026 (R9): a scheduled removal lowers the subscription quantity at once (it is what the next
                  renewal bills) while the store keeps access until the period ends. Show both numbers, labelled. */}
              <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Pharmacies with access now</dt>
                  <dd className="text-2xl font-semibold tabular-nums text-foreground" data-testid="active-count">{stores.length}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Billed at next renewal</dt>
                  <dd className="text-2xl font-semibold tabular-nums text-foreground" data-testid="store-count">{sub.quantity ?? "—"}</dd>
                  {leaving.length > 0 ? (
                    <p className="text-xs text-muted-foreground" data-testid="leaving-note">
                      {leaving.length === 1 ? `1 pharmacy leaves on ${date(leaving[0].removal_effective_at ?? null)}` : `${leaving.length} pharmacies leave at the end of this period`}
                    </p>
                  ) : null}
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{showsPaidThrough ? "Paid through" : "Next payment"}</dt>
                  <dd className="text-2xl font-semibold tabular-nums text-foreground" data-testid="next-date">
                    {(showsPaidThrough ? date(sub.paid_through) : date(sub.current_period_end)) || "—"}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex min-w-0 flex-col gap-3 border-t border-border pt-5 lg:w-80 lg:shrink-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" data-testid="plan-actions">
              {page === "billing" ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Payment method</p>
                  {card ? <p className="break-words text-sm font-medium text-foreground" data-testid="payment-method">{card}</p> : null}
                  {manageButton("Manage billing", "manage-billing", "default")}
                  <p className="text-xs text-muted-foreground">
                    Your payment method, invoices and cancellation are all handled on Stripe&apos;s secure billing page. You return here when you&apos;re done.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Go to</p>
                  <OwedBookLink primary />
                  <Button asChild variant="outline">
                    <Link href="/billing" data-testid="go-billing">Billing</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">Payment method, invoices and cancellation are under Billing.</p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {sub !== null || stores.length > 0 ? storesSection : null}

      <p className="mt-8 text-xs text-muted-foreground">
        Only the billing owner can manage billing; to change the billing owner, contact <Placeholder>{BRAND.supportEmail}</Placeholder>.
      </p>
    </PageContainer>
  );
}
