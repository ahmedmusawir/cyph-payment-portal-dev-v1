import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { authCookieName, isSecureOrigin } from '@/lib/appIdentity'

type CookieToSet = { name: string; value: string; options: CookieOptions }

/**
 * Cookie-bound server client. APBM007A: per-app cookie name and the getAll/setAll adapter
 * (AUTH_HANDOFF_CONTRACT §11). Host-only, SameSite=Lax, Secure on HTTPS.
 */
export const createClient = async () => {
  const cookieStore = await cookies()
  const secure = isSecureOrigin()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: { name: authCookieName() },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, { ...options, secure, sameSite: 'lax', httpOnly: false }) // Supabase needs client access
            )
          } catch {
            // Called from a Server Component: the proxy refreshes the session instead.
          }
        },
      },
    }
  )
}
