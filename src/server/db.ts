// APBM007A — the portal's only service-role access point. Server-only by construction (reads SUPABASE_SECRET_KEY,
// which Next never exposes to the browser). Every caller has already authorised the request itself.
import { createAdminClient } from '@/utils/supabase/admin';
import { PortalError } from '@/server/errors';

export type Admin = ReturnType<typeof createAdminClient>;
let cached: Admin | null = null;
export function admin(): Admin {
  cached ??= createAdminClient();
  return cached;
}

/** Call a service-only SQL function; a database failure is surfaced as provider_unavailable, never swallowed. */
export async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const r = await admin().rpc(fn, args);
  if (r.error) throw new PortalError('provider_unavailable', `rpc ${fn} ${r.error.code}`);
  return r.data as T;
}

/** bytea parameters travel to PostgREST as \x-prefixed hex. */
export const bytea = (buf: Buffer): string => '\\x' + buf.toString('hex');
