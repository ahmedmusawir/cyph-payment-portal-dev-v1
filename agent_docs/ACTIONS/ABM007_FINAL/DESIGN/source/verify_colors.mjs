// ABM007_FINAL — verifies the colors the token stylesheet actually resolves to in a browser,
// and computes WCAG contrast from those resolved colors (not from nominal hex).
// Includes controls that MUST fail, to show the instrument can fail.
// Usage: node verify_colors.mjs <DESIGN dir>      Exit code 1 if any row disagrees with its expectation.
import { createRequire } from "node:module";
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
const { chromium } = createRequire(import.meta.url)("/opt/npm-tools/node_modules/playwright");
const D = process.argv[2];
const css = readFileSync(join(D, "tokens/abm007_final_tokens.css"), "utf8");

const APPROVED = { "brand-navy": "#154474", "brand-green": "#32A38D", "brand-green-dark": "#288472", "brand-ice": "#EAF3FA",
  "brand-charcoal": "#393B38", "brand-gray": "#515151", "brand-green-hover": "#247767" };
const TOKENS = [...css.matchAll(/^\s*--([a-z0-9-]+):\s*([^;]+);/gm)].map((m) => m[1]).filter((t) => !t.startsWith("radius"));
// Raw CSS colors resolved alongside the tokens: the rounded triplet from review package 01 (control).
const RAW = { "ctl-rounded-green": "hsl(168 53% 34%)", "white": "hsl(0 0% 100%)" };

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<style>${css}</style><body></body>`);
const resolved = await page.evaluate(({ TOKENS, RAW }) => {
  const out = {};
  const probe = (name, value) => { const d = document.createElement("div"); d.style.backgroundColor = value; document.body.appendChild(d);
    out[name] = getComputedStyle(d).backgroundColor; };
  for (const t of TOKENS) probe(t, `hsl(var(--${t}))`);
  for (const [k, v] of Object.entries(RAW)) probe(k, v);
  return out;
}, { TOKENS, RAW });
await browser.close();

const rgb = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) throw new Error("unparsed color: " + s); return m[1].split(/[, /]+/).slice(0, 3).map(Number); };
const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, alpha, bg) => fg.map((v, i) => v * alpha + bg[i] * (1 - alpha)); // browser-style source-over, unrounded
const C = Object.fromEntries(Object.entries(resolved).map(([k, v]) => [k, rgb(v)]));
const tint = (t) => over(C[t], 0.1, C.card);

const lines = [];
let bad = 0;
lines.push("ABM007_FINAL color verification — resolved in Chromium from DESIGN/tokens/abm007_final_tokens.css");
lines.push("Method: each token is applied as hsl(var(--token)) to an element; getComputedStyle gives the color the browser renders.");
lines.push("Contrast is WCAG 2.x relative luminance computed from those resolved colors. Composites are source-over on the named base.");
lines.push("This verifies color values and declared pairs. It is not a measurement of every rendered screen (that is AC-B08, independent QA).");
lines.push("");
lines.push("== 1. Approved anchors resolve to the exact approved hex ==");
for (const [t, want] of Object.entries(APPROVED)) { const got = hex(C[t]); const ok = got === want; if (!ok) bad++;
  lines.push(`${ok ? "OK  " : "BAD "} --${t}  resolved ${resolved[t]} = ${got}  approved ${want}`); }
lines.push("");
lines.push("== 2. Every color token, as resolved ==");
for (const t of TOKENS) lines.push(`--${t}  ${resolved[t]}  ${hex(C[t])}`);
lines.push("");
lines.push("== 3. Declared pairs (expect PASS) ==");
const P = (label, fg, bg, min) => ({ label, fg, bg, min, expect: true });
const X = (label, fg, bg, min) => ({ label, fg, bg, min, expect: false });
const rows = [
  P("Primary button: white text on --primary", C.white, C.primary, 4.5),
  P("Primary button hover: white text on --primary-hover", C.white, C["primary-hover"], 4.5),
  P("Link: --primary text on white card", C.primary, C.card, 4.5),
  P("Link on navy header: ice text on --navbar", C["brand-ice"], C.navbar, 4.5),
  P("Header text: white on --navbar", C.white, C.navbar, 4.5),
  P("Masthead text: ice on gradient end --brand-navy-deep", C["brand-ice"], C["brand-navy-deep"], 4.5),
  P("Backdrop footer: ice on --brand-navy-deeper", C["brand-ice"], C["brand-navy-deeper"], 4.5),
  P("Active header item: white on (white 14% over navy)", C.white, over(C.white, 0.14, C.navbar), 4.5),
  P("Body text: --foreground on white card", C.foreground, C.card, 4.5),
  P("Body text: --foreground on ice page", C.foreground, C.background, 4.5),
  P("Labels: --muted-foreground on white card", C["muted-foreground"], C.card, 4.5),
  P("Labels: --muted-foreground on ice page", C["muted-foreground"], C.background, 4.5),
  P("Table head: --muted-foreground on --muted", C["muted-foreground"], C.muted, 4.5),
  P("Headings: --heading on white card", C.heading, C.card, 4.5),
  P("Headings and navy link: --heading on ice page", C.heading, C.background, 4.5),
  P("Disabled button: --disabled-foreground on --disabled", C["disabled-foreground"], C.disabled, 4.5),
  P("Status text on white: --destructive", C.destructive, C.card, 4.5),
  P("Status text on white: --success", C.success, C.card, 4.5),
  P("Status text on white: --warning", C.warning, C.card, 4.5),
  P("Status text on white: --info", C.info, C.card, 4.5),
  P("Pill/notice text: --foreground on success tint (10% over white)", C.foreground, tint("success"), 4.5),
  P("Pill/notice text: --foreground on warning tint", C.foreground, tint("warning"), 4.5),
  P("Pill/notice text: --foreground on destructive tint", C.foreground, tint("destructive"), 4.5),
  P("Pill/notice text: --foreground on info tint", C.foreground, tint("info"), 4.5),
  P("Outline button text: --heading on ice hover surface", C.heading, C.accent, 4.5),
  P("Destructive outline button: --destructive text on (destructive 10% over white)", C.destructive, tint("destructive"), 4.5),
  P("Non-text: field border --input against white", C.input, C.card, 3),
  P("Non-text: focus ring --ring against white", C.ring, C.card, 3),
  P("Non-text: focus ring --ring against ice page", C.ring, C.background, 3),
  P("Non-text: focus ring --ring-on-dark against --navbar", C["ring-on-dark"], C.navbar, 3),
  P("Non-text: primary button edge against white", C.primary, C.card, 3),
  P("Non-text: primary button edge against ice page", C.primary, C.background, 3),
  P("Non-text: status border --success against white", C.success, C.card, 3),
  P("Non-text: status border --warning against white", C.warning, C.card, 3),
  P("Non-text: status border --info against white", C.info, C.card, 3),
  P("Non-text: step badge --brand-navy against white", C["brand-navy"], C.card, 3),
  P("Large type only: --brand-green on white (3:1 bar)", C["brand-green"], C.card, 3),
];
const controls = [
  X("CONTROL: white text on raw --brand-green (design forbids it)", C.white, C["brand-green"], 4.5),
  X("CONTROL: rounded triplet hsl(168 53% 34%) from review package 01, white text", C.white, C["ctl-rounded-green"], 4.5),
  X("CONTROL: dark-green link on ice page", C.primary, C.background, 4.5),
  X("CONTROL: dark-green link on navy", C.primary, C.navbar, 4.5),
  X("CONTROL: old hover, white on (primary 90% over white)", C.white, over(C.primary, 0.9, C.card), 4.5),
  X("CONTROL: old disabled, white on (primary 50% over white)", C.white, over(C.primary, 0.5, C.card), 4.5),
  X("CONTROL: --success status text on ice page", C.success, C.background, 4.5),
  X("CONTROL: --warning status text on ice page", C.warning, C.background, 4.5),
  X("CONTROL: --info status text on ice page", C.info, C.background, 4.5),
  X("CONTROL: design ice hairline against white (non-text 3:1)", C["brand-ice"], C.card, 3),
  X("CONTROL: proposed --border hairline against white (decorative; not relied on)", C.border, C.card, 3),
];
const emit = (r) => { const v = ratio(r.fg, r.bg); const pass = v >= r.min; const ok = pass === r.expect; if (!ok) bad++;
  lines.push(`${ok ? "OK  " : "BAD "} ${v.toFixed(3)}:1  need ${r.min}  ${pass ? "passes" : "fails"}  | ${r.label}  [${hex(r.fg)} on ${hex(r.bg)}]`); };
rows.forEach(emit);
lines.push("");
lines.push("== 4. Controls (expect FAIL — these show the check can fail) ==");
controls.forEach(emit);
lines.push("");
lines.push(`ctl-rounded-green resolves to ${resolved["ctl-rounded-green"]} = ${hex(C["ctl-rounded-green"])} (approved value is #288472)`);
lines.push("");
lines.push(bad === 0 ? "RESULT: every row matched its expectation." : `RESULT: ${bad} row(s) did NOT match expectation.`);
writeFileSync(join(D, "renders", "COLOR_VERIFICATION.txt"), lines.join("\n") + "\n");
console.log(lines.join("\n"));
process.exit(bad === 0 ? 0 : 1);
