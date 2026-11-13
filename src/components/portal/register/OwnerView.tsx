"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "../Alert";
import { ErrorSummary, summarize } from "../ErrorSummary";
import { RequiredNote, TextField } from "../FormField";
import { PageContainer, ViewSkeleton } from "../Loading";
import { PageHeader } from "../PageHeader";
import { Stepper } from "../Stepper";
import { useRegistrationDraft } from "./useRegistrationDraft";
import {
  OWNER_DECLARATION,
  ownerFromDraft,
  registrationSession,
  useRegistrationSession,
  validateOwnerForm,
  type OwnerForm,
} from "@/services/portal";

const FIELDS = [
  { key: "firstName", fieldId: "first", label: "First name" },
  { key: "lastName", fieldId: "last", label: "Last name" },
  { key: "email", fieldId: "email", label: "Work email" },
  { key: "mobile", fieldId: "mobile", label: "Mobile phone" },
  { key: "ownerDeclaration", fieldId: "owner-declaration", label: "Owner declaration" },
] as const;

// C02 Owner details. Owner and pharmacy are saved to the server together when the pharmacy step
// completes; until then what is typed here is kept for this tab only.
export function OwnerView() {
  const router = useRouter();
  const { loading, draft, error: loadError, reload } = useRegistrationDraft();
  const session = useRegistrationSession();
  const [form, setForm] = useState<OwnerForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const [focusSummary, setFocusSummary] = useState(0);

  // Prefill once: unsaved input from this tab first, otherwise the saved draft.
  useEffect(() => {
    if (!loading && session.hydrated && !form) setForm(session.owner ?? ownerFromDraft(draft));
  }, [loading, session.hydrated, session.owner, draft, form]);

  useEffect(() => {
    if (focusSummary) summaryRef.current?.focus();
  }, [focusSummary]);

  if (loading || !form) return <PageContainer><ViewSkeleton /></PageContainer>;

  const set = (k: Exclude<keyof OwnerForm, "ownerDeclarationAccepted">) => (v: string) => setForm({ ...form, [k]: v });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const found = validateOwnerForm(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setFocusSummary((n) => n + 1);
      return;
    }
    registrationSession.keepOwner(form);
    router.push("/register/pharmacy");
  }

  return (
    <PageContainer>
      <Stepper current={2} />
      <PageHeader
        eyebrow="Step 2 · Owner"
        title="Tell us about you"
        lead="You will be the billing owner for this account. We send your sign-in link to this email after payment."
      />
      {loadError ? (
        <Alert tone="warning" className="mt-5" title="We couldn't check for a saved draft" action={<Button type="button" variant="outline" onClick={reload}>Try again</Button>}>
          {loadError} You can still fill this in; nothing has been charged.
        </Alert>
      ) : null}
      <ErrorSummary ref={summaryRef} items={summarize(errors, FIELDS)} />

      <form className="mt-6 space-y-6" noValidate onSubmit={submit}>
        <RequiredNote />
        <div className="grid min-w-0 gap-5 border border-border bg-card p-4 sm:grid-cols-2 sm:p-5">
          <TextField id="first" label="First name" required autoComplete="given-name" value={form.firstName} onValue={set("firstName")} error={errors.firstName} />
          <TextField id="last" label="Last name" required autoComplete="family-name" value={form.lastName} onValue={set("lastName")} error={errors.lastName} />
          <TextField
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            label="Work email"
            required
            shellClassName="sm:col-span-2"
            value={form.email}
            onValue={set("email")}
            error={errors.email}
            help="Your sign-in link goes here. Use an inbox you check daily."
          />
          <TextField id="mobile" type="tel" inputMode="tel" autoComplete="tel" label="Mobile phone" required value={form.mobile} onValue={set("mobile")} error={errors.mobile} />
        </div>
        <fieldset className="min-w-0 border border-border bg-card p-4 sm:p-5" data-testid="owner-declaration-panel">
          <legend className="sr-only">Owner declaration (required)</legend>
          <label htmlFor="owner-declaration" className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-foreground">
            <input
              id="owner-declaration"
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0"
              checked={form.ownerDeclarationAccepted}
              onChange={(e) => setForm({ ...form, ownerDeclarationAccepted: e.target.checked })}
              aria-required="true"
              aria-invalid={errors.ownerDeclaration ? true : undefined}
              aria-describedby={["owner-declaration-help", errors.ownerDeclaration ? "owner-declaration-err" : null].filter(Boolean).join(" ")}
            />
            <span>
              {OWNER_DECLARATION} <span className="text-destructive" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </span>
          </label>
          <p id="owner-declaration-help" className="ml-8 mt-1 text-xs text-muted-foreground">
            Registration is for pharmacy owners only. This is your own declaration: email and payment don&apos;t prove ownership, and any ownership check happens separately. It is separate from the terms and payment agreements you&apos;ll see before checkout.
          </p>
          {errors.ownerDeclaration ? (
            <p id="owner-declaration-err" className="ml-8 mt-1 flex items-center gap-1.5 text-xs font-medium text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {errors.ownerDeclaration}
            </p>
          ) : null}
        </fieldset>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              registrationSession.keepOwner(form);
              router.push("/register/plan");
            }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <Button type="submit" className="px-6 sm:min-w-[12rem]">
            Continue
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Going back keeps what you&apos;ve entered in this browser tab. Your details are saved to your draft when you finish the pharmacy step.
        </p>
      </form>
    </PageContainer>
  );
}
