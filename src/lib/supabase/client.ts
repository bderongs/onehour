import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import logger from '@/utils/logger'

// Export the createBrowserClient function for direct imports
export { createBrowserClient }

// Creates a Supabase client for client-side operations
export const createClient = () => {
  try {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  } catch (error) {
    logger.error('Error creating browser client:', error)
    throw new Error('Failed to initialize Supabase browser client')
  }
} 