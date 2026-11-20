"use client";
// APBM-007B — period-end removal and undo for one store (owner). The store keeps full access until the cutoff; no credit,
// refund or proration. The server refuses the last store (whole-account cancellation instead) and the last 90 minutes.
// Manual QA 19 Nov 2026 (R2/R9): an explicit confirmation naming the pharmacy and the date (no browser "OK" prompt),
// action wording on the buttons, and busy feedback while the request runs.
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/services/portal";
import { BusyLabel } from "../BusyLabel";

export function StoreRemovalControl({ storeId, storeName, periodEnd, removalEffectiveAt, onChanged }: {
  storeId: string; storeName: string; periodEnd: string | null; removalEffectiveAt: string | null; onChanged: () => void;
}) {
  const [busy, setBusy] = useState<"remove" | "undo" | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const intent = useRef(`rm_${crypto.randomUUID().replace(/-/g, "")}`);
  const endDate = periodEnd ? formatDate(periodEnd) : null;
  const act = async (undo: boolean) => {
    if (busy) return;
    setBusy(undo ? "undo" : "remove"); setMessage(null);
    let res: Response | null = null; let json: { message?: string; data?: { state?: string } } = {};
    try {
      res = await fetch(`/api/stores/${storeId}/removal${undo ? "/undo" : ""}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ intentKey: intent.current }) });
      json = await res.json().catch(() => ({}));
    } catch { /* network failure: reported below, nothing assumed */ }
    setBusy(null); setConfirming(false);
    intent.current = `rm_${crypto.randomUUID().replace(/-/g, "")}`;
    if (!res || !res.ok) { setMessage(json?.message ?? "That did not work. Nothing changed; try again."); return; }
    const state = json?.data?.state;
    setMessage(state === "completed" ? (undo ? `${storeName} stays on your account.` : `Removal scheduled${endDate ? ` for ${endDate}` : ""}.`) : state === "attention" ? "We need to check this change; support has been alerted." : "Processing…");
    onChanged();
  };
  return (
    <span className="flex min-w-0 max-w-full flex-col items-start gap-1">
      {removalEffectiveAt ? (<>
        <span className="text-xs text-muted-foreground">Leaves on {formatDate(removalEffectiveAt)}</span>
        <Button type="button" size="sm" variant="outline" className="h-auto max-w-full whitespace-normal py-1 text-left" disabled={busy !== null} aria-busy={busy === "undo"} onClick={() => void act(true)} data-testid={`undo-removal-${storeId}`}>
          <BusyLabel busy={busy === "undo"} busyText="Keeping store…">Keep this store</BusyLabel>
        </Button>
      </>) : (
        <Button type="button" size="sm" variant="outline" className="h-auto max-w-full whitespace-normal py-1 text-left" disabled={busy !== null} onClick={() => setConfirming(true)} data-testid={`remove-store-${storeId}`}>Remove at period end</Button>
      )}
      {message && <span role="status" className="text-xs text-foreground">{message}</span>}
      <AlertDialog open={confirming} onOpenChange={(o) => { if (!busy) setConfirming(o); }}>
        <AlertDialogContent data-testid={`remove-store-dialog-${storeId}`}>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {storeName}{endDate ? ` on ${endDate}` : " at the end of this billing period"}?</AlertDialogTitle>
            <AlertDialogDescription>
              {storeName} stays fully usable until {endDate ?? "the end of the current billing period"}. After that its people lose access and it is no longer billed. No refund or credit is given for the current period. Until then you can undo this with &quot;Keep this store&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy !== null}>Cancel</AlertDialogCancel>
            <Button type="button" variant="destructive" disabled={busy !== null} aria-busy={busy === "remove"} onClick={() => void act(false)} data-testid={`confirm-remove-${storeId}`}>
              <BusyLabel busy={busy === "remove"} busyText="Scheduling removal…">Schedule removal</BusyLabel>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </span>
  );
}
