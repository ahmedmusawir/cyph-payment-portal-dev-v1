# Deployed alpha phone observation and local candidate comparison

Source for the phone observation: Tony, Director, unplanned action, relayed 26 November about 09:11 BDT. The full Director wording and JARVIS's provenance qualifications remain in DIRECTOR_WALKTHROUGH_FILLED.md under “Director rework requests and supplemental observations.” Older deployed alpha builds, iPhone 13, iOS 27.0.1. Exact deployed build IDs, browser/version and screenshot time basis were not established. The device About image and raw alpha images are excluded. No Android or candidate real-phone test was performed. HC-03 stays removed.

Tony observed Add store extending beyond the viewport on the alpha billing/subscription screen and horizontal movement on touch. He also observed dropdowns behaving normally on that iPhone. This is supplemental alpha evidence only.

The candidate's existing automated Owner A Portal /billing measurements at 375px did **not** show the same page overflow. The rendered /stores/add link was present in each of the three rows. Each returned HTTP 200 and reported document scrollWidth minus innerWidth = 0 px.

| Candidate browser | Saved local time, 24 November (BDT) | Evidence |
|---|---|---|
| Chromium 147.0.7727.15 | 18:49:48 | ../02/0578.json |
| Firefox 148.0.2 | 18:56:41 | ../02/0690.json |
| WebKit 26.4 | 19:00:54 | ../02/0777.json |

These are 375px desktop-engine emulations on the bound QA Portal, against SCRATCH. The page-width instrument does not record the Add link's individual bounds or exercise real iPhone behavior. The candidate measurements answer the reported page overflow only for the measured conditions. The separate Chrome-emulation dropdown displacement is unresolved and the 768px Portal sign-in feedback remains in F27.
