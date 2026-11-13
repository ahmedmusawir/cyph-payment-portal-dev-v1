// APBM007A — server quote for the current draft revision, with an optional APA promotion code.
import { type NextRequest } from 'next/server';
import { assertSameOrigin, fail, json, rateLimit, readJson, readRegistrationSecret } from '@/server/http';
import { draftView, requestQuote } from '@/server/registration';
import { stripeNames } from '@/server/stripeClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'quote', 20);
    const body = await readJson(request);
    const code = typeof body.code === 'string' ? body.code : null;
    const draft = await requestQuote(readRegistrationSecret(request), stripeNames().priceId, code);
    return json({ draft: draftView(draft) });
  } catch (e) { return fail('quote', e); }
}
