"""ABM007_FINAL derived icons. Rules: LOGO_ASSET_SPEC section 2 and ruling AM-08 (2).
Only whole-image scaling of the FULL 1024x543 canvas (no trim, no crop) and padding with
white onto a square canvas, centred. Usage: python3 -I make_icons.py <master.png> <out_dir>"""
import hashlib, sys
from PIL import Image

master, out = sys.argv[1], sys.argv[2]
EXPECTED = "e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd"
assert hashlib.sha256(open(master, "rb").read()).hexdigest() == EXPECTED, "master hash mismatch: stop"
src = Image.open(master).convert("RGBA")
assert src.size == (1024, 543)

def square(size: int) -> Image.Image:
    scale = size / max(src.size)                      # fit the whole canvas
    w, h = round(src.width * scale), round(src.height * scale)
    art = src.resize((w, h), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    canvas.alpha_composite(art, ((size - w) // 2, (size - h) // 2))
    return canvas  # RGBA, fully opaque white padding (favicon.ico frames must be RGBA for Next.js)

square(512).convert("RGB").save(f"{out}/icon.png", optimize=True)
square(180).convert("RGB").save(f"{out}/apple-icon.png", optimize=True)
square(48).save(f"{out}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("ok")
