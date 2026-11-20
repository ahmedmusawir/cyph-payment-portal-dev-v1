import { Loader2 } from "lucide-react";

// Manual QA 19 Nov 2026 (R2): a pending action shows a spinner and says what it is doing, instead of a silent grey button.
// Put it inside the action's own Button and set aria-busy on that Button; the page's live region announces the result.
export function BusyLabel({ busy, busyText, children }: { busy: boolean; busyText: string; children: React.ReactNode }) {
  if (!busy) return <>{children}</>;
  return (<><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />{busyText}</>);
}
