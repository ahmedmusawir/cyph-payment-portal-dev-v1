"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { externalRedirect, portalApi } from "@/services/portal";
import { LinkRequestForm } from "@/components/auth/LinkRequestForm";
import { Alert } from "@/components/portal/Alert";
import { PageHeader } from "@/components/portal/PageHeader";
import { BRAND } from "@/components/portal/brand";
import { PasswordField, TextField } from "@/components/portal/FormField";
import { PageContainer } from "@/components/portal/Loading";

const HANDOFF_RESUME = "/api/handoff/authorize?resume=1";

// Supabase password sign-in (kit /api/auth/login) with the designed sign-in
// presentation, plus the email sign-in link. APBM007A: any account may sign in —
// customers are ordinary members; the server layout and each server operation
// decide what a signed-in user can see.
export function LoginPageContent({ sessionExpired, continueHandoff = false }: { sessionExpired: boolean; continueHandoff?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ title: string; body?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // F-Q4-001: what was typed or filled before the page finished loading is in the fields but never reached this state,
  // so Sign in stayed disabled and the next re-render (e.g. Show password) wiped it. Adopt it once React owns the fields.
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (emailRef.current?.value) setEmail(emailRef.current.value);
    if (passwordRef.current?.value) setPassword(passwordRef.current.value);
  }, []);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);

    const result = await portalApi.signIn(email, password);
    if (!result.ok) {
      setError(
        /invalid login credentials/i.test(result.message)
          ? { title: "That email and password don't match", body: "Check both and try again." }
          : { title: result.message },
      );
      setLoading(false);
      return;
    }

    if (continueHandoff) {
      // Resume the move to the other app that was waiting for this sign-in.
      externalRedirect(HANDOFF_RESUME);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <PageContainer width="md">
      <PageHeader eyebrow="Account & Billing" title="Sign in" lead={`Same sign-in as ${BRAND.owedBook}. Use your existing account to manage your subscription.`} />

      {sessionExpired ? (
        <Alert tone="info" className="mt-5" title="Your session expired">
          Sign in again to continue. Nothing you did on Stripe&apos;s page is lost — your summary refreshes after sign-in.
        </Alert>
      ) : null}
      {error ? (
        <Alert tone="destructive" className="mt-5" title={error.title}>
          {error.body}
        </Alert>
      ) : null}

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4 pb-card p-4 sm:p-5">
        <TextField
          ref={emailRef}
          id="email"
          type="email"
          autoComplete="email"
          label="Work email"
          value={email}
          onValue={setEmail}
          aria-invalid={error ? true : undefined}
        />
        <PasswordField
          ref={passwordRef}
          id="password"
          autoComplete="current-password"
          label="Password"
          value={password}
          onValue={setPassword}
          aria-invalid={error ? true : undefined}
        />
        <Button type="submit" className="w-full" disabled={!canSubmit} aria-busy={loading || undefined}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <section aria-labelledby="link-h" className="mt-6">
        <h2 id="link-h" className="text-base font-semibold text-foreground">No password, or forgot it?</h2>
        <p className="mb-3 mt-1 text-sm text-muted-foreground">We can email you a sign-in link instead. It works once.</p>
        <LinkRequestForm />
      </section>

      <p className="mt-6 text-sm text-muted-foreground">
        New pharmacy? <Link href="/register/plan" className="portal-link">Start a subscription</Link>
      </p>
    </PageContainer>
  );
}
