# Director instructions: SCRATCH reuse, S-1 template, S-3 exception, and the automated-authentication amendment (24 November 2026, Asia/Dhaka, received about 14:10)

Preserved verbatim by the Engineer as received in one Claude Code message, which carried two pasted instructions; the second amends the first. The template HTML block is also saved byte for byte at `EVIDENCE/E2/email/DEV_MAGIC_LINK_TEMPLATE_ORIGINAL.html`.

## Instruction 1

```
Continue the current ABM007_FINAL E2 session.

DIRECTOR RULING — SCRATCH REUSE
Tony explicitly authorizes reuse of the existing APBM007B SCRATCH
environment, identities and fixtures for:
- Remaining E2 engineering checks.
- Subsequent independent Q1/Q2 QA.

Identify the existing fixture accounts and approved local credential
mechanism from the APBM007B records. Verify the resolved backend is
SCRATCH before signing in. Do not print credentials or tokens.

Use existing supported sign-in methods. If a Director inbox action is
required, give Tony one precise instruction and wait for that action.
Do not receive emailed links/codes or mint sessions with a service key.

This authorization does not permit DEV-backed testing, fixture resets,
new accounts, purchases or unrelated business-data changes. Preserve
the existing restrictions on those effects.

Document the reusable SCRATCH setup and non-secret credential-file
location in the QA handoff so Cody can use it too. Never package
credentials or authenticated browser state.

S-1 — ORIGINAL DEV MAGIC LINK TEMPLATE
The following is the exact original HTML Tony supplied to the Architect.
Save it as the original baseline. Prepare the amended copy and diff,
changing only the heading's visible text from Cyber Pharma to
Pharmacy Books. Preserve all other bytes where practical, including
URLs, branches, TokenHash, type=email and &amp;.

Original subject: Your Cyber Pharma sign-in link
Prepared subject: Your Pharmacy Books sign-in link
Prepared SMTP display name: Pharmacy Books
SMTP address remains no-reply@cyberizedev.com.

Do not apply dashboard changes.

--- BEGIN ORIGINAL HTML ---
(saved byte for byte as EVIDENCE/E2/email/DEV_MAGIC_LINK_TEMPLATE_ORIGINAL.html)
--- END ORIGINAL HTML ---

S-3 — NARROW LOGO EXCEPTION
Apply the proposed one-line correction in:
src/components/portal/references/EmailPreview.tsx

Replace the old logo URL with:
/brand/pharmacy-books-logo-primary.png

On that same image, replace w-7 with w-auto while retaining h-7,
so the approved rectangular asset is not distorted.

This prompt authorizes that exact exception only. Do not delete the
module or expand the edit. Record the exception and verify AC-N02.

REMAINING WORK
Complete the actual signed-in checks, per-role Help checks and redirect
reproduction under the existing contract. Harness markup alone is not
signed-in route evidence.

Update the stop register, acceptance ledger, verification records,
engineering handoff and exact staging lists. Run affected checks after
the final source change and issue an updated integrity-checked review
package.

Tony retains all Git mutations. No dashboard writes or deployment.
Independent QA verdicts remain with Friday.

The future OwedBook beta deployment is separate planning work:
do not change deployment files, URLs or callbacks for beta in this E2.

Return E2 COMPLETE only when all engineering obligations are met;
otherwise name the exact remaining blocker and the smallest action
Tony needs to take.
```

## Instruction 2 (amends instruction 1)

```
Amend the previous SCRATCH instruction.

Engineering and independent QA must not depend on Tony's inbox.
Establish reusable automated authentication for the existing SCRATCH
fixture accounts.

Prefer existing fixture credentials and the normal sign-in flow.
If those are unavailable, this narrowly scoped exception permits
provider-supported test-session establishment using the SCRATCH
privileged credential, solely for designated existing fixture users.

Before privileged authentication:
- Verify the backend is the designated SCRATCH target.
- Fail closed for DEV, alpha or any unrecognized target.
- Restrict users to an explicit fixture allowlist.
- Keep privileged credentials server-side in the test tooling.
- Never log or package credentials, sign-in tokens or session state.

Do not create a production authentication bypass, change application
guards, modify DEV users, send emails, reset fixture passwords or
change business data.

Keep this tooling separate from production code. Document its setup
and limits for independent QA. If a new tooling path needs permission,
propose the exact path and purpose.

This exception supersedes the earlier prohibition on service-key
test-session establishment only within the verified SCRATCH boundary.

Automated authentication proves authenticated application behavior.
It does not prove email delivery, magic-link lifecycle or the real
cross-app handoff. Keep those checks separately identified.

Complete E2 without Director inbox participation. If blocked, report
the technical blocker and a concrete proposed remedy.
```
