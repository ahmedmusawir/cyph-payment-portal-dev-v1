// APBM007A — the one place the portal asks the Auth mailer for a sign-in link. A module of its own so that tests
// replace exactly this call and can never send mail by accident. Never creates a user (shouldCreateUser:false).
import { createClient } from '@supabase/supabase-js';

export async function sendSignInLink(email: string, redirectTo: string): Promise<{ ok: boolean; code?: string }> {
  const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } });
  const sent = await anon.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: redirectTo } });
  if (!sent.error) return { ok: true };
  // Keep Auth's error code with the status (for example 429:over_email_send_rate_limit), so a failure can be traced to
  // the limit that produced it. Codes are fixed identifiers, never an address or a token.
  const code = (sent.error as { code?: string }).code;
  return { ok: false, code: `${sent.error.status ?? 'error'}${code ? `:${code}` : ''}`.slice(0, 80) };
}
