'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../services/auth';
import { LoadingSpinner } from './ui/LoadingSpinner';
import logger from '@/utils/logger';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: UserRole[];
    consultantIdParam?: string; // Parameter name for consultant ID in URL
    fallbackUrl?: string; // Optional custom fallback URL
}

export function ProtectedRoute({ 
    children, 
    requiredRoles, 
    consultantIdParam,
    fallbackUrl = '/'
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams() as Record<string, string>;

    useEffect(() => {
        if (loading) return;

    // If not authenticated, redirect to sign in with return URL
        if (!user) {
            logger.info('User not authenticated, redirecting to signin');
            const returnUrl = encodeURIComponent(window.location.pathname);
            router.push(`/auth/signin?returnUrl=${returnUrl}`);
            return;
        }

    // Check roles requirement if specified
        if (requiredRoles && !requiredRoles.some(role => user.roles.includes(role))) {
            logger.info('User does not have required role, redirecting', {
                userRoles: user.roles,
                requiredRoles
            });
            router.push(fallbackUrl);
            return;
        }

    // Check consultant ID match if specified
        if (consultantIdParam && params[consultantIdParam]) {
            const urlConsultantId = params[consultantIdParam];
            if (user.id !== urlConsultantId && !user.roles.includes('admin')) {
                logger.info('User does not have access to this consultant resource', {
                    userId: user.id,
                    consultantId: urlConsultantId
                });
                router.push(fallbackUrl);
                return;
            }
        }
    }, [user, loading, requiredRoles, consultantIdParam, params, router, fallbackUrl]);

    // Show loading state while checking auth
    if (loading) {
        return <LoadingSpinner message="Vérification de l'authentification..." />;
    }

    // Show loading state during redirect
    if (
        !user || 
        (requiredRoles && !requiredRoles.some(role => user.roles.includes(role))) ||
        (consultantIdParam && params[consultantIdParam] && 
         user.id !== params[consultantIdParam] && !user.roles.includes('admin'))
    ) {
        return <LoadingSpinner message="Redirection..." />;
    }

    return <>{children}</>;
} 