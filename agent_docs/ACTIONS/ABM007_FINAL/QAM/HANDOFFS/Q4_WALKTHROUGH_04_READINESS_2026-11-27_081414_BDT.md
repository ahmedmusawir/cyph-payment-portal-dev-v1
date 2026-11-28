# Q4 walkthrough 04 readiness receipt

Both repaired QA builds passed the fresh production rebuild and are serving on their assigned loopback ports.

- Branch in both repositories: `qa/abm007-final`.
- Target: SCRATCH, `ihgcsrypblqkwommrkgj`.
- Director preparation: 27 November 2026, 08:09 BDT. Ubuntu VM, Chrome 157.0.8103.78 (Official Build), x86_64.
- Preflight found no competing local build or test workers, open write handles or active port connections. Both working trees and isolated copies matched the pinned manifests before and after rebuild.
- Production builds used the existing installed dependencies and fresh build output. Both exited 0. Only the two identified QA launchers received SIGTERM.

| App | Port | New listener / launcher PID | Restart started → verified ready (BDT) | Next.js build ID |
|---|---:|---:|---|---|
| OwedBook | 3100 | 3090197 / 3090063 | 08:15:04 → 08:15:05 | `qwu0ceUJsC51jVYLsC2_J` |
| Account & Billing | 3101 | 3090210 / 3090064 | 08:15:04 → 08:15:06 | `bqMVdfzVgbkcz-Jq0jWFV` |

Both `/api/build-info` requests returned HTTP 200. These SHA-256 values are the served revisions.

- OwedBook: `f229d7a129138af7cc97e1fdb5acadf885c1907ad7cd3c140f4bad5334a4d22d`. Artifact ID `q4-ob-f229d7a129138af7-restart-2026-11-27_081414_BDT`.
- Account & Billing: `ba726f5ea3f5bf2cdd8156a16360e7674be2da500be48c81cacac19ba682c4b9`. Artifact ID `q4-pp-ba726f5ea3f5bf2c-restart-2026-11-27_081414_BDT`.

Both listeners are the new production QA processes and have the expected real SCRATCH configuration. The servers remain running for sheet 04. The verification used local build-info reads and no sign-ins, emails, fixture changes or Stripe requests.
