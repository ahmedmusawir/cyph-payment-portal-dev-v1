// Manual QA 19 Nov 2026 (R3): why a payment-pending Add Store needs the owner comes only from the server's recorded outcome
// of its single charge attempt; polling is bounded.
jest.mock('@/server/db', () => ({ rpc: jest.fn(), admin: jest.fn() }));
jest.mock('@/server/stripeClient', () => ({ stripe: jest.fn(), stripeCall: jest.fn(), assertStripeAccount: jest.fn(), stripeNames: jest.fn() }));
import { paymentIssueFor } from '@/server/storeOperations';
import { pollDelayMs } from '@/components/portal/account/AddStoreFlow';

describe('paymentIssueFor', () => {
  it.each([
    ['payment_pending', null, 'processing'],
    ['payment_pending', 'paid', 'processing'],
    ['payment_pending', 'invoice_payment_intent_requires_action', 'authentication_required'],
    ['payment_pending', 'authentication_required', 'authentication_required'],
    ['payment_pending', 'card_declined', 'declined'],
    ['payment_pending', 'insufficient_funds', 'declined'],
    ['payment_pending', 'expired_card', 'declined'],
    ['payment_pending', 'missing', 'no_payment_method'],
    ['payment_pending', 'error', 'unknown'],
    ['payment_pending', 'something_new', 'unknown'],
    ['activated', 'card_declined', 'none'],
    ['paid_pending_activation', 'paid', 'none'],
  ])('%s with outcome %s → %s', (state, outcome, expected) => { expect(paymentIssueFor(state, outcome)).toBe(expected); });
});

describe('pollDelayMs (bounded)', () => {
  it('every 4 s for two minutes, then every 15 s, and stops at 35 minutes', () => {
    expect(pollDelayMs(0)).toBe(4000);
    expect(pollDelayMs(119_999)).toBe(4000);
    expect(pollDelayMs(120_000)).toBe(15000);
    expect(pollDelayMs(34 * 60_000)).toBe(15000);
    expect(pollDelayMs(35 * 60_000)).toBeNull();
  });
});
