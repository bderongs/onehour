import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log environment information (excluding sensitive data)
console.log('Environment:', import.meta.env.MODE)
console.log('Supabase URL exists:', !!supabaseUrl)
console.log('Supabase key exists:', !!supabaseAnonKey)

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined in environment variables')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined in environment variables')
}

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