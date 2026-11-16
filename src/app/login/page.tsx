import { redirect } from "next/navigation";
import { getPortalUser } from "@/services/auth/session";
import { PublicShell } from "@/components/portal/PublicShell";
import { LoginPageContent } from "./LoginPageContent";

export const metadata = { title: "Sign in — Pharmacy Books" };

const HANDOFF_RESUME = "/api/handoff/authorize?resume=1";

// Sign-in in the public shell. Any signed-in user skips straight in (APBM007A:
// customers are ordinary members). Two values are read from the URL, neither with
// any access effect: `reason=session_expired` (banner text) and `next=continue`
// (after sign-in, resume the pending move to the other app).
export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { reason, next } = await searchParams;
  const continueHandoff = next === "continue";
  const user = await getPortalUser();
  if (user) redirect(continueHandoff ? HANDOFF_RESUME : "/dashboard");
  return (
    <PublicShell>
      <LoginPageContent sessionExpired={reason === "session_expired"} continueHandoff={continueHandoff} />
    </PublicShell>
  );
}
