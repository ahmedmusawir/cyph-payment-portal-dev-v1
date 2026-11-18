// APBM-007B A2 — confirm a bound quote with explicit consent. Starts the durable operation and attempts payment once.
import { type NextRequest } from 'next/server';
import { confirmAddStore } from '@/server/storeOperations';
import { PortalError } from '@/server/errors';
import { assertSameOrigin, fail, json, rateLimit, readJson } from '@/server/http';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'store-confirm', 10);
    const body = await readJson(request);
    const allowed = new Set(['quoteId', 'intentKey', 'consentTerms', 'consentRecurring', 'consentImmediate']);
    if (Object.keys(body).some((k) => !allowed.has(k))) throw new PortalError('invalid_input', 'unsupported field');
    if (typeof body.quoteId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.quoteId)) throw new PortalError('invalid_input', 'quoteId');
    if (typeof body.intentKey !== 'string' || !/^[A-Za-z0-9_-]{16,128}$/.test(body.intentKey)) throw new PortalError('invalid_input', 'intentKey');
    if (body.consentTerms !== true || body.consentRecurring !== true || body.consentImmediate !== true) {
      throw new PortalError('invalid_input', 'consent', { consent: 'Confirm all three statements to continue.' });
    }
    return json({ data: await confirmAddStore(await createClient(), { quoteId: body.quoteId, intentKey: body.intentKey }) });
  } catch (e) { return fail('store confirm', e); }
}
