/**
 * ABM007_FINAL AC-B04 (unit part) / D-01: light is forced. The root layout ships no "dark" class on <html>, forces
 * next-themes to light and ignores the system preference, whatever a saved localStorage.theme says. The rendered
 * first-paint check with localStorage.theme = "dark" and a dark OS is the browser part of AC-B04.
 */
import type { ReactElement, ReactNode } from "react";

jest.mock("next/font/google", () => ({ Inter: () => ({ className: "font-inter", variable: "font-brand-var" }) }));
jest.mock("@/components/ui/toaster", () => ({ Toaster: () => null }));
jest.mock("@/app/globals.scss", () => ({}));

import RootLayout from "@/app/layout";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

type El = ReactElement<{ className?: string; children?: ReactNode; [k: string]: unknown }>;

function findByType(node: ReactNode, type: unknown): El | null {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const n of node) { const f = findByType(n, type); if (f) return f; }
    return null;
  }
  const el = node as El;
  if (el.type === type) return el;
  return findByType(el.props?.children, type);
}

describe("ABM007_FINAL forced light (D-01, AC-B04 unit part)", () => {
  const tree = RootLayout({ children: <div /> }) as El;

  it("ships no dark class on <html>", () => {
    expect(tree.type).toBe("html");
    expect(String(tree.props.className ?? "").split(/\s+/)).not.toContain("dark");
  });

  it("forces next-themes to light and ignores the system preference", () => {
    const provider = findByType(tree, ThemeProvider);
    expect(provider).not.toBeNull();
    expect(provider!.props.forcedTheme).toBe("light");
    expect(provider!.props.defaultTheme).toBe("light");
    expect(provider!.props.enableSystem).toBe(false);
  });

  it("uses Inter through next/font as the brand font variable", () => {
    expect(String(tree.props.className)).toContain("font-brand-var");
  });
});
