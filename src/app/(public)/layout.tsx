import { PublicShell } from "@/components/portal/PublicShell";

// PUBLIC registration surface: no login, no auth lookup.
// Deliberately outside the (account) group so no protected parent applies.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
