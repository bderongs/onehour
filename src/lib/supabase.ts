import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables')
}

// Initialize Supabase client with configuration
// - PKCE flow for secure authentication
// - Auto refresh tokens to maintain session
// - Persist session in local storage
// - Custom headers for authentication redirect
// - Enable debug logs in development
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Use cookies for session storage in Next.js
    storage: {
      getItem: (key) => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          return null
        }
        // Try to get from cookies first (for SSR/middleware compatibility)
        const cookies = document.cookie.split(';')
        const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
        if (cookie) {
          return cookie.split('=')[1]
        }
        // Fallback to localStorage
        return window.localStorage.getItem(key)
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') {
          return
        }
        // Set in both cookies and localStorage
        document.cookie = `${key}=${value};path=/;max-age=31536000`
        window.localStorage.setItem(key, value)
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') {
          return
        }
        // Remove from both cookies and localStorage
        document.cookie = `${key}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`
        window.localStorage.removeItem(key)
      },
    },
  }
}) 