// APBM007A — the signed-in owner's billing overview. Owner-only: the database function refuses everyone else.
import { type NextRequest } from 'next/server';
import { ownerOverview, paymentMethod } from '@/server/billing';
import { PortalError } from '@/server/errors';
import { fail, json, rateLimit } from '@/server/http';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    rateLimit(request, 'billing-overview', 30);
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new PortalError('sign_in_required');
    const overview = await ownerOverview(supabase);
    // The card state is read live and only for a real Stripe subscription; a provider failure is shown as unknown.
    let card: { onFile: boolean; brand?: string; last4?: string } | 'unknown' | 'not_applicable' = 'not_applicable';
    if (overview.subscription?.origin === 'stripe') {
      try { card = await paymentMethod(supabase); } catch { card = 'unknown'; }
    }
    return json({ overview, paymentMethod: card });
  } catch (e) { return fail('billing overview', e); }
}
