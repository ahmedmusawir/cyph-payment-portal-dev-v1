"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BRAND } from "../brand";
import { PageContainer, ViewSkeleton } from "../Loading";
import { PageHeader } from "../PageHeader";
import { Pill } from "../Pill";
import { Stepper } from "../Stepper";
import { useRegistrationDraft } from "./useRegistrationDraft";

// C01 Choose plan. 007A sells exactly one pharmacy store per registration; the prices here are the
// published plan prices (static copy). The amount actually charged is the server quote on the review step.
export function PlanView() {
  const router = useRouter();
  const { loading } = useRegistrationDraft();

  if (loading) return <PageContainer><ViewSkeleton /></PageContainer>;

  return (
    <PageContainer>
      <Stepper current={1} />
      <PageHeader
        eyebrow="Get started"
        title="Choose your plan"
        lead="One subscription covers your pharmacy account, starting with one pharmacy."
      />
      <form
        className="mt-6 space-y-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/register/owner");
        }}
      >
        <fieldset className="min-w-0">
          <legend className="mb-2 text-sm font-medium text-foreground">Plan</legend>
          <label className="relative flex cursor-pointer flex-col gap-2 border-2 border-primary bg-card p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
            <input type="radio" name="plan" className="sr-only" checked readOnly value="owedbook" />
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-foreground">{BRAND.owedBook}</span>
              <span className="inline-flex items-center whitespace-nowrap border border-foreground/25 bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">Selected</span>
            </span>
            <span className="text-2xl font-semibold tabular-nums text-foreground" data-testid="plan-price">
              $99.00 <span className="text-sm font-normal text-muted-foreground">/ month</span>
            </span>
            <span className="text-xs text-muted-foreground">Includes 1 pharmacy · each additional store $49.00 / month</span>
          </label>
        </fieldset>

        <div className="min-w-0 border border-border bg-card p-4 sm:p-5" data-testid="store-count">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Pharmacies on this subscription: 1</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You register one pharmacy now. Additional stores can be added later — that isn&apos;t available yet.
              </p>
            </div>
            <Pill tone="muted" className="self-start">More stores · not available yet</Pill>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Already subscribed? <Link href="/login" className="portal-link">Sign in</Link>.
          </p>
          <Button type="submit" className="px-6 sm:min-w-[12rem]">
            Continue
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          You will not be charged until the final step, where you see the exact price first. Payment is handled on Stripe&apos;s secure checkout page.
        </p>
      </form>
    </PageContainer>
  );
}
