// APBM007A — start or resume Stripe-hosted Checkout for the draft. The browser sends consents and its stable
// operation key only; amount, price, customer and account are decided by the server.
import { type NextRequest } from 'next/server';
import { abandonCheckout, startCheckout } from '@/server/checkout';
import { assertSameOrigin, fail, json, rateLimit, readJson, readRegistrationSecret } from '@/server/http';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'checkout', 10);
    const body = await readJson(request);
    const { data } = await (await createClient()).auth.getUser();
    const c = (body.consents ?? {}) as Record<string, unknown>;
    const result = await startCheckout(readRegistrationSecret(request), {
      operationKey: String(body.operationKey ?? ''),
      consents: { termsAccepted: c.termsAccepted === true, recurringChargeAccepted: c.recurringChargeAccepted === true, priceChangeAccepted: c.priceChangeAccepted === true },
    }, data.user?.id ?? null);
    return json(result);
  } catch (e) { return fail('checkout', e); }
}

/** Go back to editing: expires the Checkout session through Stripe before the NPI hold is released. */
export async function DELETE(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'checkout-abandon', 10);
    return json({ status: await abandonCheckout(readRegistrationSecret(request)) });
  } catch (e) { return fail('checkout abandon', e); }
}
