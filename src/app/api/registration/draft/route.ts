// APBM007A — the browser's own registration draft. Owned by the httpOnly registration cookie.
import { type NextRequest } from 'next/server';
import { assertSameOrigin, fail, json, rateLimit, readJson, readRegistrationSecret, setRegistrationSecret } from '@/server/http';
import { draftView, loadDraft, saveDraft } from '@/server/registration';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    rateLimit(request, 'draft-read', 60);
    const draft = await loadDraft(readRegistrationSecret(request));
    return json({ draft: draft ? draftView(draft) : null });
  } catch (e) { return fail('draft read', e); }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    rateLimit(request, 'draft-save', 20);
    const body = await readJson(request);
    const { data } = await (await createClient()).auth.getUser();   // a signed-in purchaser is recorded, never trusted from input
    const saved = await saveDraft(readRegistrationSecret(request), { owner: body.owner, pharmacy: body.pharmacy }, data.user?.id ?? null);
    const response = json({ draft: draftView(saved.draft) });
    if (saved.newSecret) setRegistrationSecret(response, saved.newSecret);
    return response;
  } catch (e) { return fail('draft save', e); }
}
