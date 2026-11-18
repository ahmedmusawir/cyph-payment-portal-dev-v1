# Director decisions and E1 workflow record — 16 November 2026

This is an Architect-authored record of the visible conversation, not a purported uploaded Director document.

## Direct user statements
> approved up to 4 recoms ... but don't understand 5 ... it is still begin fixed ... claudy is working

> also, doesn't the first apbm recon solves inspecting the code?

> so are we ready to finalize the apbm-007b now? i mean this makes us ready to jump in as soon as 7a is merged?

## Approved recommendations 1–4 and clarified workflow
1. **Seats approved:** Claudy builds and performs engineering E1; Cody tests independently; Friday leads QA; JARVIS authors the architecture and pack. Tony retains Director authority.
2. **Transfer/recovery approach approved:** audited operator command plus written support procedure for sale, ownership transfer and recovery. No new customer-facing transfer screens in 007B. E1 identifies the exact operations; FR-05 classifies each criterion at freeze. This is not permission to substitute a document for required software behavior.
3. **Buyer history approved:** buyer starts fresh and receives no access to historical claims. Preserve historical records with controlled access and the stable store identity; preserve seller receivables under existing rulings. E1 must specify the data/access boundary.
4. **Operating defaults approved:** undo scheduled removal before the paid period ends; last-store removal uses whole-account cancellation; the incumbent admin remains until replacement acceptance. Send one notice at failed payment and one before read-only. Each approved notice type is sent at most once per failed invoice; suppress outstanding reminders after recovery. Exact pre-read-only offset, templates, retry and failure semantics are technical freeze details from E1.
5. **Workflow clarification, not an additional Director approval:** the separate pre-E1 inspection proposal is withdrawn. E1 itself inspects the code. Prepare now, bind the final merged 007A commit pair and closeout evidence, then separately launch E1. No early recon, E1/E2 execution or assumption that 007A repairs have passed is authorized by this pack.

JARVIS acknowledged that E1 performs inspection and withdrew question 5 as an extra approval request. The post-merge sequence is the preparation workflow; it is not a recorded E1 release. No release or risk acceptance is inferred.
