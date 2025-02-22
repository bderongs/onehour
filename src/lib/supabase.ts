// Re-export the client utilities
export { createClient as createServerClient } from './supabase/server'
export { createClient as createBrowserClient } from './supabase/client'
export { createClient as createMiddlewareClient } from './supabase/middleware'
export * from './supabase/database.types'

// Helper to check if we're on the server side
export const isServer = () => typeof window === 'undefined'

// Get the appropriate client based on the context
export const createClient = () => {
  if (isServer()) {
    const { createClient } = require('./supabase/server')
    return createClient()
  }
  const { createClient } = require('./supabase/client')
  return createClient()
} 