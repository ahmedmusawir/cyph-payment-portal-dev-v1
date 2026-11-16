// APBM007A — what this app does right after a person proves control of their address by signing in.
// Portal: attach any paid registration that was waiting for exactly that proof (AUTH_HANDOFF_CONTRACT §7).
import { resumeForUser } from '@/server/provisioning';

export async function afterSignIn(userId: string, email: string | undefined): Promise<void> {
  if (!email) return;
  try { await resumeForUser(userId, email); } catch { /* the registration stays in attention; the status page says so */ }
}
