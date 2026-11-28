# A2 first-attempt observations and bounded diagnostics

The first three engine commands began concurrently. Every first row is retained. Owner A Firefox and WebKit navigations returned HTTP 307 to sign-in after the Chromium Owner A sign-out. Shared-fixture sign-out invalidation is consistent with the timestamps and the app's provider-wide sign-out behavior. This is a QA sequencing issue. The diagnostic uses one browser context at a time and only fills uncovered cells. A fixture setup failure is not replayed.

Firefox's initial mouse-driven Help flow left the link focused by pointer at the bottom of the document. The first Firefox article 13 row had zero Tab steps and no keyboard focus style even though Enter worked. Keyboard diagnostics use a fresh Help document before real sequential Tab input. No script calls focus().

The first Profile instrument treated a transparent solid outline as visible and sampled black instead of the visible navy shadow ring. The retained first rows show both the transparent outline and the real shadow. The corrected instrument adds a transparent-outline shadow-ring positive control.

The initial Chromium Invite probes recorded no text ranges because the route's shell does not supply main. The one actual per-position measurement uses the settled document text. Positions with any captured ranges are excluded from re-measurement.

The Account & Billing avatar was identified on the one Store-admin Dashboard HTTP 200 document. The initial row reported zero because Playwright route interception does not intercept a subsequent redirect as a distinct routed request. The response event ledger records the one document. The diagnostic reconciliation reads the existing row and ledger only.
