import { PublicShell } from "@/components/portal/PublicShell";
import { SignedOut } from "@/components/auth/AuthPages";

export const metadata = { title: "Signed out" };

export default function SignedOutPage() {
  return <PublicShell><SignedOut /></PublicShell>;
}
