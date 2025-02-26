'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/utils/logger';

export default function AuthRedirect() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        // Only set redirecting if we have a user and are loading
        // This prevents showing the message during initial auth check
        if (authLoading && user) {
            setIsRedirecting(true);
        } else {
            setIsRedirecting(false);
        }

        // Handle actual redirection when auth is loaded and user exists
        if (!authLoading && user) {
            logger.info('User already authenticated, redirecting...');
            setIsRedirecting(true);
            
            if (user.roles.includes('admin')) {
                router.push('/admin/dashboard');
            } else if (user.roles.includes('consultant')) {
                router.push('/sparks/manage');
            } else if (user.roles.includes('client')) {
                router.push('/client/dashboard');
            }
        }
    }, [user, authLoading, router]);

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