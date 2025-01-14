import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Determine the site URL based on the environment
const siteUrl = import.meta.env.DEV 
  ? 'http://localhost:5173'
  : 'https://www.sparkier.io'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-redirect-to': `${siteUrl}/auth/callback`
    }
  }
}) 