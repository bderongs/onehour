'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/utils/logger';

export default function AuthRedirect() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && user) {
            logger.info('User already authenticated, redirecting...');
            if (user.roles.includes('admin')) {
                router.push('/admin/dashboard');
            } else if (user.roles.includes('consultant')) {
                router.push('/sparks/manage');
            } else if (user.roles.includes('client')) {
                router.push('/client/dashboard');
            }
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return <div>Redirection en cours...</div>;
    }

    return null;
} 