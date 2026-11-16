// APBM007A — undo a scheduled cancellation on the same subscription. Owner-only.
import { type NextRequest } from 'next/server';
import { undoCancellation } from '@/server/billing';
import { PortalError } from '@/server/errors';
import { assertSameOrigin, fail, json, rateLimit } from '@/server/http';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'billing-undo', 10);
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new PortalError('sign_in_required');
    return json(await undoCancellation(supabase));
  } catch (e) { return fail('billing undo', e); }
}
