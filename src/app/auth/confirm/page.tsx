import { PublicShell } from "@/components/portal/PublicShell";
import { ConfirmSignIn, LinkExpired } from "@/components/auth/AuthPages";
import { pendingConfirmation } from "@/server/emailLink";

export const metadata = { title: "Finish signing in" };
export const dynamic = "force-dynamic";

// APBM007A (FC-4): rendering this page redeems nothing. The session is created only by the form's POST.
export default async function ConfirmPage() {
  const pending = await pendingConfirmation();
  return <PublicShell>{pending ? <ConfirmSignIn csrf={pending.csrf} /> : <LinkExpired />}</PublicShell>;
}
