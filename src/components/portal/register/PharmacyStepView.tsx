"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "../Alert";
import { ErrorSummary, summarize } from "../ErrorSummary";
import { RequiredNote } from "../FormField";
import { PageContainer, ViewSkeleton } from "../Loading";
import { Pill } from "../Pill";
import { PHARMACY_SUMMARY_FIELDS, PharmacyFields, type PharmacyForm } from "../PharmacyFields";
import { Stepper } from "../Stepper";
import { useRegistrationDraft } from "./useRegistrationDraft";
import {
  ownerFromDraft,
  pharmacyFromDraft,
  portalApi,
  registrationSession,
  splitFieldErrors,
  toOwnerInput,
  toPharmacyInput,
  useRegistrationSession,
  validateOwnerForm,
  validatePharmacyValues,
  type OwnerForm,
  type PharmacyValues,
} from "@/services/portal";

type Notice = { title: string; body: string; link?: { href: string; label: string } };

// The owner is this store's admin in 007A; the form keeps the shared shape.
const withAdmin = (v: PharmacyValues): PharmacyForm => ({ ...v, admin: "owner", adminName: "", adminEmail: "" });
const values = ({ name, street, city, state, zip, ncpdp, npi, phone, software, softwareOther }: PharmacyForm): PharmacyValues => ({
  name, street, city, state, zip, ncpdp, npi, phone, software, softwareOther,
});

// C03 Your pharmacy (exactly one store). Completing this step saves owner and pharmacy to the
// server draft in one request.
export function PharmacyStepView() {
  const router = useRouter();
  const { loading, draft } = useRegistrationDraft();
  const session = useRegistrationSession();
  const [form, setForm] = useState<PharmacyForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [saving, setSaving] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<{ n: number; target: "summary" | "notice" } | null>(null);

  const ready = !loading && session.hydrated;
  // The owner step comes first: unsaved input from this tab, otherwise the saved draft.
  const owner: OwnerForm | null = !ready ? null : session.owner ?? (draft ? ownerFromDraft(draft) : null);
  const ownerOk = owner !== null && Object.keys(validateOwnerForm(owner)).length === 0;

  useEffect(() => {
    if (!ready) return;
    if (!ownerOk) {
      router.replace("/register/owner");
      return;
    }
    if (!form) setForm(withAdmin(session.pharmacy ?? pharmacyFromDraft(draft)));
  }, [ready, ownerOk, form, session.pharmacy, draft, router]);

  useEffect(() => {
    if (!focus) return;
    (focus.target === "notice" ? noticeRef.current : summaryRef.current)?.focus();
  }, [focus]);

  if (!ready || !ownerOk || !owner || !form) return <PageContainer><ViewSkeleton /></PageContainer>;

  const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(" ") || "you";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !form || !owner) return;
    setNotice(null);
    const found = validatePharmacyValues(values(form));
    setErrors(found);
    if (Object.keys(found).length) {
      setFocus({ n: Date.now(), target: "summary" });
      return;
    }
    setSaving(true);
    registrationSession.keepPharmacy(values(form));
    const result = await portalApi.saveDraft({ owner: toOwnerInput(owner), pharmacy: toPharmacyInput(values(form)) });
    if (result.ok) {
      registrationSession.clearForms(); // the server has it now
      router.push("/register/review");
      return;
    }
    setSaving(false);
    const split = splitFieldErrors(result.fieldErrors);
    if (result.code === "npi_unavailable") {
      // Deliberately neutral server wording, shown as-is on the field.
      setErrors({ npi: result.message });
      setFocus({ n: Date.now(), target: "summary" });
    } else if (Object.keys(split.pharmacy).length) {
      setErrors(split.pharmacy);
      setFocus({ n: Date.now(), target: "summary" });
    } else if (Object.keys(split.owner).length) {
      setNotice({ title: "Your owner details need another look", body: result.message, link: { href: "/register/owner", label: "Go to owner details" } });
      setFocus({ n: Date.now(), target: "notice" });
    } else if (result.code === "operation_in_progress") {
      setNotice({ title: "This registration can't be edited right now", body: result.message, link: { href: "/register/activation", label: "See its status" } });
      setFocus({ n: Date.now(), target: "notice" });
    } else {
      setNotice({ title: "We couldn't save your details", body: `${result.message} What you typed is kept on this page.` });
      setFocus({ n: Date.now(), target: "notice" });
    }
  }

  function back() {
    if (form) registrationSession.keepPharmacy(values(form));
    router.push("/register/owner");
  }

  return (
    <PageContainer>
      <Stepper current={3} />
      <div className="flex min-w-0 flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Step 3 · Pharmacy</p>
          <h1 className="mt-1 text-[26px] font-bold leading-tight text-foreground md:text-[32px]">Your pharmacy</h1>
        </div>
        <Pill tone="muted">1 of 1</Pill>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        We use these details to identify your pharmacy and set up its store. Ownership checks are separate — entering an identifier doesn&apos;t prove ownership. Adding more stores is not available yet.
      </p>

      {notice ? (
        <div ref={noticeRef} tabIndex={-1} className="mt-5 focus-visible:outline-none" data-testid="save-notice">
          <Alert tone="destructive" title={notice.title}>
            {notice.body}{" "}
            {notice.link ? <Link href={notice.link.href} className="portal-link">{notice.link.label}</Link> : null}
          </Alert>
        </div>
      ) : null}
      <ErrorSummary ref={summaryRef} items={summarize(errors, PHARMACY_SUMMARY_FIELDS)} />

      <form className="mt-6 space-y-6" noValidate onSubmit={submit}>
        <RequiredNote />
        <PharmacyFields form={form} onChange={setForm} errors={errors} ownerName={ownerName} context="signup" />
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={back} disabled={saving}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <Button type="submit" className="px-6 sm:min-w-[12rem]" disabled={saving} aria-busy={saving || undefined}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              "Continue to review"
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Going back keeps what you&apos;ve entered.</p>
      </form>
    </PageContainer>
  );
}
