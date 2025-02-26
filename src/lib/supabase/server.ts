/**
 * server.ts
 * This file provides a Supabase client for server-side operations.
 * It should only be used in Server Components or Server Actions.
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'
import logger from '@/utils/logger'

// Helper function to validate and return environment variables
const getEnvVars = (): { supabaseUrl: string, supabaseKey: string } => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url) {
    logger.error('NEXT_PUBLIC_SUPABASE_URL is not defined')
    throw new Error('Supabase URL is not configured')
  }
  
  if (!key) {
    logger.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
    throw new Error('Supabase anon key is not configured')
  }
  
  return { supabaseUrl: url, supabaseKey: key }
}

// Creates a Supabase client for server-side operations
// This should only be used in Server Components or Server Actions
export const createClient = async () => {
  try {
    const cookieStore = await cookies()
    const { supabaseUrl, supabaseKey } = getEnvVars()

    logger.info('Creating server client with URL:', supabaseUrl.substring(0, 20) + '...');
    
    return createServerClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              logger.error('Error setting cookie:', error)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              logger.error('Error removing cookie:', error)
            }
          },
        },
      }
    )
  } catch (error) {
    logger.error('Error creating server client:', error)
    // Add more detailed error information
    if (error instanceof Error) {
      logger.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack trace
      });
    }
    throw new Error('Failed to initialize Supabase server client')
  }
} 