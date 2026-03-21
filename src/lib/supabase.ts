import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// storageKey must match across all apps on this domain so both
// futureengineracademy.com and app.futureengineracademy.com share
// the same localStorage entry. Cross-domain session handoff (different
// subdomain = separate localStorage) is handled via URL fragment redirect
// in LoginPage — see the portal's /auth/callback page which calls
// supabase.auth.setSession() from the access_token + refresh_token in the hash.
//
// The Next.js portal must use the same NEXT_PUBLIC_SUPABASE_URL,
// NEXT_PUBLIC_SUPABASE_ANON_KEY, and storageKey: 'futureengineer-auth'.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'futureengineer-auth',
    storage: window.localStorage,
  },
})
