// APBM-007B A5 — owner abandons an unpaid Add Store; the invoice is voided and verified before anything is released.
import { type NextRequest } from 'next/server';
import { abandonAddStore } from '@/server/storeOperations';
import { PortalError } from '@/server/errors';
import { assertSameOrigin, fail, json, rateLimit, readJson } from '@/server/http';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'store-abandon', 10);
    const body = await readJson(request);
    if (Object.keys(body).some((k) => k !== 'operationId')) throw new PortalError('invalid_input', 'unsupported field');
    if (typeof body.operationId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.operationId)) throw new PortalError('invalid_input', 'operationId');
    return json({ data: await abandonAddStore(await createClient(), body.operationId) });
  } catch (e) { return fail('store abandon', e); }
}
