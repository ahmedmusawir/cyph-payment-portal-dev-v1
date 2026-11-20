"use client";
// APBM-007B — paid Add Store (owner). Server quote → explicit three-part consent → durable operation → payment status.
// The browser never reports a payment result: it only asks the server for the operation's state. The provider-hosted
// payment page is offered only when the server says that exact invoice still needs the owner.
//
// Manual QA 19 Nov 2026 (R2/R3): busy feedback on every action; the payment-pending state says WHY (processing, bank
// confirmation, declined, no usable card) from the server's record of its single charge attempt; Stripe's hosted page opens
// in a new tab (Stripe's hosted invoice page has no return URL) while this page keeps asking the server, with bounded
// polling; the operation survives a reload or a manual return (sessionStorage id, then the owner's server-side operation
// list); completion is shown only when the server says the store is active.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "../Alert";
import { BusyLabel } from "../BusyLabel";
import { PageContainer } from "../Loading";
import { PageHeader } from "../PageHeader";
import { owedBookHandoffHref } from "../brand";

type Quote = { quoteId: string; amountCents: number; periodEnd: string; quoteExpiresAt: string; nextRenewalCents: number; consentCopyVersion: string; storeName: string; npi: string; discountExplanation: string };
type PaymentIssue = "none" | "processing" | "authentication_required" | "declined" | "no_payment_method" | "unknown";
type Status = { operationId: string; kind?: string; state: string; errorCode: string | null; paymentDeadline: string | null; amountCents: number | null; paymentRequired: boolean;
  paymentIssue?: PaymentIssue; hostedPaymentUrl: string | null; businessId: string | null; storeName: string | null };
type Busy = "quote" | "confirm" | "abandon" | "check" | null;
const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "");
async function post<T>(url: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; message: string; fieldErrors?: Record<string, string> }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, data: json.data as T };
    return { ok: false, message: json?.message ?? "That did not work. Nothing was charged.", fieldErrors: json?.fieldErrors };
  } catch { return { ok: false, message: "We could not reach the server. Check your connection and try again." }; }
}
const newIntent = () => `add_${crypto.randomUUID().replace(/-/g, "")}`;
const noSubscribe = () => () => {};   // useSyncExternalStore: false on the server and while hydrating, true once React owns the page

export const UNRESOLVED = ["payment_setup", "payment_pending", "paid_pending_activation", "cancel_requested"];
export const OP_KEY = "apbm.addStore.operation";
const saved = {
  get: () => { try { return window.sessionStorage.getItem(OP_KEY); } catch { return null; } },
  set: (id: string) => { try { window.sessionStorage.setItem(OP_KEY, id); } catch { /* the server list still recovers it */ } },
  clear: () => { try { window.sessionStorage.removeItem(OP_KEY); } catch { /* nothing to clear */ } },
};
// Bounded polling: every 4 s for 2 minutes, then every 15 s; stop 35 minutes after polling began (past the 30-minute
// payment deadline). Returning to this tab or pressing "Check payment status" asks again at once.
export function pollDelayMs(elapsedMs: number): number | null {
  if (elapsedMs >= 35 * 60_000) return null;
  return elapsedMs < 2 * 60_000 ? 4000 : 15000;
}
const SLOW_MS = 60_000;
// Stripe's page is offered only when the owner must act; while Stripe is processing the single attempt it is not.
const needsOwner = (s: Status) => s.state === "payment_pending" && !["processing", "none"].includes(s.paymentIssue ?? "unknown");

export function AddStoreFlow() {
  const [storeName, setStoreName] = useState(""); const [npi, setNpi] = useState(""); const [ncpdp, setNcpdp] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [consent, setConsent] = useState({ terms: false, recurring: false, immediate: false });
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<{ message: string; fieldErrors?: Record<string, string> } | null>(null);
  const [busy, setBusy] = useState<Busy>(null);
  const [pollStart, setPollStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [pollStopped, setPollStopped] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const intent = useRef<string | null>(null);   // one intent per confirmation: a double click or retry resumes, never charges twice
  const autoOpened = useRef<string | null>(null);

  // F-Q4-001 (round 2 extension): details typed or filled before the page finished loading never reached this state, and
  // the next re-render wiped them. Adopt what the fields hold once React owns them (with the same digit rules as typing);
  // "See the price" stays disabled until then, so an early click cannot become a native form submission.
  const nameRef = useRef<HTMLInputElement>(null); const npiRef = useRef<HTMLInputElement>(null); const ncpdpRef = useRef<HTMLInputElement>(null);
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);
  useEffect(() => {
    if (nameRef.current?.value) setStoreName(nameRef.current.value);
    if (npiRef.current?.value) setNpi(npiRef.current.value.replace(/\D/g, "").slice(0, 10));
    if (ncpdpRef.current?.value) setNcpdp(ncpdpRef.current.value.replace(/\D/g, "").slice(0, 7));
  }, []);

  const show = useCallback((s: Status) => {
    setStatus(s);
    if (UNRESOLVED.includes(s.state)) { saved.set(s.operationId); setPollStart((p) => p ?? Date.now()); setPollStopped(false); }
  }, []);
  const refresh = useCallback(async (id: string, manual = false) => {
    if (manual) { setBusy("check"); setPollStart(Date.now()); setNow(Date.now()); setPollStopped(false); }
    const r = await post<Status>("/api/stores/add/status", { operationId: id });
    if (manual) setBusy(null);
    if (r.ok) show(r.data); else if (manual) setError(r);
  }, [show]);

  // Reload or manual return: resume this tab's operation, else the owner's newest unresolved Add Store on the server.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const id = saved.get();
      if (id) { const r = await post<Status>("/api/stores/add/status", { operationId: id }); if (cancelled) return; if (r.ok) { show(r.data); return; } saved.clear(); }
      const res = await fetch("/api/stores/operations").catch(() => null);
      const json = res && res.ok ? await res.json().catch(() => null) : null;
      const list = Array.isArray(json?.data) ? (json.data as { id: string; kind: string; state: string }[]) : [];
      const open = list.find((o) => o.kind === "store_add" && UNRESOLVED.includes(o.state));
      if (open && !cancelled) await refresh(open.id);
    })();
    return () => { cancelled = true; };
  }, [refresh, show]);

  const getQuote = async () => {
    setBusy("quote"); setError(null);
    const r = await post<Quote>("/api/stores/add/quote", { storeName, npi, ...(ncpdp ? { ncpdp } : {}) });
    setBusy(null);
    if (r.ok) { setQuote(r.data); intent.current = newIntent(); setConsent({ terms: false, recurring: false, immediate: false }); } else setError(r);
  };
  // Right after the owner's own Pay click, open Stripe's page in a new tab once. A browser may block it; the prominent
  // button is always shown and is the supported path.
  const openHostedOnce = (s: Status) => {
    if (!s.hostedPaymentUrl || !needsOwner(s) || autoOpened.current === s.operationId) return;
    autoOpened.current = s.operationId;
    const w = window.open(s.hostedPaymentUrl, "_blank");
    if (w) { try { w.opener = null; } catch { /* cross-origin: already detached */ } } else setPopupBlocked(true);
  };
  const confirm = async () => {
    if (!quote || busy) return;
    setBusy("confirm"); setError(null);
    const r = await post<Status>("/api/stores/add/confirm", { quoteId: quote.quoteId, intentKey: intent.current, consentTerms: consent.terms, consentRecurring: consent.recurring, consentImmediate: consent.immediate });
    setBusy(null);
    if (r.ok) { setNow(Date.now()); show(r.data); openHostedOnce(r.data); } else setError(r);
  };
  const abandon = async () => {
    if (!status || busy) return;
    setBusy("abandon"); setError(null);
    const r = await post<Status>("/api/stores/add/abandon", { operationId: status.operationId });
    setBusy(null);
    if (r.ok) show(r.data); else setError(r);
  };
  const startOver = () => { saved.clear(); setStatus(null); setQuote(null); setError(null); setPollStart(null); setPopupBlocked(false); intent.current = null; };

  // Ask the server again while the operation is unresolved (bounded), and at once when the owner returns to this tab.
  useEffect(() => {
    if (!status || !UNRESOLVED.includes(status.state) || pollStart === null) return;
    const delay = pollDelayMs(Date.now() - pollStart);
    if (delay === null) { const t = setTimeout(() => setPollStopped(true), 0); return () => clearTimeout(t); }
    const t = setTimeout(() => { setNow(Date.now()); void refresh(status.operationId); }, delay);
    return () => clearTimeout(t);
  }, [status, pollStart, refresh]);
  useEffect(() => {
    if (!status || !UNRESOLVED.includes(status.state)) return;
    const onBack = () => { if (document.visibilityState === "visible") void refresh(status.operationId); };
    document.addEventListener("visibilitychange", onBack); window.addEventListener("focus", onBack);
    return () => { document.removeEventListener("visibilitychange", onBack); window.removeEventListener("focus", onBack); };
  }, [status, refresh]);
  useEffect(() => { if (status && !UNRESOLVED.includes(status.state) && status.state !== "attention") saved.clear(); }, [status]);

  const allConsented = consent.terms && consent.recurring && consent.immediate;
  const slow = pollStart !== null && now - pollStart > SLOW_MS;
  const issue: PaymentIssue = status?.paymentIssue ?? "unknown";
  return (
    <PageContainer width="3xl">
      <PageHeader eyebrow="Your account" title="Add a pharmacy" />
      {error && <Alert tone="destructive" role="alert" title={status ? "That did not work" : "This store was not added"}>{error.message}</Alert>}

      {!quote && !status && (
        <form className="mt-6 space-y-4 border border-border bg-card p-4 sm:p-5" onSubmit={(e) => { e.preventDefault(); if (!busy) void getQuote(); }} data-testid="add-store-form">
          <div className="space-y-1"><Label htmlFor="sn">Pharmacy name</Label><Input ref={nameRef} id="sn" value={storeName} onChange={(e) => setStoreName(e.target.value)} required maxLength={200} aria-invalid={!!error?.fieldErrors?.storeName} />{error?.fieldErrors?.storeName && <p className="text-sm text-destructive">{error.fieldErrors.storeName}</p>}</div>
          <div className="space-y-1"><Label htmlFor="npi">NPI</Label><Input ref={npiRef} id="npi" inputMode="numeric" value={npi} onChange={(e) => setNpi(e.target.value.replace(/\D/g, "").slice(0, 10))} required aria-invalid={!!error?.fieldErrors?.npi} />{error?.fieldErrors?.npi && <p className="text-sm text-destructive">{error.fieldErrors.npi}</p>}</div>
          <div className="space-y-1"><Label htmlFor="ncpdp">NCPDP (optional)</Label><Input ref={ncpdpRef} id="ncpdp" inputMode="numeric" value={ncpdp} onChange={(e) => setNcpdp(e.target.value.replace(/\D/g, "").slice(0, 7))} /></div>
          <Button type="submit" disabled={busy !== null || !hydrated} aria-busy={busy === "quote"}><BusyLabel busy={busy === "quote"} busyText="Calculating price…">See the price</BusyLabel></Button>
        </form>
      )}

      {quote && !status && (
        <section className="mt-6 space-y-4 border border-border bg-card p-4 sm:p-5" data-testid="add-store-quote" aria-labelledby="q-h">
          <h2 id="q-h" className="text-xl font-bold text-foreground">{quote.storeName}</h2>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Charged now</dt><dd className="font-semibold tabular-nums text-foreground" data-testid="quote-amount">{usd(quote.amountCents)}</dd>
            <dt className="text-muted-foreground">Covers</dt><dd className="text-foreground">From now until {when(quote.periodEnd)}</dd>
            <dt className="text-muted-foreground">Your next renewal</dt><dd className="tabular-nums text-foreground" data-testid="quote-renewal">{usd(quote.nextRenewalCents)} per month for all your stores</dd>
            <dt className="text-muted-foreground">Price valid until</dt><dd className="text-foreground">{when(quote.quoteExpiresAt)}</dd>
          </dl>
          <p className="text-sm text-muted-foreground">{quote.discountExplanation}</p>
          <fieldset className="space-y-2 text-sm text-foreground" disabled={busy !== null}>
            <legend className="font-medium">To add this store, confirm:</legend>
            <label className="flex gap-2"><input type="checkbox" checked={consent.terms} onChange={(e) => setConsent({ ...consent, terms: e.target.checked })} /> I agree to the subscription terms for an additional store.</label>
            <label className="flex gap-2"><input type="checkbox" checked={consent.immediate} onChange={(e) => setConsent({ ...consent, immediate: e.target.checked })} /> Charge {usd(quote.amountCents)} to my card on file now.</label>
            <label className="flex gap-2"><input type="checkbox" checked={consent.recurring} onChange={(e) => setConsent({ ...consent, recurring: e.target.checked })} /> From my next renewal I will be billed {usd(quote.nextRenewalCents)} per month until I remove a store or cancel.</label>
          </fieldset>
          <p className="text-sm text-muted-foreground">If payment is not completed within 30 minutes of confirming, nothing is charged and the store is not added.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" className="h-auto whitespace-normal" disabled={busy !== null || !allConsented} aria-busy={busy === "confirm"} onClick={() => void confirm()} data-testid="add-store-confirm">
              <BusyLabel busy={busy === "confirm"} busyText="Processing payment… this can take up to a minute">Pay {usd(quote.amountCents)} and add store</BusyLabel>
            </Button>
            <Button type="button" variant="outline" disabled={busy !== null} onClick={() => { setQuote(null); setError(null); }}>Change details</Button>
          </div>
          <p className="sr-only" aria-live="polite">{busy === "confirm" ? "Processing payment. Please wait." : ""}</p>
        </section>
      )}

      {status && (
        <section className="mt-6 space-y-3 border border-border bg-card p-4 sm:p-5" data-testid="add-store-status" data-state={status.state} data-issue={status.state === "payment_pending" ? issue : undefined} aria-live="polite">
          {status.state === "activated" && (<>
            <h2 className="text-xl font-bold text-foreground" data-testid="add-store-complete">{status.storeName} has been added</h2>
            <p className="text-sm text-foreground">Payment received{status.amountCents !== null ? ` (${usd(status.amountCents)})` : ""} and confirmed by our server. The store is active, and you manage it as the account owner.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild><Link href="/billing">Back to billing</Link></Button>
              <Button asChild variant="outline"><a href={owedBookHandoffHref()}>Open OwedBook</a></Button>
              <Button type="button" variant="ghost" onClick={startOver}>Add another pharmacy</Button>
            </div>
          </>)}

          {status.state === "payment_pending" && (<>
            <h2 className="text-xl font-bold text-foreground">{PENDING_TITLE[issue]}</h2>
            <p className="text-sm text-foreground">{PENDING_TEXT[issue]} Complete payment by {when(status.paymentDeadline)}; otherwise nothing is charged and the store is not added.</p>
            {status.hostedPaymentUrl && needsOwner(status) && (<>
              <Button asChild size="lg" className="h-auto w-full whitespace-normal py-2 sm:w-auto" data-testid="hosted-pay">
                <a href={status.hostedPaymentUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">{issue === "authentication_required" ? "Confirm payment on Stripe's secure page" : "Pay on Stripe's secure page"}<ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a>
              </Button>
              {popupBlocked && <p className="text-sm text-foreground" role="status">Your browser blocked the new tab. Use the button above to open Stripe&apos;s secure page.</p>}
              <p className="text-sm text-muted-foreground">Stripe opens in a new tab. Keep this page open: after paying, come back here. This page checks with our server and shows the result; you do not need to pay again.</p>
            </>)}
          </>)}

          {["payment_setup", "paid_pending_activation", "cancel_requested"].includes(status.state) && (
            <p className="flex items-center text-sm text-foreground" role="status"><BusyLabel busy busyText={status.state === "cancel_requested" ? "Cancelling… this page updates by itself." : status.state === "paid_pending_activation" ? "Payment received. Adding the store… this page updates by itself." : "Preparing payment… this page updates by itself."}>{null}</BusyLabel></p>
          )}

          {UNRESOLVED.includes(status.state) && (<>
            {slow && !pollStopped && <p className="text-sm text-muted-foreground">This is taking longer than usual. You can leave this page; nothing is charged twice. Come back to Add a pharmacy or Billing to see the result.</p>}
            {pollStopped && <p className="text-sm text-foreground" role="status">We stopped checking automatically. Press &quot;Check payment status&quot; to ask again.</p>}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" disabled={busy !== null} aria-busy={busy === "check"} onClick={() => void refresh(status.operationId, true)} data-testid="check-status">
                <BusyLabel busy={busy === "check"} busyText="Checking…">Check payment status</BusyLabel>
              </Button>
              {status.state === "payment_pending" && (
                <Button type="button" variant="outline" disabled={busy !== null} aria-busy={busy === "abandon"} onClick={() => void abandon()}>
                  <BusyLabel busy={busy === "abandon"} busyText="Cancelling…">Cancel and don&apos;t add this store</BusyLabel>
                </Button>
              )}
            </div>
          </>)}

          {status.state === "expired_unpaid" && (<>
            <p className="text-sm text-foreground">The store was not added and nothing was charged{status.errorCode === "abandoned" ? " (you cancelled)" : " (payment was not completed in time)"}.</p>
            <div className="flex flex-col gap-3 sm:flex-row"><Button type="button" onClick={startOver}>Start again</Button><Button asChild variant="outline"><Link href="/billing">Back to billing</Link></Button></div>
          </>)}
          {status.state === "attention" && <Alert tone="warning" role="status" title="We need to check this payment">Support has been alerted. If your payment went through, nothing more will be charged and support will contact you. Reference: {status.operationId}</Alert>}
        </section>
      )}
    </PageContainer>
  );
}

const PENDING_TITLE: Record<PaymentIssue, string> = {
  none: "Payment in progress",
  processing: "Payment processing",
  authentication_required: "Your bank needs you to confirm this payment",
  declined: "Your card was declined",
  no_payment_method: "We could not charge a saved card",
  unknown: "Payment needs your action",
};
const PENDING_TEXT: Record<PaymentIssue, string> = {
  none: "We are waiting for Stripe to confirm the payment.",
  processing: "Stripe is still processing the payment. This page updates by itself.",
  authentication_required: "Your bank asked for extra confirmation (for example 3D Secure). Confirm it on Stripe's secure page.",
  declined: "The card on file was declined. You can pay with another card on Stripe's secure page.",
  no_payment_method: "No saved card could be used for this charge. You can pay with a card on Stripe's secure page.",
  unknown: "The card on file could not be charged automatically. You can complete payment on Stripe's secure page.",
};
