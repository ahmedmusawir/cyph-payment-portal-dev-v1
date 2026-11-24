"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Circle, ExternalLink, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, Placeholder } from "../Alert";
import { BRAND, owedBookHandoffHref } from "../brand";
import { PageContainer, ViewSkeleton } from "../Loading";
import { PageHeader } from "../PageHeader";
import { AccessLinkView } from "./AccessLinkView";
import { CheckoutIncompleteView } from "./CheckoutIncompleteView";
import { portalApi, registrationSession } from "@/services/portal";
import type { RegistrationStatusView } from "@/types/portal/api";

const POLL_MS = 4000;
const POLL_LIMIT_MS = 2 * 60 * 1000;
const RESEND_LOCK_MS = 60 * 1000;

type TrackState = "done" | "busy" | "warn" | "fail" | "idle";

function Track({ label, state, text }: { label: string; state: TrackState; text: string }) {
  const icon = {
    done: <Check className="h-4 w-4" aria-hidden="true" />,
    busy: <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />,
    warn: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
    fail: <XCircle className="h-4 w-4" aria-hidden="true" />,
    idle: <Circle className="h-4 w-4" aria-hidden="true" />,
  }[state];
  const tone = { done: "border-success bg-success/10", busy: "border-info bg-info/10", warn: "border-warning bg-warning/10", fail: "border-destructive bg-destructive/10", idle: "border-border bg-muted" }[state];
  const word = { done: "Done", busy: "In progress", warn: "Needs attention", fail: "Failed", idle: "Not started" }[state];
  return (
    <li className="flex min-w-0 items-start gap-3 py-3">
      <span className={`grid h-9 w-9 shrink-0 place-items-center border text-foreground ${tone}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {label} <span className="sr-only">— {word}</span>
        </p>
        <p className="break-words text-sm text-muted-foreground">{text}</p>
      </div>
    </li>
  );
}

/** The page keeps checking by itself only while something is still moving. */
function isWaiting(s: RegistrationStatusView): boolean {
  if (s.provisioning === "attention") return false;
  return s.payment === "pending" || s.provisioning === "pending" || (s.provisioning === "ready" && (s.email === "pending" || s.email === "not_started"));
}

// C06 Activation / registration status: three independent tracks (payment · setup · sign-in email),
// driven only by what the server reports. Stripe returns here after Checkout, so the first read asks
// the server to confirm with Stripe once; after that the page polls quietly. An unconfirmed payment is
// never described as failed and never invites a second payment.
export function ActivationView() {
  const router = useRouter();
  const [status, setStatus] = useState<RegistrationStatusView | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"check" | "resend" | "edit" | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [tick, setTick] = useState(0);
  const [resendMsg, setResendMsg] = useState<{ tone: "ok" | "warn"; text: string } | null>(null);
  const [resendLocked, setResendLocked] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const pollStart = useRef<number | null>(null);   // set when polling starts; never read during render
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (reconcile: boolean) => {
    const r = await portalApi.getStatus({ reconcile });
    if (r.ok) {
      setStatus(r.value);
      setLoadError(null);
    } else setLoadError(r.message);
  }, []);

  // First read after returning from Stripe: one authoritative check.
  useEffect(() => {
    void load(true);
  }, [load]);

  const waiting = status ? isWaiting(status) : false;
  useEffect(() => {
    if (!waiting || timedOut) return;
    const t = setTimeout(() => {
      pollStart.current ??= Date.now();
      if (Date.now() - pollStart.current >= POLL_LIMIT_MS) {
        setTimedOut(true);
        return;
      }
      void load(false).then(() => setTick((n) => n + 1));
    }, POLL_MS);
    return () => clearTimeout(t);
  }, [waiting, timedOut, tick, load]);

  // The checkout attempt is over once it expired unpaid or completed: the next one needs a new key.
  const attemptOver = status ? status.payment === "expired" || status.draft === "complete" : false;
  const complete = status?.draft === "complete";
  useEffect(() => {
    if (attemptOver) registrationSession.renewOperationKey();
    if (complete) registrationSession.clearForms();
  }, [attemptOver, complete]);

  useEffect(() => () => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
  }, []);

  async function checkAgain() {
    pollStart.current = Date.now();
    setTimedOut(false);
    setBusy("check");
    await load(true);
    setBusy(null);
  }

  async function resend() {
    setBusy("resend");
    setResendMsg(null);
    const r = await portalApi.resendAccessEmail();
    setBusy(null);
    if (r.ok) setResendMsg({ tone: "ok", text: "Request received. If the email can be sent, it's on its way — check your inbox." });
    else if (r.code === "slow_down") setResendMsg({ tone: "warn", text: "Wait a minute before asking for another email." });
    else {
      setResendMsg({ tone: "warn", text: r.message });
      return; // nothing was requested, so there is nothing to wait for
    }
    // One request a minute.
    setResendLocked(true);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => setResendLocked(false), RESEND_LOCK_MS);
  }

  async function goBackAndEdit() {
    if (!status) return;
    const wasOpenOnStripe = status.checkoutResumable;
    setBusy("edit");
    setEditError(null);
    const r = await portalApi.cancelCheckout();
    if (r.ok) {
      // A checkout that was open on Stripe is now closed for good; a later attempt is a new operation.
      if (wasOpenOnStripe) registrationSession.renewOperationKey();
      router.push("/register/review");
      return;
    }
    setBusy(null);
    setEditError(r.message);
    void load(false);
  }

  if (!status) {
    if (loadError) {
      return (
        <PageContainer>
          <Alert
            tone="destructive"
            title="We couldn't load your registration status"
            action={<Button type="button" variant="outline" onClick={checkAgain} disabled={busy !== null}>Check again</Button>}
          >
            {loadError} If you have just paid, please don&apos;t pay again — nothing is lost.
          </Alert>
        </PageContainer>
      );
    }
    return <PageContainer><ViewSkeleton label="Checking your registration…" /></PageContainer>;
  }

  if (status.draft === "none") {
    return (
      <PageContainer>
        <div data-testid="activation-none">
          <Alert tone="info" title="There's no registration in progress on this browser" action={<Button asChild variant="outline"><Link href="/register/plan">Start a subscription</Link></Button>}>
            If you registered on another device or browser, check your email for your sign-in link, or <Link href="/login" className="portal-link">sign in</Link>.
          </Alert>
        </div>
      </PageContainer>
    );
  }
  if (status.payment === "none") {
    return (
      <PageContainer>
        <div data-testid="activation-no-payment">
          <Alert tone="info" title="There's no payment to track yet">
            Activation starts after checkout. <Link href="/register/review" className="portal-link">Go to review</Link>
          </Alert>
        </div>
      </PageContainer>
    );
  }
  if (status.payment === "expired") return <CheckoutIncompleteView />;

  const s = status;
  const paid = s.payment === "confirmed";
  const unknown = s.payment === "unknown";
  const ready = s.provisioning === "ready";
  const attention = s.provisioning === "attention";
  const signInToFinish = attention && s.attention === "sign_in_to_finish";
  const canEdit = s.checkoutResumable || s.payment === "pending";
  const emailTo = s.ownerEmailMasked || "your email";
  const support = <Placeholder>{BRAND.supportEmail}</Placeholder>;

  const pay: TrackState = paid ? "done" : unknown ? "warn" : "busy";
  const setup: TrackState = ready ? "done" : attention ? "warn" : s.provisioning === "pending" ? "busy" : "idle";
  const mail: TrackState = s.email === "sent" || s.email === "not_needed" ? "done" : s.email === "failed" ? "fail" : s.email === "pending" ? "busy" : "idle";

  const heading = signInToFinish
    ? "Sign in to finish setup"
    : attention
      ? "Setup needs our attention"
      : unknown
        ? "We're confirming your payment"
        : !paid
          ? "Waiting for your payment"
          : !ready
            ? "Payment confirmed. Setting up your pharmacy…"
            : s.email === "not_needed"
              ? "You're all set"
              : s.email === "failed"
                ? "You're set up — the sign-in email didn't send"
                : s.email === "sent"
                  ? "You're in. Check your email."
                  : "You're set up — your sign-in email is on its way";

  const checkButton = (
    <Button type="button" variant="outline" onClick={checkAgain} disabled={busy !== null} aria-busy={busy === "check" || undefined} data-testid="check-again">
      {busy === "check" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      Check again
    </Button>
  );
  const editButton = canEdit ? (
    <Button type="button" variant="outline" onClick={goBackAndEdit} disabled={busy !== null} aria-busy={busy === "edit" || undefined} data-testid="go-back-edit">
      {busy === "edit" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      Go back and edit
    </Button>
  ) : null;

  return (
    <PageContainer>
      <PageHeader eyebrow="Activation" title={heading} />

      <section aria-labelledby="tr-h" aria-live="polite" className="mt-6 pb-card p-4 sm:p-5" data-testid="activation-tracks">
        <h2 id="tr-h" className="text-base font-semibold text-foreground">Activation progress</h2>
        <ol className="mt-1 divide-y divide-border">
          <Track
            label="Payment"
            state={pay}
            text={paid ? "Confirmed by Stripe." : unknown ? "Not confirmed yet. We're checking with Stripe — do not pay again." : "Waiting for Stripe's confirmation."}
          />
          <Track
            label="Pharmacy setup"
            state={setup}
            text={
              ready
                ? "Your pharmacy is set up in OwedBook."
                : signInToFinish
                  ? "Waiting for you to sign in to the account that already uses this email."
                  : attention
                    ? "Setup didn't finish by itself. You don't need to do anything on this page."
                    : s.provisioning === "pending"
                      ? "Setting up your pharmacy."
                      : "Starts after payment is confirmed."
            }
          />
          <Track
            label="Sign-in email"
            state={mail}
            text={
              s.email === "sent"
                ? `Sent to ${emailTo}.`
                : s.email === "not_needed"
                  ? "Not needed — you bought this while signed in."
                  : s.email === "failed"
                    ? "Couldn't be sent. Send it again below."
                    : s.email === "pending"
                      ? `Being sent to ${emailTo}.`
                      : "Sent once setup finishes."
            }
          />
        </ol>
        {waiting && !timedOut ? (
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground" data-testid="auto-refresh-note">This page updates by itself every few seconds.</p>
        ) : null}
      </section>

      <div className="mt-5 space-y-5">
        {loadError ? (
          <Alert tone="warning" title="We couldn't refresh the status just now" action={checkButton}>
            {loadError} What you see below is the last status we received.
          </Alert>
        ) : null}
        {editError ? (
          <div data-testid="edit-error">
            <Alert tone="destructive" title="We couldn't go back to editing">{editError}</Alert>
          </div>
        ) : null}

        {waiting && timedOut ? (
          <div data-testid="still-working">
            <Alert tone="info" title="Still working" action={checkButton}>
              This is taking longer than usual. You can close this page — nothing is lost{paid ? ", and you don't need to pay again" : ""}. Come back to this page on this browser, or check again now.
            </Alert>
          </div>
        ) : null}

        {signInToFinish ? (
          <div data-testid="activation-sign-in-to-finish">
            <Alert
              tone="info"
              title="This email already has an account"
              action={
                <Button asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              }
            >
              Check your inbox at <span className="break-all">{emailTo}</span> and sign in to finish setup. {paid ? "Your payment went through" : "We're still confirming your payment"}, so do not pay again.
            </Alert>
          </div>
        ) : attention ? (
          <div data-testid="activation-contact-support">
            <Alert tone="warning" title={paid ? "Your payment went through; setup needs our attention" : "Setup needs our attention"}>
              {paid ? "You don't need to pay again." : "We're still confirming your payment — do not pay again."} Contact {support} and we&apos;ll finish setting up your pharmacy.
            </Alert>
          </div>
        ) : unknown ? (
          <div data-testid="activation-unknown">
            <Alert tone="warning" title="We're confirming your payment — do not pay again" action={<>{checkButton}{editButton}</>}>
              We couldn&apos;t confirm the outcome with Stripe just now. Your registration is saved and nothing is lost. Check again in a moment; if it stays like this, contact {support}.
            </Alert>
          </div>
        ) : !paid ? (
          <div data-testid="activation-pending">
            <Alert tone="info" title="Your payment hasn't been confirmed yet" action={editButton ?? undefined}>
              If you&apos;ve just paid on Stripe&apos;s page, this usually takes a moment — please don&apos;t pay again.
              {canEdit ? " If you left Stripe's page without paying, you can go back and edit your details; that closes the open checkout." : ""}
            </Alert>
          </div>
        ) : null}

        {(ready && (s.email === "sent" || s.email === "failed" || s.email === "pending" || s.email === "not_started")) || signInToFinish ? (
          <AccessLinkView
            emailMasked={emailTo}
            delivery={s.email === "failed" ? "failed" : s.email === "sent" || signInToFinish ? "sent" : "pending"}
            onResend={resend}
            busy={busy === "resend"}
            locked={resendLocked}
            message={resendMsg}
          />
        ) : null}

        {ready && s.email === "not_needed" ? (
          <section aria-labelledby="go-h" className="pb-card p-4 sm:p-5" data-testid="activation-signed-in">
            <h2 id="go-h" className="text-base font-semibold text-foreground">Your subscription is active</h2>
            <p className="mt-1 text-sm text-muted-foreground">You&apos;re already signed in, so no sign-in email is needed.</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href="/billing">Go to billing</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={owedBookHandoffHref()}>
                  Open {BRAND.owedBook} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </PageContainer>
  );
}
