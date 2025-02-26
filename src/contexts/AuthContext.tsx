"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { getCurrentUser, signOut } from '@/services/auth/client';
import type { UserProfile } from '@/services/auth/types';
import logger from '@/utils/logger';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Helper function to retry a promise with exponential backoff
const withRetry = async <T,>(
    fn: () => Promise<T>,
    maxRetries: number = 2,
    initialDelay: number = 150,
    factor: number = 1.5
): Promise<T> => {
    let lastError: any;
    let delay = initialDelay;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            logger.warn(`AuthContext retry attempt ${attempt}/${maxRetries} failed:`, error);
            
            if (attempt < maxRetries) {
                logger.info(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= factor; // Exponential backoff
            }
        }
    }
    
    throw lastError;
};

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            logger.info('refreshUser: Starting user refresh');
            setLoading(true);
            const currentUser = await getCurrentUser();
            logger.info('refreshUser: User data fetched:', currentUser ? 'success' : 'null');
            setUser(currentUser);
            logger.info('refreshUser: User state updated');
        } catch (error) {
            logger.error('Error refreshing user:', error);
            setUser(null);
        } finally {
            setLoading(false);
            logger.info('refreshUser: Loading state set to false');
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                logger.info('AuthContext: Initializing');
                const supabase = createBrowserClient();
                
                // Use getSession instead of getUser to avoid AuthSessionMissingError
                let sessionData: { data: { session: Session | null }, error: Error | null };
                try {
                    sessionData = await withRetry(() => supabase.auth.getSession(), 1);
                    logger.info('AuthContext: Successfully retrieved session data');
                } catch (sessionError) {
                    logger.error('Error getting session after retries:', sessionError);
                    if (mounted) {
                        setUser(null);
                        setLoading(false);
                    }
                    return;
                }
                
                const { data: { session }, error: sessionError } = sessionData;
                
                if (sessionError) {
                    logger.error('Error getting session:', sessionError);
                    if (mounted) {
                        setUser(null);
                        setLoading(false);
                    }
                    return;
                }
                
                if (session?.user) {
                    logger.info('AuthContext: User found in session, refreshing user data');
                    await refreshUser();
                } else {
                    logger.info('AuthContext: No user in session');
                    if (mounted) {
                        setUser(null);
                        setLoading(false);
                    }
                }
            } catch (error) {
                logger.error('Error during initialization:', error);
                if (mounted) {
                    setUser(null);
                    setLoading(false);
                }
            }
        };

        initialize();

        const supabase = createBrowserClient();
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            logger.info('Auth state changed:', event);
            
            if (!mounted) return;

            if (event === 'SIGNED_OUT') {
                logger.info('AuthContext: User signed out, clearing user data');
                setUser(null);
                setLoading(false);
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                logger.info('AuthContext: User signed in or token refreshed, refreshing user data');
                setTimeout(async () => {
                    if (mounted) {
                        await refreshUser();
                    }
                }, 100);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [refreshUser]);

    const value = {
        user,
        loading,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 