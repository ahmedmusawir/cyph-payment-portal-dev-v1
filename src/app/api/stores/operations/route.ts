// APBM-007B A3 — the owner's own recent store operations (safe fields; no provider capability URL).
import { listOwnerOperations } from '@/server/storeOperations';
import { fail, json } from '@/server/http';
import { createClient } from '@/utils/supabase/server';
import { PortalError } from '@/server/errors';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new PortalError('sign_in_required');
    return json({ data: await listOwnerOperations(supabase) });
  } catch (e) { return fail('store operations', e); }
}
