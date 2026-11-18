"use client";
// APBM-007B — period-end removal and undo for one store (owner). The store keeps full access until the cutoff; no credit,
// refund or proration. The server refuses the last store (whole-account cancellation instead) and the last 90 minutes.
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function StoreRemovalControl({ storeId, removalEffectiveAt, onChanged }: { storeId: string; removalEffectiveAt: string | null; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const intent = useRef(`rm_${crypto.randomUUID().replace(/-/g, "")}`);
  const act = async (undo: boolean) => {
    if (!undo && !window.confirm("Remove this store at the end of the current billing period? It stays fully usable until then. No refund or credit is given.")) return;
    setBusy(true); setMessage(null);
    const res = await fetch(`/api/stores/${storeId}/removal${undo ? "/undo" : ""}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ intentKey: intent.current }) });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    intent.current = `rm_${crypto.randomUUID().replace(/-/g, "")}`;
    if (!res.ok) { setMessage(json?.message ?? "That did not work."); return; }
    const state = json?.data?.state;
    setMessage(state === "completed" ? (undo ? "Removal cancelled." : "Removal scheduled.") : state === "attention" ? "We need to check this change; support has been alerted." : "Processing…");
    onChanged();
  };
  return (
    <span className="flex min-w-0 max-w-full flex-col items-start gap-1">
      {removalEffectiveAt ? (<>
        <span className="text-xs text-muted-foreground">Leaves on {new Date(removalEffectiveAt).toLocaleDateString()}</span>
        <Button type="button" size="sm" variant="outline" className="h-auto max-w-full whitespace-normal py-1 text-left" disabled={busy} onClick={() => void act(true)} data-testid={`undo-removal-${storeId}`}>Keep this store</Button>
      </>) : (
        <Button type="button" size="sm" variant="outline" className="h-auto max-w-full whitespace-normal py-1 text-left" disabled={busy} onClick={() => void act(false)} data-testid={`remove-store-${storeId}`}>Remove at period end</Button>
      )}
      {message && <span role="status" className="text-xs text-foreground">{message}</span>}
    </span>
  );
}
