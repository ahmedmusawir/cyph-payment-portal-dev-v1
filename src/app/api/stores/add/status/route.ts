// APBM-007B A4 — owner reads an exact operation; reconciliation runs server-side, the browser never reports a result.
import { type NextRequest } from 'next/server';
import { storeOperationStatus } from '@/server/storeOperations';
import { PortalError } from '@/server/errors';
import { assertSameOrigin, fail, json, rateLimit, readJson } from '@/server/http';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'store-status', 60);
    const body = await readJson(request);
    if (Object.keys(body).some((k) => k !== 'operationId')) throw new PortalError('invalid_input', 'unsupported field');
    if (typeof body.operationId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.operationId)) throw new PortalError('invalid_input', 'operationId');
    return json({ data: await storeOperationStatus(await createClient(), body.operationId) });
  } catch (e) { return fail('store status', e); }
}
