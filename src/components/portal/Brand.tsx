import Link from "next/link";
import Image from "next/image";
import { BRAND } from "./brand";

/** The logo master in its white 12px tile (brand contract 4.5), scaled whole, never cropped. */
export function LogoTile({ height = 26 }: { height?: number }) {
  const width = Math.round((height * BRAND.logoWidth) / BRAND.logoHeight);
  return (
    <span className="pb-logo-tile" data-testid="brand-logo-tile">
      <Image src={BRAND.logoSrc} alt="" width={width} height={height} priority unoptimized />
    </span>
  );
}

// ABM007_FINAL: logo tile plus live wordmark "Pharmacy Books" with "Account & Billing" beneath (LOGO_ASSET_SPEC 3).
// tone "dark" sits on the navy bar; tone "light" on white (the mobile drawer).
export function Brand({ href, tone = "dark" }: { href: string; tone?: "dark" | "light" }) {
  const name = tone === "dark" ? "text-navbar-foreground" : "text-heading";
  const sub = tone === "dark" ? "text-brand-ice" : "text-muted-foreground";
  return (
    <Link href={href} className="flex min-h-[44px] min-w-0 items-center gap-2.5 rounded-md" aria-label={`${BRAND.name} — home`}>
      <LogoTile />
      <span className="min-w-0 leading-tight">
        <span className={`block truncate text-base font-semibold ${name}`}>{BRAND.name}</span>
        <span className={`block truncate text-xs ${sub}`}>{BRAND.subline}</span>
      </span>
    </Link>
  );
}
