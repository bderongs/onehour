import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import logger from '@/utils/logger'

// Export a wrapped version of createBrowserClient that includes the required arguments
export const createBrowserClient = () => {
  try {
    return createSupabaseBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  } catch (error) {
    logger.error('Error creating browser client:', error)
    throw new Error('Failed to initialize Supabase browser client')
  }
}

// Creates a Supabase client for client-side operations
export const createClient = () => {
  try {
    return createSupabaseBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  } catch (error) {
    logger.error('Error creating browser client:', error)
    throw new Error('Failed to initialize Supabase browser client')
  }
} 