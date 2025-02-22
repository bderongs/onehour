import { createServerClient } from '@supabase/ssr'
import type { Database } from './database.types'
import type { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'

export const createClient = (request: NextRequest, response: NextResponse) => {
  try {
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )
  } catch (error) {
    logger.error('Error creating middleware client:', error)
    throw new Error('Failed to initialize Supabase middleware client')
  }
} 