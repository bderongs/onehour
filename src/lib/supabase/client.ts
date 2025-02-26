/**
 * client.ts
 * This file provides Supabase clients for client-side operations.
 * It includes error handling and environment variable validation.
 */
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
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

// Create an in-memory storage provider to help with auth session issues
const createInMemoryStorageProvider = () => {
  const items = new Map<string, string>();
  return {
    getItem: (key: string) => items.get(key) || null,
    setItem: (key: string, value: string) => {
      items.set(key, value);
    },
    removeItem: (key: string) => {
      items.delete(key);
    },
  };
};

// Cache the client to avoid creating multiple instances
let browserClientInstance: any = null;

// Export a wrapped version of createBrowserClient that includes the required arguments
export const createBrowserClient = () => {
  try {
    // Return cached instance if available
    if (browserClientInstance) {
      logger.info('Using cached Supabase browser client');
      return browserClientInstance;
    }

    logger.info('Creating new Supabase browser client');
    const { supabaseUrl, supabaseKey } = getEnvVars();
    
    // Create a new client instance with in-memory storage
    browserClientInstance = createSupabaseBrowserClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          // Use in-memory storage to help mitigate "Auth Session Missing" issues
          // This is a workaround for a known bug in Supabase auth-js
          // See: https://github.com/supabase/auth-js/issues/948
          storage: createInMemoryStorageProvider(),
          persistSession: true,
          autoRefreshToken: true,
        }
      }
    );
    
    logger.info('Supabase browser client created successfully');
    return browserClientInstance;
  } catch (error) {
    logger.error('Error creating browser client:', error);
    throw new Error('Failed to initialize Supabase browser client');
  }
}

// Creates a Supabase client for client-side operations
export const createClient = () => {
  try {
    const { supabaseUrl, supabaseKey } = getEnvVars()
    logger.info('Creating browser client with URL:', supabaseUrl.substring(0, 20) + '...');
    
    return createSupabaseBrowserClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          // Use in-memory storage to help mitigate "Auth Session Missing" issues
          storage: createInMemoryStorageProvider(),
          persistSession: true,
          autoRefreshToken: true,
        }
      }
    )
  } catch (error) {
    logger.error('Error creating browser client:', error)
    // Add more detailed error information
    if (error instanceof Error) {
      logger.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack trace
      });
    }
    throw new Error('Failed to initialize Supabase browser client')
  }
} 