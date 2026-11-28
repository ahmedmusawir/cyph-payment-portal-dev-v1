# AUTOMATION — `ABM007_FINAL` QAM

**Owner:** QA Executor. **Status:** empty. Helpers are written in Q1 and Q2 inside this lane only.

Rules:
1. Helpers live here, never in either product tree. Promoting one into a product test suite is a separate, authorized engineering change.
2. A helper that cannot fail is not an instrument. Each has a passing control and a failing control, and both outputs are saved.
3. A corrected helper keeps its failed attempt on record, with what was wrong.
4. No hidden retries, no weakened assertions, no skipped checks.
5. Credentials are read by the authorized local helper into process memory only. Nothing here prints, logs or stores a value.
6. Each helper states its working directory and the repository and build it runs against.

| Helper | Purpose | Criteria it serves | Controls validated | Status |
|---|---|---|---|---|
| none yet | | | | |

Expected helpers (the Executor decides): token-resolution check with a rounded-triplet control (AC-B01); rendered-contrast probe (AC-B08); overflow and target-size probes (AC-L04); forced-light check under stored-dark and system-dark (AC-B04); old-name and forbidden-term scanners (AC-N01, AC-H02); privacy scanner for packaging.
