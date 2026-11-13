"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ExternalLink, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, Placeholder } from "../Alert";
import { BRAND } from "../brand";
import { PageContainer, ViewSkeleton } from "../Loading";
import { PageHeader, RoleLabel } from "../PageHeader";
import { Stepper } from "../Stepper";
import { useRegistrationDraft } from "./useRegistrationDraft";
import { draftIsComplete, externalRedirect, formatUsd, portalApi, registrationSession, useRegistrationSession } from "@/services/portal";
import type { RegistrationDraftView } from "@/types/portal/api";

type Consents = { terms: boolean; recurring: boolean; price: boolean };
const NO_CONSENT: Consents = { terms: false, recurring: false, price: false };
type Problem = { title: string; body: string; link?: { href: string; label: string } };

const CONSENT_LINKS = [
  { id: "c1", key: "terms", label: "the terms agreement" },
  { id: "c2", key: "recurring", label: "the recurring-payment authorization" },
  { id: "c3", key: "price", label: "the price-change statement" },
] as const;

// C04 Review, code and consent. Every amount on this page comes from the server quote; the three
// consents and a current quote are required, and the server re-checks all of it before opening
// Stripe-hosted Checkout.
export function ReviewView() {
  const router = useRouter();
  const { loading, draft, error: loadError, setDraft, reload } = useRegistrationDraft();
  const session = useRegistrationSession();
  const [quoteBusy, setQuoteBusy] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [codeBusy, setCodeBusy] = useState(false);
  const [codeMsg, setCodeMsg] = useState<string | null>(null);
  const [consents, setConsents] = useState<Consents>(NO_CONSENT);
  const [consentErr, setConsentErr] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const consentRef = useRef<HTMLDivElement>(null);
  const requested = useRef<number | null>(null);
  const codeSeeded = useRef(false);

  const complete = draftIsComplete(draft);

  // A new quote is a new price: the server clears earlier consent, so the boxes start again.
  function accept(next: RegistrationDraftView) {
    setDraft(next);
    setConsents(NO_CONSENT);
    setConsentErr(0);
    setNow(Date.now());
  }

  // Deep link without a saved draft: back to the first step that needs filling.
  useEffect(() => {
    if (!loading && !loadError && !complete) router.replace("/register/owner");
  }, [loading, loadError, complete, router]);

  // Ask for a quote once per draft revision when none is current.
  useEffect(() => {
    if (!complete || !draft) return;
    if (!codeSeeded.current) {
      codeSeeded.current = true;
      setCode(draft.quote?.promotionCode ?? "");
    }
    if (draft.quote && !draft.quote.expired) return;
    if (requested.current === draft.revision) return;
    requested.current = draft.revision;
    void refresh(draft.quote?.promotionCode ?? undefined);
    // refresh is stable in behaviour; re-running on every render would re-request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, draft]);

  // Re-evaluate expiry periodically.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (consentErr) consentRef.current?.focus();
  }, [consentErr]);

  if (loading) return <PageContainer width="6xl"><ViewSkeleton /></PageContainer>;
  if (loadError) {
    return (
      <PageContainer>
        <Alert tone="destructive" title="We couldn't load your registration" action={<Button type="button" variant="outline" onClick={reload}>Try again</Button>}>
          {loadError} Nothing has been charged.
        </Alert>
      </PageContainer>
    );
  }
  if (!complete || !draft) return <PageContainer width="6xl"><ViewSkeleton /></PageContainer>;

  const quote = draft.quote;
  const expired = quote ? quote.expired || Date.parse(quote.expiresAt) <= now : false;
  const ready = Boolean(quote) && !expired && !quoteBusy && !codeBusy;
  const applied = quote?.promotionCode ?? null;
  const owner = draft.owner;
  const pharmacy = draft.pharmacy;
  const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(" ");
  const unsaved = session.hydrated && (session.owner !== null || session.pharmacy !== null);
  const allConsented = consents.terms && consents.recurring && consents.price;

  async function refresh(withCode?: string) {
    setQuoteError(null);
    setQuoteBusy(true);
    let r = await portalApi.requestQuote(withCode);
    if (!r.ok && r.code === "promotion_not_accepted" && withCode) {
      // The earlier code no longer applies: show the price without it rather than no price at all.
      setCodeMsg(`${r.message} The price shown is without it.`);
      setCode("");
      r = await portalApi.requestQuote();
    }
    setQuoteBusy(false);
    if (r.ok) accept(r.value);
    else setQuoteError(r.message);
  }

  async function apply() {
    if (!code.trim()) return;
    setCodeBusy(true);
    setCodeMsg(null);
    const r = await portalApi.requestQuote(code);
    setCodeBusy(false);
    if (r.ok) accept(r.value);
    else setCodeMsg(r.message); // one generic answer for any code that can't be applied
  }

  async function remove() {
    setCodeBusy(true);
    setCodeMsg(null);
    const r = await portalApi.requestQuote();
    setCodeBusy(false);
    if (r.ok) {
      accept(r.value);
      setCode("");
    } else setCodeMsg(r.message);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || leaving) return;
    setProblem(null);
    if (!allConsented) {
      setConsentErr((n) => n + 1);
      return;
    }
    setConsentErr(0);
    setLeaving(true);
    // One key per attempt, kept for this tab: a retry or double click resumes the same checkout.
    const r = await portalApi.startCheckout(registrationSession.operationKey(), {
      termsAccepted: consents.terms,
      recurringChargeAccepted: consents.recurring,
      priceChangeAccepted: consents.price,
    });
    if (r.ok) {
      externalRedirect(r.value); // Stripe-hosted Checkout
      return;
    }
    setLeaving(false);
    if (r.code === "expired") {
      setProblem({ title: "Your price needed refreshing", body: "The quote expired before checkout opened, so nothing was charged. Check the current price below and confirm again." });
      void refresh(applied ?? undefined);
    } else if (r.code === "invalid_input") setConsentErr((n) => n + 1);
    else if (r.code === "operation_in_progress") setProblem({ title: "A payment is already in progress", body: r.message, link: { href: "/register/activation", label: "Check its status" } });
    else if (r.code === "already_subscribed") setProblem({ title: "This account already has a subscription", body: r.message, link: { href: "/billing", label: "Open billing" } });
    else if (r.code === "npi_unavailable") setProblem({ title: "This pharmacy can't be registered right now", body: r.message, link: { href: "/register/pharmacy", label: "Check the pharmacy details" } });
    else setProblem({ title: "Checkout couldn't start", body: r.message });
  }

  const offReason = quoteBusy || codeBusy ? "Available once the quote loads." : quoteError ? "Payment is paused until the price loads." : expired ? "Refresh the quote to continue." : "Available once the quote loads.";
  const missing = (k: keyof Consents) => consentErr > 0 && !consents[k];
  const toggle = (k: keyof Consents) => (e: React.ChangeEvent<HTMLInputElement>) => setConsents({ ...consents, [k]: e.target.checked });

  return (
    <PageContainer width="6xl">
      <div className="max-w-3xl">
        <Stepper current={4} />
      </div>
      <PageHeader eyebrow="Step 4 · Review & pay" title="Review and pay" lead="Check everything, then continue to Stripe's secure checkout. Nothing is charged on this page." />

      {unsaved ? (
        <Alert tone="info" className="mt-5" title="You have changes that aren't saved yet" action={<Button asChild variant="outline"><Link href="/register/pharmacy">Finish editing</Link></Button>}>
          This page shows your saved details. Edits are saved when you complete the pharmacy step.
        </Alert>
      ) : null}
      {consentErr > 0 && !allConsented ? (
        <div ref={consentRef} tabIndex={-1} role="alert" className="mt-5 border-l-[3px] border-destructive bg-destructive/10 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-testid="consent-error">
          <p className="font-semibold text-foreground">Three confirmations are needed before payment</p>
          <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
            {CONSENT_LINKS.filter((c) => !consents[c.key]).map((c) => (
              <li key={c.id}>
                Tick{" "}
                <a href={`#${c.id}`} className="portal-link" onClick={(e) => { e.preventDefault(); document.getElementById(c.id)?.focus(); }}>
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {problem ? (
        <div className="mt-5" data-testid="checkout-problem">
          <Alert tone="destructive" title={problem.title} action={problem.link ? <Button asChild variant="outline"><Link href={problem.link.href}>{problem.link.label}</Link></Button> : undefined}>
            {problem.body}
          </Alert>
        </div>
      ) : null}

      <form noValidate onSubmit={submit} className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-5">
          <section aria-labelledby="own-h" className="border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 id="own-h" className="text-base font-semibold text-foreground">Billing owner</h2>
              <Link href="/register/owner" className="portal-link text-sm">Edit<span className="sr-only"> billing owner</span></Link>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {ownerName} <RoleLabel>Owner</RoleLabel>
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="break-all">{owner.email}</span> · <span className="whitespace-nowrap">{owner.mobile}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground" data-testid="review-owner-declaration">
              Owner declaration confirmed (your own statement; ownership isn&apos;t verified by email or payment).
            </p>
          </section>

          <section aria-labelledby="ph-h" className="border border-border bg-card p-4 sm:p-5" data-testid="review-pharmacy">
            <div className="flex items-center justify-between gap-3">
              <h2 id="ph-h" className="min-w-0 break-words text-base font-semibold text-foreground">Pharmacy · {pharmacy.name}</h2>
              <Link href="/register/pharmacy" className="portal-link shrink-0 text-sm">
                Edit<span className="sr-only"> pharmacy</span>
              </Link>
            </div>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div className="min-w-0 sm:col-span-2"><dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Address</dt><dd className="break-words text-foreground">{pharmacy.street}, {pharmacy.city}, {pharmacy.state} {pharmacy.zip}</dd></div>
              <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">NPI</dt><dd className="tabular-nums text-foreground">{pharmacy.npi}</dd></div>
              <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">NCPDP</dt><dd className="tabular-nums text-foreground">{pharmacy.ncpdp || "Not provided"}</dd></div>
              <div><dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Software</dt><dd className="break-words text-foreground">{pharmacy.software}</dd></div>
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Store admin</dt>
                <dd className="text-foreground">
                  {ownerName} <RoleLabel>Owner · Store admin</RoleLabel>
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">One pharmacy per registration. Adding stores and naming a different store admin are not available yet.</p>
          </section>

          <fieldset className="border border-border bg-card p-4 sm:p-5">
            <legend className="sr-only">Before you pay</legend>
            <p className="text-base font-semibold text-foreground" aria-hidden="true">Before you pay</p>
            <p className="text-xs text-muted-foreground">
              The three boxes are separate and start unticked.{!ready ? " They unlock once a current price is shown, because you agree to that price." : ""}
            </p>
            <div className="mt-3 space-y-3">
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-foreground">
                <input id="c1" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0" checked={consents.terms} disabled={!ready || leaving} onChange={toggle("terms")} aria-invalid={missing("terms") ? true : undefined} aria-describedby={missing("terms") ? "c1-err" : undefined} />
                <span>
                  I agree to the Terms of Service <Placeholder>[LINK TBD]</Placeholder> and Privacy Policy <Placeholder>[LINK TBD]</Placeholder>.
                </span>
              </label>
              {missing("terms") ? <ConsentError id="c1-err" /> : null}
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-foreground">
                <input id="c2" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0" checked={consents.recurring} disabled={!ready || leaving} onChange={toggle("recurring")} aria-invalid={missing("recurring") ? true : undefined} aria-describedby={missing("recurring") ? "c2-err" : undefined} />
                <span>
                  I authorize {BRAND.name} to charge my card{" "}
                  <span className="font-semibold tabular-nums" data-testid="recurring-inline">{quote && !expired ? formatUsd(quote.totalCents) : "the amount shown"}</span> today, and then the subscription price every month until I cancel. I can cancel from my billing page.
                </span>
              </label>
              {missing("recurring") ? <ConsentError id="c2-err" /> : null}
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-foreground">
                <input id="c3" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0" checked={consents.price} disabled={!ready || leaving} onChange={toggle("price")} aria-invalid={missing("price") ? true : undefined} aria-describedby={missing("price") ? "c3-err" : undefined} />
                <span>
                  I understand that my monthly price can change — for example when a discount ends or when stores are added later — and that the standard price is{" "}
                  <span className="font-semibold tabular-nums">{quote && !expired ? `${formatUsd(quote.subtotalCents)} a month` : "shown in the order summary"}</span>.
                </span>
              </label>
              {missing("price") ? <ConsentError id="c3-err" /> : null}
            </div>
          </fieldset>
        </div>

        <aside aria-labelledby="sum-h" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4 border border-border bg-card p-4 sm:p-5">
            <h2 id="sum-h" className="text-base font-semibold text-foreground">Order summary</h2>
            <div aria-live="polite" data-testid="order-summary">
              {quoteBusy ? (
                <div className="space-y-2" aria-busy="true">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <p className="sr-only">Loading your quote…</p>
                </div>
              ) : quoteError ? (
                <Alert tone="destructive" title="Price unavailable">
                  {quoteError} Payment is paused; nothing has been charged and your details are saved.{" "}
                  <button type="button" className="portal-link" onClick={() => void refresh(applied ?? undefined)}>Try again</button>
                </Alert>
              ) : quote && expired ? (
                <Alert tone="warning" title="Your quote expired" action={<Button type="button" variant="outline" onClick={() => void refresh(applied ?? undefined)}>Refresh quote</Button>}>
                  Prices are held for a limited time. Refresh to get a current quote; you&apos;ll re-confirm the amount before paying.
                </Alert>
              ) : quote ? (
                <>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{BRAND.owedBook}, 1 pharmacy</dt><dd className="tabular-nums text-foreground" data-testid="subtotal">{formatUsd(quote.subtotalCents)}</dd></div>
                    {quote.discountCents > 0 ? (
                      <div className="flex justify-between gap-3"><dt className="min-w-0 break-all text-muted-foreground">APA member code {applied}</dt><dd className="tabular-nums text-foreground" data-testid="discount">{formatUsd(-quote.discountCents)}</dd></div>
                    ) : null}
                    <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2">
                      <dt className="font-semibold text-foreground">Due today</dt>
                      <dd className="text-2xl font-semibold tabular-nums text-foreground" data-testid="due-today">{formatUsd(quote.totalCents)}</dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-xs text-muted-foreground" data-testid="recurring">
                    {quote.discountCents > 0 ? (
                      <>Billed monthly. The standard price is <span className="font-medium text-foreground">{formatUsd(quote.subtotalCents)}</span> a month; Stripe&apos;s checkout page shows how long your code&apos;s discount applies before you pay.</>
                    ) : (
                      <>Then <span className="font-medium text-foreground">{formatUsd(quote.subtotalCents)}</span> every month.</>
                    )}
                  </p>
                </>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="code" className="text-sm font-medium text-foreground">
                APA member code <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeMsg(null);
                  }}
                  disabled={Boolean(applied) || codeBusy || quoteBusy || leaving}
                  aria-invalid={codeMsg ? true : undefined}
                  aria-describedby="code-msg"
                  autoComplete="off"
                  className="flex h-11 min-w-0 flex-1 border border-input bg-background px-3 text-sm uppercase text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive disabled:opacity-60"
                />
                {applied ? (
                  <Button type="button" variant="outline" onClick={remove} disabled={codeBusy || quoteBusy || leaving}>Remove</Button>
                ) : (
                  <Button type="button" variant="outline" onClick={apply} disabled={codeBusy || !code.trim() || quoteBusy || leaving}>Apply</Button>
                )}
              </div>
              <p id="code-msg" className="text-xs" aria-live="polite">
                {codeBusy ? (
                  <span className="text-muted-foreground">Checking code…</span>
                ) : codeMsg ? (
                  <span className="font-medium text-destructive">{codeMsg}</span>
                ) : applied && quote && quote.discountCents > 0 ? (
                  <span className="text-foreground">Code applied: {formatUsd(-quote.discountCents)} on today&apos;s payment.</span>
                ) : (
                  <span className="text-muted-foreground">Applying a code refreshes the quote.</span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={!ready || leaving} aria-busy={leaving || undefined} data-testid="continue-payment">
                {leaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Opening Stripe…
                  </>
                ) : (
                  <>
                    Continue to secure payment
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
              {!ready && !leaving ? <p className="text-xs text-muted-foreground">{offReason}</p> : null}
              <p className="flex gap-2 text-xs text-muted-foreground">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>You&apos;ll finish on Stripe&apos;s secure checkout page. {BRAND.name} never sees your card number. Your sign-in link arrives by email once payment is confirmed.</span>
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/register/pharmacy">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Link>
          </Button>
        </aside>
      </form>
    </PageContainer>
  );
}

function ConsentError({ id }: { id: string }) {
  return (
    <p id={id} className="ml-8 flex items-center gap-1.5 text-xs font-medium text-destructive">
      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
      Required to continue.
    </p>
  );
}
