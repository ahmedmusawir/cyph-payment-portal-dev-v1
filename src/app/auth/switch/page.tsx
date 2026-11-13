import { redirect } from "next/navigation";
import { PublicShell } from "@/components/portal/PublicShell";
import { SwitchAccount } from "@/components/auth/AuthPages";
import { createClient } from "@/utils/supabase/server";

export const metadata = { title: "Different account" };
export const dynamic = "force-dynamic";

const mask = (email: string) => { const [l, d] = email.split("@"); return `${l.slice(0, 1)}${"•".repeat(Math.max(1, Math.min(6, l.length - 1)))}@${d}`; };

// APBM007A §5: a different user is signed in here. Nothing is replaced until the person presses the POST button.
export default async function SwitchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { t } = await searchParams;
  const { data } = await (await createClient()).auth.getUser();
  if (!data.user || typeof t !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(t)) redirect("/auth/handoff-recovery");
  return <PublicShell><SwitchAccount currentEmailMasked={mask(data.user.email ?? "this account")} token={t} /></PublicShell>;
}
