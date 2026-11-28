"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Brand } from "./Brand";
import { LayoutMode } from "./layoutMode";
import { BRAND } from "./brand";
import { Footer, SkipLink } from "./Footer";

// Public shell: prospective subscribers, no login. "Already
// subscribed? Sign in" goes to /login. Below md the right side
// collapses to theme toggle + hamburger opening the existing left Sheet.
//
export function PublicShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // ABM007_FINAL literal layout (UI_SPEC 1, AC-L01): full-bleed navy backdrop; each page's PageContainer renders the
  // centred white shell and its PageHeader the masthead. The existing public navigation (support address, "Already
  // subscribed? Sign in") stays, in ice text on the backdrop; the theme toggle is gone (D-01).
  return (
    <div className="pb-backdrop pb-on-dark flex min-h-screen flex-col p-0 text-foreground">
      <SkipLink />
      <header className="z-30">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-5 py-2">
          {/* RWO-01 R-08: from md up the brand keeps its width, "Already subscribed?" and Sign in stay on one line, and
              only the support line gives way (it wraps before its address, which never breaks). Text sizes unchanged. */}
          <div className="min-w-0 md:shrink-0">
            <Brand href="/register/plan" />
          </div>
          <nav className="hidden min-w-0 items-center gap-1 md:flex" aria-label="Site">
            <span className="min-w-0 px-3 text-sm text-brand-ice">
              Questions? <span className="whitespace-nowrap font-medium text-navbar-foreground">{BRAND.supportEmail}</span>
            </span>
            <span className="ml-2 shrink-0 whitespace-nowrap text-sm text-brand-ice">Already subscribed?</span>
            <Link
              href="/login"
              className="ml-1 inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-md border border-navbar-foreground/70 px-4 text-[15px] text-navbar-foreground hover:bg-navbar-foreground/10"
              data-testid="public-sign-in"
            >
              Sign in
            </Link>
          </nav>
          <div className="flex items-center gap-1 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger aria-label="Open menu" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-navbar-foreground/70 px-3 py-2 text-[15px] text-navbar-foreground hover:bg-navbar-foreground/10" data-testid="menu-trigger">
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span aria-hidden="true">Menu</span>
              </SheetTrigger>
              <SheetContent aria-describedby={undefined}>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="border-b border-border p-4 pr-14">
                  <Brand href="/register/plan" tone="light" />
                </div>
                <div className="px-4 py-3">
                  <Link href="/login" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center rounded-md px-3 text-[15px] text-foreground hover:bg-accent">
                    Already subscribed? Sign in
                  </Link>
                  <p className="flex min-h-[44px] items-center px-3 text-sm text-muted-foreground">
                    Questions? <span className="ml-1 font-medium text-foreground">{BRAND.supportEmail}</span>
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="w-full flex-1 px-2.5 py-4 focus:outline-none sm:px-5 sm:py-6">
        <LayoutMode mode="literal">{children}</LayoutMode>
      </main>
      <Footer tone="dark" />
    </div>
  );
}
