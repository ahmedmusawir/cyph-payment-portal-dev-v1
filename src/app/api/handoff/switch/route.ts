// APBM007A — deliberate account switch at the destination (AUTH_HANDOFF_CONTRACT §5). POST only, same-origin, token-bound.
import { type NextRequest } from 'next/server';
import { switchHandoff } from '@/server/handoff';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  return switchHandoff(request);
}
