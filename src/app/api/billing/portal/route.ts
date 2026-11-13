// APBM007A — open the Stripe Billing Portal for the signed-in owner, always with the app's own configuration.
import { type NextRequest } from 'next/server';
import { openBillingPortal } from '@/server/billing';
import { PortalError } from '@/server/errors';
import { assertSameOrigin, fail, json, rateLimit } from '@/server/http';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'billing-portal', 10);
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new PortalError('sign_in_required');
    return json(await openBillingPortal(supabase));
  } catch (e) { return fail('billing portal', e); }
}
