import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert } from "../Alert";
import { PageContainer } from "../Loading";
import { PageHeader } from "../PageHeader";

// C14 Checkout not completed. Shown by the status page only when the server reports the checkout as
// expired and unpaid — the one case where "nothing was charged" is a confirmed fact.
export function CheckoutIncompleteView() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Signup"
        title="Welcome back. Let's finish your signup."
        lead="Your details are saved. Payment wasn't completed, so your account isn't active yet."
      />
      <div className="mt-5" data-testid="incomplete-expired">
        <Alert tone="info" title="That checkout expired — nothing was charged">
          Stripe closed the payment page without taking a payment. Go back to review for a current price, then confirm again whenever you&apos;re ready.
        </Alert>
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button asChild data-testid="incomplete-continue">
          <Link href="/register/review">Back to review</Link>
        </Button>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Already subscribed? <Link href="/login" className="portal-link">Sign in</Link>.
      </p>
    </PageContainer>
  );
}
