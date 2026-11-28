# evidence — `ABM007_FINAL` QAM

**Owner:** QA Executor. **Status:** empty.

Layout: `evidence/<phase>-<attempt>/<test-id>/`. One folder per attempt; a rerun never overwrites an earlier attempt.

Rules:
1. Every cited result has: the command, its working directory, exit code, and the unfiltered output.
2. Each item names the repository and the candidate SHA it belongs to.
3. Evidence taken in the OwedBook repository is copied here with its source path recorded. Nothing is written into OwedBook's pointer folder.
4. Screenshots support an assertion; they are not the assertion.
5. No credential, link, code, cookie, private Stripe session address or unsanitized authenticated trace.
6. Fixture and tester email addresses appear only where a result needs them.
7. Failed attempts are kept.

| Index file | Content |
|---|---|
| `evidence/INVENTORY.md` | Created with the first evidence: path, test ID, criterion, candidate, size, SHA-256 |
