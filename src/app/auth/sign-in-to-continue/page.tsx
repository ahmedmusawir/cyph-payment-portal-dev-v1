import { PublicShell } from "@/components/portal/PublicShell";
import { SignInToContinue } from "@/components/auth/AuthPages";

export const metadata = { title: "Sign in to continue" };

export default function SignInToContinuePage() {
  return <PublicShell><SignInToContinue /></PublicShell>;
}
