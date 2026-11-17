# HANDOFFS/ — indexed checkpoint packages, external receipts, review entry notes

> TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC. Template `QAM/HANDOFFS/README.md` v0.3-draft (2026-10-14), from `QAM_PLAYBOOK_v1_0.md` §5 and §13.

This lane holds: the Engineer's `ENGINEERING_HANDOFF.md`; every review ZIP (`APBM-007B-CYBER-PHARMA_<PHASE>_REVIEW_<ATTEMPT>.zip`); the **external receipts** table below (the completed ZIP's SHA-256 and the reviewer's decision text, recorded outside the ZIP — the `QAM_STATE.md` inside a ZIP is the immutable pre-export snapshot and never carries its own package hash); and the unfilled `REVIEW_START_HERE.md` / `FILE_INDEX.template.json` the Executor copies into each package. Build and verify packages per `../QAM_PACKAGING.md`; never rebuild a ZIP merely to insert its own hash. Future QA handoffs belong here, never scattered between root documents, temporary directories and chat.

| Package | Phase / attempt | Produced at (pre-export state entry) | Members | SHA-256 (external receipt, recorded after export) | Decision returned (by, date) |
|---|---|---|---|---|---|
| none yet | | | | | |

*TEMPLATE SET v0.3 — QA LEAD ACCEPTED WITH EXACT AMENDMENTS (Fable, 2026-10-14); AMENDMENTS ARCHITECT-VERIFIED; INSTALLATION REQUIRES THE APPROVED DOCSET SYNC.*

2026-11-17 Cody Q1 review01: /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/HANDOFFS/APBM-007B-CYBER-PHARMA_Q1_REVIEW_01.zip; 22 members; SHA-256 b1d5fce17c5ea8ff76bc72656624fc45c6de268cbcf1872118197ef890c6fb0c; CRC, exact indexed membership/hashes, safe generated paths and expanded privacy scan PASS. Friday plan review requested; Q2 not released.

2026-11-17 Cody Q1 amendments02: /home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/HANDOFFS/APBM-007B-CYBER-PHARMA_Q1_REVIEW_02.zip; 28 members; SHA-256 b0d6640e76d27b234602c134b86f558826dc2e7bb04168c79bacfd7b1ef70340; CRC, exact indexed membership/hashes, safe generated paths and expanded privacy scan PASS. Friday resolution of two QL-01 diffs requested; no second plan review; Q2 not released.
