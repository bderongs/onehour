/**
 * Authentication client-side services for user management
 * Provides functions to get the current user and sign out
 */

import { createBrowserClient } from '@/lib/supabase/client';
import logger from '@/utils/logger';
import type { UserProfile } from './types';
import { transformProfileFromDB } from './types';
import type { User, Session } from '@supabase/supabase-js';

// Helper function to create a promise that rejects after a timeout
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(errorMessage));
        }, timeoutMs);
    });

    return Promise.race([
        promise,
        timeoutPromise
    ]).finally(() => {
        clearTimeout(timeoutId);
    }) as Promise<T>;
};

// Helper function to retry a promise with exponential backoff
const withRetry = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 300,
    factor: number = 2
): Promise<T> => {
    let lastError: any;
    let delay = initialDelay;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            logger.warn(`Attempt ${attempt}/${maxRetries} failed:`, error);
            
            if (attempt < maxRetries) {
                logger.info(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= factor; // Exponential backoff
            }
        }
    }
    
    throw lastError;
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
    try {
        const client = createBrowserClient();
        
        // Use a timeout to prevent hanging requests
        const timeoutPromise = new Promise<null>((_, reject) => {
            setTimeout(() => reject(new Error('Auth request timed out')), 3000); // 3 second timeout
        });
        
        // Create the session request with proper type annotations
        const sessionPromise = client.auth.getSession().then(async ({ 
            data: { session }, 
            error 
        }: { 
            data: { session: Session | null }, 
            error: Error | null 
        }) => {
            if (error) {
                logger.error('Error getting session:', error);
                return null;
            }
            
            if (!session?.user) {
                logger.info('No active session found');
                return null;
            }
            
            // Fetch profile data
            const { data: profile, error: profileError } = await client
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
            if (profileError) {
                logger.error('Error getting user profile:', profileError);
                return null;
            }
            
            return transformProfileFromDB(profile);
        });
        
        // Race the session request against the timeout
        return await Promise.race([sessionPromise, timeoutPromise]);
    } catch (error) {
        logger.error('Error in getCurrentUser:', error);
        return null;
    }
};

export const signOut = async (): Promise<void> => {
    try {
        const client = createBrowserClient();
        
        // Verify client is properly initialized
        if (!client || !client.auth) {
            logger.error('signOut: Supabase client not properly initialized');
            throw new Error('Supabase client not properly initialized');
        }
        
        logger.info('signOut: Calling auth.signOut()');
        const signOutResponse: { error: Error | null } = await withTimeout(
            client.auth.signOut(),
            15000, // 15 seconds timeout (increased from 10)
            'Auth signOut request timed out after 15 seconds'
        );
        if (signOutResponse.error) {
            logger.error('signOut: Error in auth.signOut():', signOutResponse.error);
            throw signOutResponse.error;
        }
        logger.info('signOut: Successfully signed out');
    } catch (error) {
        logger.error('Error in signOut:', error);
        throw error;
    }
}; 