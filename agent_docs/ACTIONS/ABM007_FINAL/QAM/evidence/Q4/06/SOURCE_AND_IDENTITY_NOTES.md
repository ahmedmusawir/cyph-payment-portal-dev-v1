# Closeout identity and report provenance

At 10:24:17 BDT both localhost build-info routes returned HTTP 200 with the exact pinned manifest revisions and the 27 November rebuilt artifact IDs. Both listener PIDs and launcher parents matched the readiness receipt. Both processes had the production local-proof SCRATCH reference. Across the isolated copies, all 2,313 OwedBook paths and 2,370 Portal paths matched the manifests. No source mismatch was observed in the served copies.

The strict original check passed for OwedBook. It rejected the Portal working tree because of the extra session_2026-11-27.md. A separate byte check on every pinned path also found CHANGELOG.md differed on disk. A comparison with the served copy found only four inserted changelog lines documenting the new session log. Those two records appeared after the rebuild. There was no product-file mismatch in the working tree. The first strict check and exact record paths/hashes are retained in closeout-live-identity.json. Exact post-commit equivalence remains pending.

Source 1 in Downloads was not found under its filename or in available archives. Tony supplied the report as Markdown text in this conversation on request. It was written and packaged verbatim from that source. Tony independently supplied his exact W-01–W-03 confirmation and the manual environment details in the closeout instruction.
