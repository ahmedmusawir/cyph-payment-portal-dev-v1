# Friday, QA Lead — 27 November 2026, Asia/Dhaka

Sections 3–5 transcribed from the adjudication the Director supplied verbatim in conversation.

## 3. The five criteria that failed in Q2

| Criterion | Q2 | Q4, my ruling | Why |
|---|---|---|---|
| AC-B05, corners and shadows | FAIL | **PASS** | Repaired controls measure 8px corners. The 31 "round surface" flags are one pill-shaped element on three Account & Billing pages for the Store admin; pills are round by contract. Named at the next retest for the record |
| AC-B06, buttons and their states | FAIL | **PASS** | Login busy state correct in all six runs. Resized controls measure 44px. The first pharmacy-row probe counted hidden duplicate controls and is an instrument error; the corrected probe passed 15 of 16, and the sixteenth timed out |
| AC-B07, link rules | FAIL | **FAIL, one item** | Profile support link correct in 22 of 22. New finding F36: the Help end-of-text link is green directly on the light blue page |
| AC-B08, contrast | FAIL | **FAIL, one item** | Disabled Profile fields now 6.24 to 1 at worst. F36 measures 4.04 to 1 against 4.5 |
| AC-L04, phone-width behavior | FAIL | **PASS** | No sideways overflow at any completed position. The 768 header and footer fit. The Director passed W-03 and W-07. The real phone stays at Gate D |

Also closed in Q4: AC-L02 **PASS** (mock build table fills 990 of 992 pixels at 1440 and stacks into 25 cards with no overflow at 375). AC-R05 public plan prices **PASS** ($99.00 and $49.00 as rendered). AC-F02 stays **PASS** (six of the seven extra Firefox routes completed, none reached the Account & Billing sign-in page; the seventh lost its browser).

## 4. The Director's walkthrough

Eight of eight **PASS**. W-04 to W-08 are recorded from the Architect's report with the Director's words. W-01 to W-03 are the Director's direct confirmation to me on 27 November at about 10:15; the Architect's record had lost those three answers. I accept all eight. Per-check details and most times were not captured, and the record says so.

Lesson for the playbook: the filled sheet is saved after every check, so a lost conversation cannot lose results.

## 5. Findings and open rows, decided

| Item | My disposition |
|---|---|
| F36, faint Help end link | **Product defect**, introduced by add-on A1-2. Fixed by A2-1 below |
| F33, F34, F35 | Follow-up findings outside this module. Owner: the Architect |
| F22, three pages that timed out in Q2 | All three loaded normally in Q4 with full capture. Not reproduced. **Closed** |
| F20, fixture sign-in setup timeouts | Seen again once. Test environment, cause still unknown. **Closed for this module** with the captured detail; flagged to the Architect |
| Core regression, three first-attempt failures | The probe read pages before their data arrived. The settled reads passed. Instrument timing. First failures kept |
| Text contrast "1 to 1" on the Invitations and Invite pages | Not a real result. A ratio of exactly 1 means the text was not on screen when sampled, and the same pages pass at neighbouring widths. **Instrument timing; re-measured once at the next retest** |
| Three low samples on the header in Firefox, one position | The instrument marked those pixels unstable. Every other header sample passes. **Instrument; re-measured once** |
| Focus outline samples with one edge missing | **Not decided from numbers alone.** Most look like the control sitting at the edge of the window when sampled. Checked properly under A2-2 below |
| No pure Member test account | The Member account was removed in Q2 as planned, so Member-only screens were not retested. The repaired pieces are shared by all roles and passed for Owner and Store admin. **Accepted limit.** Lesson: keep a spare Member fixture |
| Later record changes in the Account & Billing working tree | A changelog entry and a session log were written after the tested copy was pinned. Records only. Resolved by the fresh manifests in the next round |
