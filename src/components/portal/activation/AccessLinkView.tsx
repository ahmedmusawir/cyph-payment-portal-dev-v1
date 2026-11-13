import { Loader2, MailCheck, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Placeholder } from "../Alert";
import { BRAND } from "../brand";

// C17 Access email panel on the status page: where the sign-in link went, and the resend control.
// It never shows or edits the full address and never signs anyone in. Resending is a notification
// only — it cannot charge or set anything up again — and the server allows one request a minute.
export function AccessLinkView({
  emailMasked,
  delivery,
  onResend,
  busy,
  locked,
  message,
}: {
  emailMasked: string;
  /** sent: delivered to the provider · failed: could not be sent · pending: being sent */
  delivery: "sent" | "failed" | "pending";
  onResend: () => void;
  busy: boolean;
  /** True for a minute after a request (the one-minute rule). */
  locked: boolean;
  message: { tone: "ok" | "warn"; text: string } | null;
}) {
  const failed = delivery === "failed";
  const Icon = failed ? MailWarning : MailCheck;
  return (
    <section aria-labelledby="mail-h" className="border border-border bg-card p-4 sm:p-5" data-testid={`access-email-${delivery}`}>
      <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      <h2 id="mail-h" className="mt-2 text-xl font-bold text-foreground">
        {failed ? "We couldn't send your sign-in email" : delivery === "pending" ? "Your sign-in email is on its way" : "Check your email"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {failed ? (
          <>Your payment and setup are fine — only the email to <span className="break-all font-medium text-foreground">{emailMasked}</span> failed. Send it again below.</>
        ) : delivery === "pending" ? (
          <>We&apos;re sending a sign-in link to <span className="break-all font-medium text-foreground">{emailMasked}</span>. It works once.</>
        ) : (
          <>Check <span className="break-all font-medium text-foreground">{emailMasked}</span> for your sign-in link. It works once. We don&apos;t sign you in from this page.</>
        )}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button type="button" variant={failed ? "default" : "outline"} onClick={onResend} disabled={busy || locked} aria-busy={busy || undefined} data-testid="resend">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {failed ? "Send the email again" : "Resend the email"}
        </Button>
        {message ? (
          <p className={message.tone === "warn" ? "text-sm font-medium text-foreground" : "text-sm text-foreground"} role="status" data-testid="resend-message">
            {message.text}
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Give it a few minutes and check your spam folder. You can ask for another once a minute. Wrong address? Contact <Placeholder>{BRAND.supportEmail}</Placeholder> — for your security we don&apos;t change it from this page.
      </p>
    </section>
  );
}
