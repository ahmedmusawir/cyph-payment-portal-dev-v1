// APBM007A — small presentational pieces for the sign-in confirmation, link recovery, handoff recovery, account
// switch and signed-out pages. Server-renderable: the two forms are plain HTML POSTs, so they work without script.
import { PageHeader } from "@/components/portal/PageHeader";
import Link from "next/link";
import { Alert } from "@/components/portal/Alert";
import { PageContainer } from "@/components/portal/Loading";
import { LinkRequestForm } from "@/components/auth/LinkRequestForm";

const buttonClass = "inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-center text-base font-normal text-primary-foreground hover:bg-primary-hover";
const secondaryClass = "inline-flex min-h-11 w-full items-center justify-center rounded-md border border-input bg-card px-5 py-2.5 text-center text-base font-normal text-heading hover:bg-accent";

function Frame({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <PageContainer width="md">
      <PageHeader eyebrow={eyebrow} title={title} />
      <div className="space-y-4">{children}</div>
    </PageContainer>
  );
}

/** The button page. The token is not on this page or in its address; pressing the button is what signs in. */
export function ConfirmSignIn({ csrf }: { csrf: string }) {
  return (
    <Frame eyebrow="Account & Billing" title="Finish signing in">
      <p className="text-sm text-muted-foreground">You opened a sign-in link. Press the button to sign in on this browser. The link works once.</p>
      <form method="post" action="/api/auth/confirm" className="pb-card p-4 sm:p-5">
        <input type="hidden" name="csrf" value={csrf} />
        <button type="submit" className={buttonClass} data-testid="confirm-sign-in">Sign in</button>
      </form>
      <p className="text-xs text-muted-foreground">If you didn&apos;t ask for this link, close this page. Nothing happens unless you press the button.</p>
    </Frame>
  );
}

export function LinkExpired() {
  return (
    <Frame eyebrow="Account & Billing" title="That sign-in link can't be used">
      <Alert tone="warning" title="The link has expired or was already used">
        Sign-in links work once and expire. Request a new one below, or sign in with your password.
      </Alert>
      <LinkRequestForm />
      <Link href="/login" className={secondaryClass}>Sign in with a password</Link>
    </Frame>
  );
}

export function HandoffRecovery({ startHref }: { startHref: string }) {
  return (
    <Frame eyebrow="Account & Billing" title="We couldn't move you across">
      <Alert tone="warning" title="Nothing was changed">
        Moving between OwedBook and billing didn&apos;t finish. You can try again, or sign in here by email.
      </Alert>
      <a href={startHref} className={buttonClass} data-testid="handoff-try-again">Try again</a>
      <LinkRequestForm />
    </Frame>
  );
}

export function SwitchAccount({ currentEmailMasked, token }: { currentEmailMasked: string; token: string }) {
  return (
    <Frame eyebrow="Account & Billing" title="You're signed in here as a different account">
      <p className="text-sm text-muted-foreground">
        This browser is signed in here as <span className="font-medium text-foreground">{currentEmailMasked}</span>. The other app is signed in as a different account. Nothing has been changed.
      </p>
      <Link href="/dashboard" className={secondaryClass} data-testid="switch-stay">Stay signed in as {currentEmailMasked}</Link>
      <form method="post" action="/api/handoff/switch">
        <input type="hidden" name="t" value={token} />
        <button type="submit" className={buttonClass} data-testid="switch-continue">Sign out here and continue as the other account</button>
      </form>
    </Frame>
  );
}

export function SignedOut() {
  return (
    <Frame eyebrow="Account & Billing" title="You're signed out">
      <Alert tone="info" title="You signed out while we were moving you across">Sign in again to continue.</Alert>
      <Link href="/login" className={buttonClass}>Sign in</Link>
    </Frame>
  );
}

export function SignInToContinue() {
  return (
    <Frame eyebrow="Account & Billing" title="Sign in to continue">
      <p className="text-sm text-muted-foreground">Sign in here first. You&apos;ll then be taken on to where you were going.</p>
      <Link href="/login?next=continue" className={buttonClass} data-testid="continue-sign-in">Sign in</Link>
      <LinkRequestForm />
    </Frame>
  );
}
