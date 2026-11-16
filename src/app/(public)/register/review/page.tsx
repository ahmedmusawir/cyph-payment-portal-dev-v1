import { ReviewView } from "@/components/portal/register/ReviewView";

export const metadata = { title: "Review and pay — Pharmacy Books" };

// Stripe-hosted Checkout returns here when the customer cancels.
export default function Page() {
  return <ReviewView />;
}
