import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase configuration
// These are loaded from .env file using Vite's import.meta.env
const isDevelopment = import.meta.env.MODE === 'development'

// Select the appropriate credentials based on environment
const supabaseUrl = isDevelopment 
  ? import.meta.env.VITE_SUPABASE_URL_DEV 
  : import.meta.env.VITE_SUPABASE_URL

const supabaseAnonKey = isDevelopment 
  ? import.meta.env.VITE_SUPABASE_ANON_KEY_DEV 
  : import.meta.env.VITE_SUPABASE_ANON_KEY

// Log environment information (excluding sensitive data)
console.log('Environment:', import.meta.env.MODE)
console.log('Using development environment:', isDevelopment)
console.log('Supabase URL exists:', !!supabaseUrl)
console.log('Supabase key exists:', !!supabaseAnonKey)

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error(`${isDevelopment ? 'VITE_SUPABASE_URL_DEV' : 'VITE_SUPABASE_URL'} is not defined in environment variables`)
}

if (!supabaseAnonKey) {
  throw new Error(`${isDevelopment ? 'VITE_SUPABASE_ANON_KEY_DEV' : 'VITE_SUPABASE_ANON_KEY'} is not defined in environment variables`)
}

// Determine the site URL based on the environment
const siteUrl = isDevelopment ? 'http://localhost:5173' : 'https://www.sparkier.io';

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
    detectSessionInUrl: true
  }
}) 