import { ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../services/auth';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: UserRole[];
    consultantIdParam?: string; // Parameter name for consultant ID in URL
}

export function ProtectedRoute({ children, requiredRoles, consultantIdParam }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const params = useParams();

    // Handle authentication loading state
    if (loading) {
        return <LoadingSpinner message="Vérification de l'authentification..." />;
    }

    // If not authenticated, redirect to sign in with return URL
    if (!user) {
        const returnUrl = encodeURIComponent(window.location.pathname);
        return <Navigate to={`/signin?returnUrl=${returnUrl}`} replace />;
    }

    // Check roles requirement if specified
    if (requiredRoles && !requiredRoles.some(role => user.roles.includes(role))) {
        return <Navigate to="/" replace />;
    }

    // Check consultant ID match if specified
    if (consultantIdParam && params[consultantIdParam]) {
        const urlConsultantId = params[consultantIdParam];
        if (user.id !== urlConsultantId && !user.roles.includes('admin')) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
} 