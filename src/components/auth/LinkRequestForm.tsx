"use client";

// APBM007A — "email me a sign-in link". The answer is deliberately the same for every address.
import { useState } from "react";
import { Alert } from "@/components/portal/Alert";
import { TextField } from "@/components/portal/FormField";
import { Button } from "@/components/ui/button";

export function LinkRequestForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "slow" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/auth/link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
    setState(!res ? "error" : res.status === 429 ? "slow" : res.ok ? "sent" : "error");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 border border-border bg-card p-4 sm:p-5" data-testid="link-request-form">
      <TextField id="link-email" type="email" autoComplete="email" label="Email for a sign-in link" value={email} onValue={setEmail} />
      <Button type="submit" variant="outline" className="w-full" disabled={state === "sending" || email.trim().length === 0}>
        {state === "sending" ? "Sending…" : "Email me a sign-in link"}
      </Button>
      {state === "sent" ? (
        <Alert tone="success" title="Check your inbox">
          If that address has an account, a sign-in link is on its way. It works once. You can ask for another in a minute.
        </Alert>
      ) : null}
      {state === "slow" ? <Alert tone="warning" title="Wait a minute and try again" /> : null}
      {state === "error" ? <Alert tone="destructive" title="Could not reach the server. Try again." /> : null}
    </form>
  );
}
