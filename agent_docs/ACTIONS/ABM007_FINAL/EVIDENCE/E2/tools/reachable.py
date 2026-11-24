"""Static import reachability from every file under src/app (Next.js entry points). Usage: python3 -I reachable.py <repo>
Prints unreachable source files under src/components, src/services, src/lib, src/utils, src/store, src/types."""
import os, re, sys
root = os.path.abspath(sys.argv[1]); src = os.path.join(root, "src")
IMP = re.compile(r"""(?:import|export)\s[^'"]*?from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|^\s*import\s+['"]([^'"]+)['"]""", re.M)
def resolve(base, spec):
    if spec.startswith("@/"): p = os.path.join(src, spec[2:])
    elif spec.startswith("."): p = os.path.normpath(os.path.join(os.path.dirname(base), spec))
    else: return None
    for c in [p, p + ".ts", p + ".tsx", os.path.join(p, "index.ts"), os.path.join(p, "index.tsx")]:
        if os.path.isfile(c): return c
    return None
allf = [os.path.join(d, f) for d, _, fs in os.walk(src) for f in fs if f.endswith((".ts", ".tsx")) and "__tests__" not in d]
seen, stack = set(), [f for f in allf if f.startswith(os.path.join(src, "app") + os.sep)] + [f for f in allf if os.path.basename(f) in ("proxy.ts", "middleware.ts", "instrumentation.ts")]
while stack:
    f = stack.pop()
    if f in seen: continue
    seen.add(f)
    for m in IMP.finditer(open(f, encoding="utf-8").read()):
        r = resolve(f, next(g for g in m.groups() if g))
        if r and r not in seen: stack.append(r)
un = sorted(os.path.relpath(f, root) for f in allf if f not in seen)
print("\n".join(un)); print(f"UNREACHABLE {len(un)}", file=sys.stderr)
