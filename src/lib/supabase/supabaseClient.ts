import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import logger from '@/utils/logger';
import type { NextRequest, NextResponse } from 'next/server';

let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null;
let serverInstance: ReturnType<typeof createServerComponentClient<Database>> | null = null;

// Type-safe client for use in client components
export const createSupabaseClient = () => {
  if (!clientInstance) {
    try {
      clientInstance = createClientComponentClient<Database>();
    } catch (error) {
      logger.error('Error creating Supabase client:', error);
      throw new Error('Failed to initialize Supabase client');
    }
  }
  return clientInstance;
};

// Type-safe client for use in server components
export const createSupabaseServerClient = () => {
  if (!serverInstance) {
    try {
      serverInstance = createServerComponentClient<Database>({ cookies });
    } catch (error) {
      logger.error('Error creating Supabase server client:', error);
      throw new Error('Failed to initialize Supabase server client');
    }
  }
  return serverInstance;
};

// Type-safe client for use in middleware
export const createSupabaseMiddlewareClient = ({ req, res }: { req: NextRequest; res: NextResponse }) => {
  try {
    return createMiddlewareClient<Database>({ req, res });
  } catch (error) {
    logger.error('Error creating Supabase middleware client:', error);
    throw new Error('Failed to initialize Supabase middleware client');
  }
};

// Helper to check if we're on the server side
export const isServer = () => typeof window === 'undefined';

// Get the appropriate client based on the context
export const getSupabaseClient = () => {
  if (isServer()) {
    return createSupabaseServerClient();
  }
  return createSupabaseClient();
}; 
