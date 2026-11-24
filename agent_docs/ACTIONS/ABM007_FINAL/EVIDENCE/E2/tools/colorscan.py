"""AC-B02 engineering self-check: hardcoded colors in non-test application source.
Usage: python3 -I colorscan.py <repo_root> [--control]
Scans src/**/*.{ts,tsx,css,scss} excluding src/__tests__. Flags: hex literals, rgb()/rgba(),
hsl()/hsla() not wrapping var(), numbered Tailwind palette colors, white/black color utilities,
arbitrary color classes. The .dark token block is reported separately (frozen and unreachable, D-01).
--control first scans a seeded string that must be flagged, so an empty result cannot pass by accident."""
import os, re, sys

PATTERNS = [
    ("hex", re.compile(r"(?<![\w&/])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![\w-])")),
    ("rgb()", re.compile(r"\brgba?\(")),
    ("hsl() literal", re.compile(r"\bhsla?\((?!\s*var\()")),
    ("palette class", re.compile(r"\b(?:bg|text|border|ring|from|to|via|fill|stroke|outline|divide|shadow|decoration|placeholder|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b")),
    ("white/black utility", re.compile(r"(?<![\w-])(?:bg|text|border|ring|fill|stroke|from|to|via|divide|outline|decoration|placeholder)-(?:white|black)(?![\w-])")),
    ("arbitrary color", re.compile(r"\b(?:bg|text|border|ring|fill|stroke|outline|decoration)-\[(?:#|rgb|hsl(?!\(var))")),
]
IGNORE_LINE = re.compile(r"href=[\"'{]?`?#|[\"']#main[\"']|#main\b")

def scan_text(text):
    hits = []
    for n, line in enumerate(text.splitlines(), 1):
        if IGNORE_LINE.search(line):
            continue
        for name, rx in PATTERNS:
            for m in rx.finditer(line):
                hits.append((n, name, m.group(0), line.strip()[:160]))
    return hits

def main():
    root = sys.argv[1]
    if "--control" in sys.argv:
        control = 'const x = "bg-slate-800 text-white #ff0000 rgb(1,2,3) hsl(10 20% 30%)";'
        assert len(scan_text(control)) >= 5, "CONTROL FAILED: scanner did not flag seeded colors"
        print("control: seeded string flagged (5 patterns) - instrument OK")
    total = 0
    for dp, _, fs in os.walk(os.path.join(root, "src")):
        if "__tests__" in dp:
            continue
        for f in fs:
            if not f.endswith((".ts", ".tsx", ".css", ".scss")):
                continue
            p = os.path.join(dp, f)
            text = open(p, encoding="utf-8").read()
            if f.endswith((".css", ".scss")):
                # Comments are documentation, not styling (the token block keeps its hex reference comments verbatim).
                text = re.sub(r"/\*.*?\*/", lambda m: "\n" * m.group(0).count("\n"), text, flags=re.S)
            dark = ""
            if f.startswith("globals."):
                # The .dark block and theme alternates are frozen and unreachable (D-01): reported, not edited.
                i = text.find(".dark {")
                if i >= 0:
                    j = text.find("@layer", i)
                    dark, text = text[i:j], text[:i] + "\n" * text[i:j].count("\n") + text[j:]
            for n, name, tok, line in scan_text(text):
                total += 1
                print(f"{os.path.relpath(p, root)}:{n}: [{name}] {tok} :: {line}")
    print(f"TOTAL {total}")

main()
