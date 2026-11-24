/**
 * ABM007_FINAL AC-B01 pin: the light :root token block in src/app/globals.scss matches
 * agent_docs/ACTIONS/ABM007_FINAL/DESIGN/tokens/abm007_final_tokens.css (Portal repository) declaration for
 * declaration, in order. Brand anchors keep their full-precision triplets; aliases keep their var() references.
 * This pin is not the proof of color: the rendered check resolves the tokens in a browser.
 */
import { readFileSync } from "fs";
import { join } from "path";

const EXPECTED: [string, string][] = [
  ["--brand-navy", "210.3157894737 69.3430656934% 26.862745098%"],
  ["--brand-green", "168.3185840708 53.0516431925% 41.7647058824%"],
  ["--brand-green-dark", "168.2608695652 53.488372093% 33.7254901961%"],
  ["--brand-ice", "206.25 61.5384615385% 94.9019607843%"],
  ["--brand-charcoal", "100 2.6086956522% 22.5490196078%"],
  ["--brand-gray", "0 0% 31.7647058824%"],
  ["--brand-green-hover", "168.4337349398 53.5483870968% 30.3921568627%"],
  ["--brand-navy-deep", "210 69% 19%"],
  ["--brand-navy-deeper", "210 70% 13%"],
  ["--shadow-tint", "210 69% 15%"],
  ["--background", "var(--brand-ice)"],
  ["--foreground", "var(--brand-charcoal)"],
  ["--card", "0 0% 100%"],
  ["--card-foreground", "var(--brand-charcoal)"],
  ["--popover", "0 0% 100%"],
  ["--popover-foreground", "var(--brand-charcoal)"],
  ["--primary", "var(--brand-green-dark)"],
  ["--primary-foreground", "0 0% 100%"],
  ["--primary-hover", "var(--brand-green-hover)"],
  ["--secondary", "var(--brand-ice)"],
  ["--secondary-foreground", "var(--brand-navy)"],
  ["--muted", "var(--brand-ice)"],
  ["--muted-foreground", "var(--brand-gray)"],
  ["--accent", "var(--brand-ice)"],
  ["--accent-foreground", "var(--brand-navy)"],
  ["--heading", "var(--brand-navy)"],
  ["--navbar", "var(--brand-navy)"],
  ["--navbar-foreground", "0 0% 100%"],
  ["--border", "206 45% 88%"],
  ["--input", "var(--brand-gray)"],
  ["--ring", "var(--brand-navy)"],
  ["--ring-on-dark", "0 0% 100%"],
  ["--disabled", "206 25% 90%"],
  ["--disabled-foreground", "var(--brand-gray)"],
  ["--destructive", "2 67% 40%"],
  ["--destructive-foreground", "0 0% 100%"],
  ["--success", "131 54% 34%"],
  ["--success-foreground", "0 0% 100%"],
  ["--warning", "41 93% 32%"],
  ["--warning-foreground", "0 0% 100%"],
  ["--info", "214 74% 50%"],
  ["--info-foreground", "0 0% 100%"],
  ["--chart-1", "var(--destructive)"],
  ["--chart-2", "var(--info)"],
  ["--chart-3", "var(--success)"],
  ["--chart-4", "var(--brand-navy)"],
  ["--chart-5", "var(--brand-green)"],
  ["--role-superadmin", "var(--brand-navy)"],
  ["--role-superadmin-foreground", "0 0% 100%"],
  ["--role-admin", "var(--brand-navy)"],
  ["--role-admin-foreground", "0 0% 100%"],
  ["--role-member", "var(--brand-navy)"],
  ["--role-member-foreground", "0 0% 100%"],
  ["--radius-sm", "4px"],
  ["--radius-md", "8px"],
  ["--radius-tile", "12px"],
  ["--radius-lg", "14px"],
  ["--radius-xl", "16px"],
  ["--radius", "14px"],
];

function lightRootDeclarations(): [string, string][] {
  const css = readFileSync(join(process.cwd(), "src/app/globals.scss"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const start = css.indexOf(":root {");
  expect(start).toBeGreaterThan(-1);
  const block = css.slice(start, css.indexOf("}", start));
  return Array.from(block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)).map((m) => [m[1], m[2].trim()]);
}

describe("ABM007_FINAL token pin (AC-B01)", () => {
  it("installs the token file's :root block unchanged", () => {
    expect(lightRootDeclarations()).toEqual(EXPECTED);
  });

  it("keeps the exact anchors: no whole-number rounding of the brand triplets", () => {
    const map = new Map(lightRootDeclarations());
    expect(map.get("--brand-green-dark")).toBe("168.2608695652 53.488372093% 33.7254901961%");
    expect(map.get("--brand-navy")).toBe("210.3157894737 69.3430656934% 26.862745098%");
    expect(map.get("--primary")).toBe("var(--brand-green-dark)");
    // Control: the rounded triplet that resolves to #298572 (Architect A-01) must not be what is installed.
    expect(map.get("--brand-green-dark")).not.toBe("168 53% 34%");
  });
});
