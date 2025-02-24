import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Export only client-safe utilities
export { createClient as createBrowserClient } from './client'
export { createClient as createMiddlewareClient } from './middleware'