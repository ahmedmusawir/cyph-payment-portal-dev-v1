import { PharmacyStepView } from "@/components/portal/register/PharmacyStepView";

export const metadata = { title: "Pharmacy details — Pharmacy Books" };

// One pharmacy per registration (007A). Adding stores is not available yet.
export default function Page() {
  return <PharmacyStepView />;
}
