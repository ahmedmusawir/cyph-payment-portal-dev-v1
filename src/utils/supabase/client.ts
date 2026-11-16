import { createBrowserClient } from "@supabase/ssr";
import { authCookieName } from "@/lib/appIdentity";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookieOptions: { name: authCookieName() } } // APBM007A: per-app cookie
  );
}
