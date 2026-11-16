import { PublicShell } from "@/components/portal/PublicShell";
import { LinkExpired } from "@/components/auth/AuthPages";

export const metadata = { title: "Sign-in link expired" };

export default function LinkExpiredPage() {
  return <PublicShell><LinkExpired /></PublicShell>;
}
