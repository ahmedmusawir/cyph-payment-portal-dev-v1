## Read-only check: switching both repos to apbm-007a keeps all QA files

Branches: both repos on qa/apbm-007a; apbm-007a at the same commit (OB e30e216, PP 2bb13b9); trees identical.
QA files: OB 37 (5 M, 32 untracked) under QAM/; PP none. No stashes.
Switch preserves all: same commit, so git switch rewrites no file; untracked and ignored files untouched.
Overlap: none. Amendments go to APBM_RULINGS, AMENDMENT_LEDGER, APBM_ACCEPTANCE_SPEC, CONTRACTS/*, QAM/HANDOFFS/QA_HANDOFF.md (clean), state/journal, new EVIDENCE/E2/r02/.
Not touched: QA's 5 modified files and all QAM/evidence/Q1, Q1 zip/receipt.

Commands: see chat reply (backup tgz + sha256 to ARCHIVE/APBM007A_Q1_PAUSE_2026-11-13, guarded git switch, verify).
