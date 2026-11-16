// APBM007A — registration status for the browser that owns the draft, and the access-email resend.
import { type NextRequest } from 'next/server';
import { assertSameOrigin, fail, json, rateLimit, readRegistrationSecret } from '@/server/http';
import { registrationStatus, resendAccessEmail } from '@/server/registrationStatus';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const reconcile = request.nextUrl.searchParams.get('reconcile') === '1';
    rateLimit(request, reconcile ? 'status-reconcile' : 'status', reconcile ? 12 : 60);
    return json({ status: await registrationStatus(readRegistrationSecret(request), { reconcile }) });
  } catch (e) { return fail('status', e); }
}

/** Resend the access email. Generic answer; at most one provider request a minute. */
export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'resend', 5);
    await resendAccessEmail(readRegistrationSecret(request));
    return json({ result: 'request_received' });
  } catch (e) { return fail('resend', e); }
}
