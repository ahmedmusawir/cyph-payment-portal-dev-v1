import { PlanView } from "@/components/portal/register/PlanView";

export const metadata = { title: "Choose your plan — Pharmacy Books" };

// Public: no login.
export default function Page() {
  return <PlanView />;
}
