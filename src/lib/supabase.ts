import { createClient } from '@supabase/supabase-js'
import logger from '@/utils/logger'

// Environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    logger.error('Missing Supabase environment variables')
    throw new Error('Missing Supabase environment variables')
}

// Initialize Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export const supabase = supabaseClient; 