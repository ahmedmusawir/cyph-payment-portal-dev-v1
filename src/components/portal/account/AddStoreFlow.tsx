"use client";
// APBM-007B — paid Add Store (owner). Server quote → explicit three-part consent → durable operation → payment status.
// The browser never reports a payment result: it only asks the server for the operation's state. The provider-hosted
// payment page is offered only when the server says that exact invoice needs the owner (e.g. bank authentication).
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "../Alert";
import { PageContainer } from "../Loading";
import { PageHeader } from "../PageHeader";

type Quote = { quoteId: string; amountCents: number; periodEnd: string; quoteExpiresAt: string; nextRenewalCents: number; consentCopyVersion: string; storeName: string; npi: string; discountExplanation: string };
type Status = { operationId: string; state: string; errorCode: string | null; paymentDeadline: string | null; amountCents: number | null; paymentRequired: boolean; hostedPaymentUrl: string | null; businessId: string | null; storeName: string | null };
const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "");
async function post<T>(url: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; message: string; fieldErrors?: Record<string, string> }> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  if (res.ok) return { ok: true, data: json.data as T };
  return { ok: false, message: json?.message ?? "That did not work. Nothing was charged.", fieldErrors: json?.fieldErrors };
}
const newIntent = () => `add_${crypto.randomUUID().replace(/-/g, "")}`;
const noSubscribe = () => () => {};   // useSyncExternalStore: false on the server and while hydrating, true once React owns the page

export function AddStoreFlow() {
  const [storeName, setStoreName] = useState(""); const [npi, setNpi] = useState(""); const [ncpdp, setNcpdp] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [consent, setConsent] = useState({ terms: false, recurring: false, immediate: false });
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<{ message: string; fieldErrors?: Record<string, string> } | null>(null);
  const [busy, setBusy] = useState(false);
  const intent = useRef<string | null>(null);   // one intent per confirmation: a double click or retry resumes, never charges twice

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

  const getQuote = async () => {
    setBusy(true); setError(null);
    const r = await post<Quote>("/api/stores/add/quote", { storeName, npi, ...(ncpdp ? { ncpdp } : {}) });
    setBusy(false);
    if (r.ok) { setQuote(r.data); intent.current = newIntent(); setConsent({ terms: false, recurring: false, immediate: false }); } else setError(r);
  };
  const confirm = async () => {
    if (!quote) return;
    setBusy(true); setError(null);
    const r = await post<Status>("/api/stores/add/confirm", { quoteId: quote.quoteId, intentKey: intent.current, consentTerms: consent.terms, consentRecurring: consent.recurring, consentImmediate: consent.immediate });
    setBusy(false);
    if (r.ok) setStatus(r.data); else setError(r);
  };
  const refresh = async (id: string) => { const r = await post<Status>("/api/stores/add/status", { operationId: id }); if (r.ok) setStatus(r.data); };
  const abandon = async () => { if (!status) return; setBusy(true); const r = await post<Status>("/api/stores/add/abandon", { operationId: status.operationId }); setBusy(false); if (r.ok) setStatus(r.data); else setError(r); };

  // While payment is pending, ask the server again every few seconds (returning from the hosted page also lands here).
  useEffect(() => {
    if (!status || !["payment_setup", "payment_pending", "paid_pending_activation", "cancel_requested"].includes(status.state)) return;
    const t = setTimeout(() => void refresh(status.operationId), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const allConsented = consent.terms && consent.recurring && consent.immediate;
  return (
    <PageContainer width="3xl">
      <PageHeader eyebrow="Your account" title="Add a pharmacy" />
      {error && <Alert tone="destructive" role="alert" title="This store was not added">{error.message}</Alert>}

      {!quote && !status && (
        <form className="mt-6 space-y-4 border border-border bg-card p-4 sm:p-5" onSubmit={(e) => { e.preventDefault(); void getQuote(); }} data-testid="add-store-form">
          <div className="space-y-1"><Label htmlFor="sn">Pharmacy name</Label><Input ref={nameRef} id="sn" value={storeName} onChange={(e) => setStoreName(e.target.value)} required maxLength={200} aria-invalid={!!error?.fieldErrors?.storeName} />{error?.fieldErrors?.storeName && <p className="text-sm text-destructive">{error.fieldErrors.storeName}</p>}</div>
          <div className="space-y-1"><Label htmlFor="npi">NPI</Label><Input ref={npiRef} id="npi" inputMode="numeric" value={npi} onChange={(e) => setNpi(e.target.value.replace(/\D/g, "").slice(0, 10))} required aria-invalid={!!error?.fieldErrors?.npi} />{error?.fieldErrors?.npi && <p className="text-sm text-destructive">{error.fieldErrors.npi}</p>}</div>
          <div className="space-y-1"><Label htmlFor="ncpdp">NCPDP (optional)</Label><Input ref={ncpdpRef} id="ncpdp" inputMode="numeric" value={ncpdp} onChange={(e) => setNcpdp(e.target.value.replace(/\D/g, "").slice(0, 7))} /></div>
          <Button type="submit" disabled={busy || !hydrated}>See the price</Button>
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
          <fieldset className="space-y-2 text-sm text-foreground">
            <legend className="font-medium">To add this store, confirm:</legend>
            <label className="flex gap-2"><input type="checkbox" checked={consent.terms} onChange={(e) => setConsent({ ...consent, terms: e.target.checked })} /> I agree to the subscription terms for an additional store.</label>
            <label className="flex gap-2"><input type="checkbox" checked={consent.immediate} onChange={(e) => setConsent({ ...consent, immediate: e.target.checked })} /> Charge {usd(quote.amountCents)} to my card on file now.</label>
            <label className="flex gap-2"><input type="checkbox" checked={consent.recurring} onChange={(e) => setConsent({ ...consent, recurring: e.target.checked })} /> From my next renewal I will be billed {usd(quote.nextRenewalCents)} per month until I remove a store or cancel.</label>
          </fieldset>
          <p className="text-sm text-muted-foreground">If payment is not completed within 30 minutes of confirming, nothing is charged and the store is not added.</p>
          <div className="flex gap-3">
            <Button type="button" disabled={busy || !allConsented} onClick={() => void confirm()} data-testid="add-store-confirm">Pay {usd(quote.amountCents)} and add store</Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => { setQuote(null); setError(null); }}>Change details</Button>
          </div>
        </section>
      )}

      {status && (
        <section className="mt-6 space-y-3 border border-border bg-card p-4 sm:p-5" data-testid="add-store-status" data-state={status.state} aria-live="polite">
          {status.state === "activated" && (<>
            <h2 className="text-xl font-bold text-foreground">{status.storeName} has been added</h2>
            <p className="text-sm text-foreground">Payment received. The store is active and you are its admin.</p>
            <Link className="underline" href="/dashboard">Back to your account</Link>
          </>)}
          {status.state === "payment_pending" && (<>
            <h2 className="text-xl font-bold text-foreground">Payment needs your action</h2>
            <p className="text-sm text-foreground">Your bank needs you to confirm this payment, or the card on file could not be charged. Complete payment by {when(status.paymentDeadline)}; otherwise nothing is charged and the store is not added.</p>
            {status.hostedPaymentUrl && <a className="underline" href={status.hostedPaymentUrl} rel="noopener noreferrer" referrerPolicy="no-referrer">Complete payment on Stripe&apos;s secure page</a>}
            <div><Button type="button" variant="outline" disabled={busy} onClick={() => void abandon()}>Cancel and don&apos;t add this store</Button></div>
          </>)}
          {["payment_setup", "paid_pending_activation", "cancel_requested"].includes(status.state) && <p className="text-sm text-foreground">Processing… this page updates by itself.</p>}
          {status.state === "expired_unpaid" && <p className="text-sm text-foreground">The store was not added and nothing was charged{status.errorCode === "abandoned" ? " (you cancelled)" : " (payment was not completed in time)"}.</p>}
          {status.state === "attention" && <Alert tone="warning" role="status" title="We need to check this payment">Support has been alerted. If your payment went through, nothing more will be charged and support will contact you. Reference: {status.operationId}</Alert>}
        </section>
      )}
    </PageContainer>
  );
}
