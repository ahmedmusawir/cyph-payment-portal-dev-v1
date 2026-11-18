// APBM-007B R1 — schedule period-end removal of one store. Owner only; never the last billable store.
import { type NextRequest } from 'next/server';
import { requestLifecycle } from '@/server/storeOperations';
import { PortalError } from '@/server/errors';
import { assertSameOrigin, fail, json, rateLimit, readJson } from '@/server/http';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'store-removal', 10);
    const { id } = await params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new PortalError('not_found', 'store id');
    const body = await readJson(request);
    if (Object.keys(body).some((k) => k !== 'intentKey') || typeof body.intentKey !== 'string' || !/^[A-Za-z0-9_-]{16,128}$/.test(body.intentKey)) throw new PortalError('invalid_input', 'intentKey');
    return json({ data: await requestLifecycle(await createClient(), 'store_removal', id, body.intentKey) });
  } catch (e) { return fail('store removal', e); }
}
