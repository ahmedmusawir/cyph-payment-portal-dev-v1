// APBM007A — the one place the portal asks the Auth mailer for a sign-in link. A module of its own so that tests
// replace exactly this call and can never send mail by accident. Never creates a user (shouldCreateUser:false).
import { createClient } from '@supabase/supabase-js';

export async function sendSignInLink(email: string, redirectTo: string): Promise<{ ok: boolean; code?: string }> {
  const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } });
  const sent = await anon.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: redirectTo } });
  return sent.error ? { ok: false, code: String(sent.error.status ?? sent.error.code ?? 'error').slice(0, 40) } : { ok: true };
}
