import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase configuration
// These are loaded from .env file using Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log environment information (excluding sensitive data)
console.log('Environment:', import.meta.env.MODE)
console.log('Supabase URL exists:', !!supabaseUrl)
console.log('Supabase key exists:', !!supabaseAnonKey)

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined in environment variables')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined in environment variables')
}

// Determine the site URL based on the environment
// Used for authentication redirects and callbacks
const siteUrl = window.location.origin;

// Initialize Supabase client with configuration
// - PKCE flow for secure authentication
// - Auto refresh tokens to maintain session
// - Persist session in local storage
// - Custom headers for authentication redirect
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,  // Automatically refresh the token before it expires
    persistSession: true,    // Keep the user logged in between page refreshes
    detectSessionInUrl: true, // Look for auth tokens in the URL
    flowType: 'pkce',         // Use PKCE (Proof Key for Code Exchange) flow for enhanced security
    storage: window.localStorage
  },
  global: {
    headers: {
      'x-redirect-to': `${siteUrl}/auth/callback` // Specify the redirect URL after authentication
    }
  }
}) 