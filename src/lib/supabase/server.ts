import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'
import logger from '@/utils/logger'

// Creates a Supabase client for server-side operations
// This should only be used in Server Components or Server Actions
export const createClient = async () => {
  
  const cookieStore = await cookies()

  try {
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    throw new Error('Failed to initialize Supabase server client')
  }
} 