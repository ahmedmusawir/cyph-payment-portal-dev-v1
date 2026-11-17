// APBM-007B A1 — Add Store quote. Owner only; the server computes and binds the amount (CONTRACTS/BILLING.md).
import { type NextRequest } from 'next/server';
import { quoteAddStore } from '@/server/storeOperations';
import { PortalError } from '@/server/errors';
import { assertSameOrigin, fail, json, rateLimit, readJson } from '@/server/http';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'store-quote', 20);
    const body = await readJson(request);
    const allowed = new Set(['storeName', 'npi', 'ncpdp']);
    if (Object.keys(body).some((k) => !allowed.has(k))) throw new PortalError('invalid_input', 'unsupported field');
    const storeName = typeof body.storeName === 'string' ? body.storeName.trim() : '';
    const npi = typeof body.npi === 'string' ? body.npi.trim() : '';
    const ncpdp = typeof body.ncpdp === 'string' && body.ncpdp.trim() ? body.ncpdp.trim() : null;
    const fieldErrors: Record<string, string> = {};
    if (!storeName || storeName.length > 200) fieldErrors.storeName = 'Enter the pharmacy name.';
    if (!/^[0-9]{10}$/.test(npi)) fieldErrors.npi = 'Enter a 10-digit NPI.';
    if (ncpdp !== null && !/^[0-9]{7}$/.test(ncpdp)) fieldErrors.ncpdp = 'NCPDP must be 7 digits.';
    if (Object.keys(fieldErrors).length) throw new PortalError('invalid_input', 'fields', fieldErrors);
    return json({ data: await quoteAddStore(await createClient(), { storeName, npi, ncpdp }) });
  } catch (e) { return fail('store quote', e); }
}
