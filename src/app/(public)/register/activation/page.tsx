import { ActivationView } from "@/components/portal/activation/ActivationView";

export const metadata = { title: "Activation — Pharmacy Books" };

// Stripe-hosted Checkout returns here on success. The page reads the status; it never assumes one.
export default function Page() {
  return <ActivationView />;
}
