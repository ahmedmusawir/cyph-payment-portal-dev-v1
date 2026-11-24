# DEV Magic Link template: naming amendment (S-1; AM-16; AC-E01 engineering part)

**Prepared, not applied.** No dashboard change. The Director applies it in session S2, after deployment, because the template is shared by localhost and both alpha apps.

| File | Content | SHA-256 |
|---|---|---|
| `DEV_MAGIC_LINK_TEMPLATE_ORIGINAL.html` | The exact original HTML the Director supplied (AM-16), saved byte for byte, ending in one newline | `e311077be3d3677343f58945b626fd713d2e4b05a4ab073493ecb14810b47c23` |
| `DEV_MAGIC_LINK_TEMPLATE_AMENDED.html` | The same bytes with only the heading's visible text changed | `4f4387a6184f5d7adf3dd65a994f5b3d747f06beaedbd9b5cb5237f3b8c431d8` |
| `DEV_MAGIC_LINK_TEMPLATE.diff` | `diff -u` original → amended: one line | — |

```
-<h2>Sign in to Cyber Pharma</h2>
+<h2>Sign in to Pharmacy Books</h2>
```

**Byte proof (checked by script):**
- Every byte after the heading's text is identical between the two files.
- These counts are unchanged:
  - `{{ .TokenHash }}`: 4
  - `&amp;type=email`: 4
  - `{{ if eq .RedirectTo` plus `{{ else if eq .RedirectTo`: 4 branches
  - `{{ else }}` fallback: 1
  - `{{ end }}`: 1
  - links: 4
- The four callback URLs, the no-link fallback sentence and the ignore line are untouched.
- "Cyber Pharma" no longer appears.

| Setting | Original | Prepared |
|---|---|---|
| Subject | `Your Cyber Pharma sign-in link` | `Your Pharmacy Books sign-in link` |
| SMTP display name | `Cyber Pharma` | `Pharmacy Books` |
| SMTP address | `no-reply@cyberizedev.com` | unchanged |

**Observation, not changed (the instruction limits the edit to the heading):** the link texts "Sign in to Payment Portal" (two branches) use the app's former name; the approved name is "Account & Billing". Changing them would be a separate Director decision.

**Rollback:** paste `DEV_MAGIC_LINK_TEMPLATE_ORIGINAL.html` and the original subject and display name back.

**AC-E01:** the engineering part (prepared body and diff) is now claimable; the review stays with the QA Executor and QA Lead. Delivery (AC-E02) is the deployed walkthrough's W-1 to W-3.
