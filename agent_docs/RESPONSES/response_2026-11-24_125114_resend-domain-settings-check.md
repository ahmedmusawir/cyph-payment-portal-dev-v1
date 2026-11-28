# Resend settings check for cyberizedev.com — BLOCKED

**Inspection timestamp:** 2026-11-24T06:51:06Z (12:51 Asia/Dhaka)

**Blocker:** The only locally configured Resend credential (`RESEND_API_KEY` in the Portal's `.env.local`) is a **sending-only key**. `GET https://api.resend.com/domains` returned **HTTP 401**, `restricted_api_key`: "This API key is restricted to only send emails". No other Resend credential is configured locally (OwedBook's env files and the shell environment have none).

**Not retrieved:** the domain name and ID, verification status, `click_tracking`, `open_tracking` and `tracking_subdomain`. `GET /domains/{domain_id}` was not attempted, because the list call failed and gave no domain ID.

**What was done:** one GET request. No POST, PATCH or DELETE request was sent. No email was sent, no key was created, and nothing changed in DNS, tracking or Forge. The key was read into a shell variable that was cleared afterwards, and it was never printed. E2 work and its restrictions are unchanged.

**To unblock (Director):** run the check with a full-access key from the Resend dashboard, or read the domain's settings there directly.
