import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Re-export the client utilities - only safe for client components
export { createClient as createBrowserClient } from './client'
export { createClient as createMiddlewareClient } from './middleware'

// Helper to check if we're on the server side
export const isServer = () => typeof window === 'undefined'

// Get the appropriate client based on the context
export const createClient = async (): Promise<SupabaseClient<Database>> => {
  if (isServer()) {
    // Dynamic import for server client to avoid next/headers issues
    const { createClient: createServerClient } = await import('./server')
    return createServerClient()
  }
  // Use browser client for client-side
  const { createClient: createBrowserClient } = await import('./client')
  return createBrowserClient()
} 