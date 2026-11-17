// APBM-007B W2 — internal job runner: Add Store expiry/abandon (every minute), stalled lifecycle reconciliation,
// removal/transfer boundary finalize, transfer hold expiry → attention, and due billing notices. Private: the same
// derived operator token as the existing operator route (no anonymous or public token); customers get 404.
import { type NextRequest, NextResponse } from 'next/server';
import { operatorAuthorized } from '@/server/operator';
import { rpc } from '@/server/db';
import { advanceStoreOperation } from '@/server/storeOperations';
import { dispatchDueNotices } from '@/server/billingNotices';
import { logServer } from '@/server/errors';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const idsOf = (rows: unknown): string[] => (Array.isArray(rows) ? rows.map((r) => (typeof r === 'string' ? r : (Object.values(r as object)[0] as string))) : []);

export async function POST(request: NextRequest) {
  if (!operatorAuthorized(request.headers.get('authorization'))) return json({ error: 'not_found' }, 404);
  const report: Record<string, unknown> = { at: new Date().toISOString() };
  const run = async (name: string, fn: () => Promise<unknown>) => { try { report[name] = await fn(); } catch (e) { logServer(`job ${name}`, e); report[name] = { error: 'failed' }; } };
  await run('store_operations', async () => { const out: Record<string, string> = {}; for (const id of idsOf(await rpc('store_operations_due', {}))) out[id] = await advanceStoreOperation(id, { waitMs: 0 }); return out; });
  await run('lifecycle', async () => { const out: Record<string, string> = {}; for (const id of idsOf(await rpc('store_lifecycle_due', {}))) out[id] = await advanceStoreOperation(id, { waitMs: 0 }); return out; });
  await run('removals', async () => { const out: Record<string, string> = {}; for (const id of idsOf(await rpc('store_removals_due', {}))) out[id] = await rpc<string>('store_removal_finalize', { p_business: id }); return out; });
  await run('transfers', async () => { const out: Record<string, unknown> = {}; for (const id of idsOf(await rpc('store_transfers_expired', {}))) out[id] = await rpc('store_transfer_mark_attention', { p_transfer: id, p_code: 'hold_expired' }); return out; });
  await run('notices', () => dispatchDueNotices());
  return json(report);
}
