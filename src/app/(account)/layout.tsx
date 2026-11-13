import { redirect } from "next/navigation";
import { getPortalUser } from "@/services/auth/session";
import { Shell } from "@/components/portal/Shell";

// Auth gate for every signed-in screen (APBM007A): ANY authenticated user —
// customers are ordinary members. What a user may see is decided by the server
// operations behind each screen (billing is owner-only in the database), not by
// a role here. Anonymous visitors go to /login. Each page ALSO calls
// requirePortalUser(): Next renders a page in parallel with its layout, so this
// redirect alone would still stream the page payload.
// Public registration lives in the separate (public) group and never inherits
// this layout. Login stands outside both groups.
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getPortalUser();
  if (!user) redirect("/login");

  return <Shell user={{ displayName: user.displayName, email: user.email }}>{children}</Shell>;
}
