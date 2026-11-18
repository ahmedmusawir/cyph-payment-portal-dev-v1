# Closeout preparation

**Version:** 0.3 · **Prepared:** 16 November 2026, Asia/Dhaka · **Author:** JARVIS, Architect

**Status: PRE-RECON PLANNING / REVIEW DRAFT. Not an implementation-ready module or execution release.**

Future sequence: Friday adjudicates Gate Q → approved cleanup and retention → Tony commits durable records → Architect reconciles exact certificate/identity and issues bounded closeout → Engineer performs it → Tony merges the certified QA branch in both repos and records pushed main identities → separately released deployment/Gate D.

Repairs after QA handoff stay on `qa/<verified-module-branch>`. Engineer and QA Executor take turns as active writer; no routine return to engineering branch. QA independently re-pins and retests the approved repair diff and required regression. Preserve unchanged evidence only with original candidate and impact reasoning.

Cleanup removes only authorized disposable tools/auth state/owned processes. Retain justified evidence, failed attempts and audit history. Prove no product/test/config/contract bytes changed during cleanup; material changes require impact review. No destructive Git or automatic deletion of unrelated records. Product, execution, evidence, closeout, merge and deployment identities are distinct.

Do not generate staging/commit/merge commands from this draft. The exact changed paths, dirty state, ancestry, certificate and cleanup receipt are required to prepare scoped Git commands. Tony retains Git authority. Closeout includes campaign status, remaining scope, owner-assigned follow-ups and the staging result or explicit pending state.
