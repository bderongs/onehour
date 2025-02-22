"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '../services/auth';
import type { UserProfile } from '../services/auth';
import logger from '../utils/logger';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

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
            setLoading(true);
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            logger.error('Error refreshing user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                // Check if we have a session
                const { data: { session } } = await supabase().auth.getSession();
                
                if (session) {
                    // If we have a session, refresh the user data
                    await refreshUser();
                } else {
                    // If no session, clear the user and loading state
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

        // Initial auth state check
        initialize();

        // Subscribe to auth state changes
        const {
            data: { subscription },
        } = supabase().auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            logger.info('Auth state changed:', event);
            
            if (!mounted) return;

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                await refreshUser();
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