'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/utils/logger';

export default function AuthRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading, refreshUser } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [redirectAttempts, setRedirectAttempts] = useState(0);
    const [lastRefreshTime, setLastRefreshTime] = useState(0);

    // Extract returnUrl from search params if available
    const returnUrl = searchParams?.get('returnUrl');

    // Function to handle redirection based on user roles
    const performRedirect = useCallback(() => {
        try {
            logger.info('Performing redirection with user roles:', user?.roles);
            
            // If we have a returnUrl, use that first
            if (returnUrl) {
                logger.info(`Redirecting to return URL: ${returnUrl}`);
                window.location.href = returnUrl;
                return;
            }
            
            // Otherwise redirect based on role
            if (user?.roles?.includes('admin')) {
                logger.info('Redirecting admin to dashboard');
                window.location.href = '/admin/dashboard';
            } else if (user?.roles?.includes('consultant')) {
                logger.info('Redirecting consultant to sparks/manage');
                window.location.href = '/sparks/manage';
            } else if (user?.roles?.includes('client')) {
                logger.info('Redirecting client to dashboard');
                window.location.href = '/client/dashboard';
            } else {
                // Fallback to home page if no specific role
                logger.info('No specific role found, redirecting to home page');
                window.location.href = '/';
            }
        } catch (error) {
            logger.error('Error during redirection:', error);
            setRedirectAttempts(prev => prev + 1);
        }
    }, [user, returnUrl]);

    // Effect to handle user authentication state
    useEffect(() => {
        // Skip if still loading
        if (authLoading) {
            return;
        }
        
        // If we have a user, redirect
        if (user) {
            logger.info('User already authenticated, redirecting...', { 
                attempt: redirectAttempts + 1,
                roles: user.roles 
            });
            
            setIsRedirecting(true);
            
            // Add a small delay before redirection to ensure all auth state is properly updated
            const redirectTimer = setTimeout(performRedirect, 500);
            return () => clearTimeout(redirectTimer);
        } else {
            // If no user and not loading, try refreshing user data once
            const now = Date.now();
            if (now - lastRefreshTime > 2000) { // Only refresh if it's been more than 2 seconds
                logger.info('No user found, attempting to refresh user data');
                setLastRefreshTime(now);
                refreshUser().catch(err => {
                    logger.error('Error refreshing user data:', err);
                });
            }
            
            setIsRedirecting(false);
        }
    }, [user, authLoading, redirectAttempts, performRedirect, refreshUser, lastRefreshTime]);

    // Effect to handle redirect attempts
    useEffect(() => {
        if (redirectAttempts >= 3) {
            logger.info('Too many redirect attempts, forcing page reload');
            window.location.reload();
        }
    }, [redirectAttempts]);

    // Add a timeout to prevent getting stuck in redirection state
    useEffect(() => {
        if (isRedirecting) {
            const stuckTimer = setTimeout(() => {
                logger.info('Redirection taking too long, forcing page reload');
                window.location.reload();
            }, 15000); // 15 seconds timeout (increased from 10)
            
            return () => clearTimeout(stuckTimer);
        }
    }, [isRedirecting]);

    // Only show the message if we're actually redirecting
    if (isRedirecting) {
        return (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm shadow-md">
                Redirection en cours...
            </div>
        );
    }

    return null;
} 