"use client";

import { useLayoutMode } from "./layoutMode";
import { LogoTile } from "./Brand";
import { BRAND } from "./brand";

export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
  titleId,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  meta?: React.ReactNode;
  titleId?: string;
}) {
  const mode = useLayoutMode();
  if (mode !== "translated") {
    // ABM007_FINAL masthead (literal pages and the Add Pharmacy panel): eyebrow row with the brand left and the
    // page's context right, the logo tile beside the headline, one description line.
    return (
      <div className="pb-masthead mb-4">
        <div className="pb-eyebrow pb-masthead-text flex flex-wrap justify-between gap-x-3 gap-y-1">
          <span>{BRAND.name}</span>
          <span>{eyebrow}</span>
        </div>
        <div className="mt-3.5 flex min-w-0 items-center gap-4">
          <LogoTile height={40} />
          <h1 id={titleId} className="pb-headline min-w-0 text-[28px] sm:text-[36px]">
            {title}
          </h1>
        </div>
        {lead ? <p className="pb-masthead-text mt-2.5">{lead}</p> : null}
        {meta ? <div className="pb-masthead-text mt-2 text-sm">{meta}</div> : null}
      </div>
    );
  }
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="pb-eyebrow text-muted-foreground">{eyebrow}</p>
        <h1 id={titleId} className="pb-page-title mt-1">
          {title}
        </h1>
        {lead ? <p className="mt-1 text-sm text-muted-foreground">{lead}</p> : null}
      </div>
      {meta ? <div className="shrink-0 text-xs text-muted-foreground">{meta}</div> : null}
    </div>
  );
}


export function RoleLabel({ children }: { children: React.ReactNode }) {
  return <span className="pb-role ml-1">{children}</span>;
}

export function Initials({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const letters = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-full pb-card font-bold text-heading ${size === "sm" ? "h-7 w-7 text-[11px]" : "h-10 w-10 text-xs"}`}>
      {letters}
    </span>
  );
}
