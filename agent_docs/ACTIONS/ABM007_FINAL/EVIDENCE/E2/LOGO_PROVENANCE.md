# Logo provenance and export commands (AC-N02; LOGO_ASSET_SPEC 3; ruling AM-08 (2))

| Item | Value |
|---|---|
| Source | The pack's copy `agent_docs/ACTIONS/ABM007_FINAL/DESIGN/assets/Pharmacy-Books-Logo-Primary.png` (Architect-supplied with review 01). No other copy fetched |
| Source SHA-256 | `e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd` (321,101 bytes, 1024 x 543 RGBA) |
| Placed | 24 Nov 2026, byte for byte with `cp`, as `public/brand/pharmacy-books-logo-primary.png` in both repositories |
| Hash after placing | `e7e5d357…3293afd` in both (checked with `sha256sum`) |
| Rule applied | Whole-image scaling of the **full 1024 x 543 canvas** (no trimming, no crop, ruling AM-08 (2)), centred on an opaque white square. Small-size legibility accepted by the same ruling |

## Derived files (identical bytes in both repositories, `src/app/`)

| File | Size (px) | Bytes | SHA-256 |
|---|---|---|---|
| `icon.png` | 512 x 512, RGB | 62,585 | `04d61e4cc210650bf122b4c3f0d46157d947c30638105c81f11078f2aec755bd` |
| `apple-icon.png` | 180 x 180, RGB | 9,298 | `c9f664aebbf9a532391623df749d20e43af78cc60b32fde993d3a0d1387a5f14` |
| `favicon.ico` | 16, 32, 48 frames, RGBA (opaque) | 3,471 | `667f09562c76c51dc86c94d3f419edc057e9d708720ae38dcb1e64a36fdd341f` |

`icon.png` replaces the old file in both apps; `apple-icon.png` is new in both; `favicon.ico` is new in OwedBook and replaces the old one in the Portal.

## Exact command

```
python3 -I agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/logo/make_icons.py \
  agent_docs/ACTIONS/ABM007_FINAL/DESIGN/assets/Pharmacy-Books-Logo-Primary.png <out_dir>
cp <out_dir>/{icon.png,apple-icon.png,favicon.ico} <repo>/src/app/
```

The script (in this folder) refuses to run if the master hash differs, asserts the 1024 x 543 size, scales with Lanczos to fit the square and pads with white. Pillow 10.2.0. A first version wrote RGB frames into the `.ico`, which Next.js 16 refused at build ("The PNG is not in RGBA format"); the script was corrected to write opaque RGBA frames and the three files regenerated. `icon.png` and `apple-icon.png` came out byte-identical both times.

## Use in the apps

Rendered with `next/image` (unoptimized, so the served file is the master itself) inside the white 12px tile (`.pb-logo-tile`): OwedBook `BrandMark`/`LogoTile` (navbar, landing header, auth masthead, Help masthead, invitations header); Portal `Brand`/`LogoTile` (both shells, mastheads). Stripe logo and icon: the master and `icon.png` (see `PREPARED_EXTERNAL_VALUES.md`).
