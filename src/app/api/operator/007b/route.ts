// APBM-007B W3/W4 — typed operator commands. Same derived operator token as /api/operator/operations; anything else 404.
import { type NextRequest, NextResponse } from 'next/server';
import { operatorAuthorized } from '@/server/operator';
import { runOperator, type OperatorRequest } from '@/server/operator007b';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: NextRequest) {
  if (!operatorAuthorized(request.headers.get('authorization'))) return json({ error: 'not_found' }, 404);
  const body = (await request.json().catch(() => null)) as OperatorRequest | null;
  if (!body || typeof body !== 'object' || typeof body.action !== 'string') return json({ error: 'invalid_request' }, 400);
  const r = await runOperator(body);
  return json(r, r.result === 'failed' ? 502 : r.result === 'refused' ? 409 : 200);
}
