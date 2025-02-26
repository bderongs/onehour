"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { getCurrentUser, signOut } from '@/services/auth/client';
import type { UserProfile } from '@/services/auth/types';
import logger from '@/utils/logger';
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
                const supabase = createBrowserClient();
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                
                if (userError) {
                    logger.error('Error getting user:', userError);
                    if (mounted) {
                        setUser(null);
                        setLoading(false);
                    }
                    return;
                }
                
                if (user) {
                    await refreshUser();
                } else {
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