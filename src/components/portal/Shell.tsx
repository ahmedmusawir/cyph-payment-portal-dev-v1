"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ExternalLink, Loader2, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpinnerLarge from "@/components/common/SpinnerLarge";
import ThemeToggler from "@/components/global/ThemeToggler";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { portalApi } from "@/services/portal";
import type { PortalUserView } from "@/types/portal/api";
import { Alert } from "./Alert";
import { Brand } from "./Brand";
import { BRAND, owedBookHandoffHref } from "./brand";
import { Footer, SkipLink } from "./Footer";
import { Initials } from "./PageHeader";

// Authenticated account shell (UI_SPEC §1): top bar + centered content, no
// rail. Rendered only inside the server-protected (account) layout, which
// admits any signed-in user (APBM007A). Manual QA 20 Nov 2026: the bar shows the
// person's name and a compact store-role badge (Owner / Store admin / Member,
// from tenant_stores on the server); the full email is in the account menu.
//
// Mobile-first: < md the right side collapses to theme toggle + 44px hamburger
// opening the existing left Sheet (Radix: focus trap, Escape, focus return).
export function Shell({
  user,
  children,
}: {
  user: PortalUserView;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Next 16 keeps the old page visible during client navigation; nav clicks go
  // through startTransition and isPending shows the kit spinner in the slot.
  const [isPending, startTransition] = useTransition();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  function navigate(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setDrawerOpen(false);
    startTransition(() => router.push(href));
  }

  // Provider-wide sign-out. A failure is shown as the server words it, with a retry —
  // the page never claims a sign-out it could not confirm.
  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError(null);
    setDrawerOpen(false);
    const r = await portalApi.signOut();
    if (r.ok) {
      router.push("/login");
      router.refresh();
      return;
    }
    setSigningOut(false);
    setSignOutError(r.message);
  }

  const owedBookHref = owedBookHandoffHref();
  const avatarName = user.nameSet === false ? user.email || user.displayName : user.displayName;
  const badge = user.role ? (
    <span className="shrink-0 border border-border px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-muted-foreground" title={user.role.scope} data-testid="nav-role-badge">
      {user.role.label}
      <span className="sr-only"> ({user.role.scope})</span>
    </span>
  ) : null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SkipLink />
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <Brand href="/dashboard" />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Account">
            <a
              href={owedBookHref}
              className="inline-flex h-11 items-center gap-1.5 px-3 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open {BRAND.owedBook}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <ThemeToggler />
            <DropdownMenu>
              <DropdownMenuTrigger
                className="ml-1 inline-flex h-11 items-center gap-2 border border-border px-2.5 pr-3 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-testid="account-menu"
              >
                <Initials name={avatarName} size="sm" />
                <span className="max-w-[12rem] truncate font-medium" title={user.displayName}>{user.displayName}</span>
                {badge}
                <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[14rem]">
                <DropdownMenuLabel className="font-normal">
                  <span className="block truncate text-sm font-semibold">{user.displayName}</span>
                  <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => startTransition(() => router.push("/dashboard"))}>Your account</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => startTransition(() => router.push("/billing"))}>Billing</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={owedBookHref}>Open {BRAND.owedBook}</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void signOut()} data-testid="sign-out">
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggler />
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger
                aria-label="Open account menu"
                className="grid h-11 w-11 place-items-center text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-testid="menu-trigger"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent aria-describedby={undefined}>
                <SheetTitle className="sr-only">Account menu</SheetTitle>
                <div className="border-b border-border p-4 pr-14">
                  <Brand href="/dashboard" />
                </div>
                <div className="flex items-center gap-3 border-b border-border p-4">
                  <Initials name={avatarName} />
                  <div className="min-w-0">
                    <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground"><span className="truncate">{user.displayName}</span>{badge}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <nav className="flex flex-col px-4 py-2" aria-label="Account">
                  <Link href="/dashboard" onClick={(e) => navigate(e, "/dashboard")} className="flex min-h-[44px] items-center text-sm font-medium text-foreground">
                    Your account
                  </Link>
                  <Link href="/billing" onClick={(e) => navigate(e, "/billing")} className="flex min-h-[44px] items-center text-sm font-medium text-foreground">
                    Billing
                  </Link>
                  <a href={owedBookHref} className="flex min-h-[44px] items-center text-sm font-medium text-foreground">
                    Open {BRAND.owedBook}
                  </a>
                  <button type="button" onClick={() => void signOut()} className="flex min-h-[44px] items-center text-left text-sm font-medium text-muted-foreground hover:text-foreground">
                    Sign out
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {signingOut || signOutError ? (
        <div className="mx-auto w-full max-w-6xl px-5 pt-4" data-testid="sign-out-status">
          {signOutError ? (
            <Alert
              tone="destructive"
              title="Sign-out didn't finish"
              action={
                <Button type="button" variant="outline" onClick={() => void signOut()} data-testid="sign-out-retry">
                  Try again
                </Button>
              }
            >
              {signOutError}
            </Alert>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Signing out…
            </p>
          )}
        </div>
      ) : null}
      <main id="main" tabIndex={-1} className="w-full flex-1 focus:outline-none">
        {isPending ? (
          // Operator's kit spinner by explicit direction (Rule Zero-B exception
          // logged — hardcoded palette colors live inside it).
          <div className="grid min-h-[60vh] place-items-center">
            <SpinnerLarge />
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  );
}
