import { BRAND, LEGAL, NOT_CONFIGURED } from "./brand";

// tone "dark": on PublicShell's navy backdrop (ice text, light links); default: on the ice page.
export function Footer({ tone = "page" }: { tone?: "page" | "dark" }) {
  const dark = tone === "dark";
  return (
    <footer className={dark ? "mt-6" : "mt-10 border-t border-border"}>
      <div className={`mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-[13px] sm:flex-row sm:items-center sm:justify-between ${dark ? "text-brand-ice" : "text-muted-foreground"}`}>
        <p>{BRAND.footer}</p>
        <p className="flex flex-wrap gap-x-5 gap-y-2">
          <span>Support · <a className={dark ? "pb-link-on-dark" : "pb-link-on-page"} href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a></span>
          {LEGAL.termsUrl ? <a className={dark ? "pb-link-on-dark" : "pb-link-on-page"} href={LEGAL.termsUrl}>Terms</a> : <span>Terms {NOT_CONFIGURED}</span>}
          {LEGAL.privacyUrl ? <a className={dark ? "pb-link-on-dark" : "pb-link-on-page"} href={LEGAL.privacyUrl}>Privacy</a> : <span>Privacy {NOT_CONFIGURED}</span>}
        </p>
      </div>
    </footer>
  );
}

// Shown fixed over the top 12px of the page, which is the navy header or backdrop in both reachable shells (Shell,
// PublicShell), so its focus ring is the on-dark one.
export function SkipLink() {
  return (
    <a
      href="#main"
      className="pb-on-dark sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
    >
      Skip to content
    </a>
  );
}
