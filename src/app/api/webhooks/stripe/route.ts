// APBM007A — Stripe webhook endpoint. Portal only, Node runtime, raw request bytes for signature verification.
// Local: `stripe listen --forward-to localhost:3001/api/webhooks/stripe` with that listener's signing secret.
import { type NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/server/webhook';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const raw = await request.text();   // never parsed before verification
  let result: { status: number; body: Record<string, string> };
  try {
    result = await handleStripeWebhook(raw, request.headers.get('stripe-signature'));
  } catch {
    result = { status: 500, body: { error: 'processing_failed' } };
  }
  return NextResponse.json(result.body, { status: result.status, headers: { 'Cache-Control': 'no-store' } });
}
