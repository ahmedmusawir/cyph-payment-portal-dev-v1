// REPAIR_001 Q2-F03: classification of the former /demo/stripe stand-in route.
// APBM007A removed that route and its stand-in components from the app tree (Stripe-hosted
// Checkout and the Billing Portal replace them), so the page-level cases are gone with it. The pure
// classifier is kept as FFM reference and stays covered here.
import { classifyStripeStandIn } from '@/services/portal/stripeRoute';

describe('classifyStripeStandIn', () => {
  it.each([
    [{}, 'public', 'checkout'],
    [{ mode: 'checkout' }, 'public', 'checkout'],
    [{ mode: ['checkout', 'checkout'] }, 'public', 'checkout'],
    [{ mode: 'portal' }, 'account', 'portal'],
    [{ mode: 'card' }, 'account', 'card'],
    [{ mode: ['checkout', 'portal'] }, 'account', 'portal'],
    [{ mode: ['portal', 'checkout'] }, 'account', 'portal'],
    [{ mode: ['card', 'card'] }, 'account', 'card'],
    [{ mode: ['checkout', 'card'] }, 'account', 'card'],
    [{ mode: ['card', 'portal'] }, 'account', 'portal'],
    [{ mode: 'Portal' }, 'account', 'portal'],
    [{ mode: ' CARD ' }, 'account', 'card'],
    [{ mode: 'portal\u0000' }, 'account', 'checkout'],
    [{ mode: 'admin' }, 'account', 'checkout'],
    [{ mode: '' }, 'account', 'checkout'],
    [{ mode: ['checkout', 'unknown'] }, 'account', 'checkout'],
  ] as const)('%j → %s/%s', (params, access, mode) => {
    expect(classifyStripeStandIn(params as never)).toMatchObject({ access, mode });
  });

  it('purpose: first allowed value, else manage; never free text', () => {
    expect(classifyStripeStandIn({ mode: 'portal', purpose: 'cancel' }).purpose).toBe('cancel');
    expect(classifyStripeStandIn({ mode: 'portal', purpose: ['bogus', 'RESUME'] }).purpose).toBe('resume');
    expect(classifyStripeStandIn({ mode: 'portal', purpose: 'https://evil.example/' }).purpose).toBe('manage');
  });
});
