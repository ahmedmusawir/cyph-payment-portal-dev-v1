// APBM007A — handoff route (AUTH_HANDOFF_CONTRACT §9). All logic lives in src/server/handoff.ts.
import { type NextRequest } from 'next/server';
import { startHandoff } from '@/server/handoff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  return startHandoff(request);
}
