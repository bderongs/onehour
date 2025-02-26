'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import logger from '@/utils/logger';
import { useNotification } from '@/contexts/NotificationContext';

export default function AuthCallback() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useSearchParams();
    const { showNotification } = useNotification();

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            if (!params) {
                logger.error('No search params available');
                router.push('/auth/signin');
                return;
            }

            try {
                // First check if we already have a valid session
                const supabase = createBrowserClient();
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) {
                    logger.error('Error checking session:', sessionError);
                }

                if (session?.user) {
                    logger.info('User already authenticated, redirecting to dashboard');
                    
                    // Check user roles to determine where to redirect
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('roles')
                        .eq('id', session.user.id)
                        .single();

                    if (profile.roles.includes('admin')) {
                        router.push('/admin');
                    } else {
                        router.push('/');
                    }
                    return;
                }

                const tokenHash = params.get('token_hash');
                const type = params.get('type');
                const next = params.get('next');
                
                logger.info('Processing auth callback', { type, hasTokenHash: !!tokenHash, hasNext: !!next });

                // If no parameters and no session, redirect to sign in
                if (!tokenHash || !type) {
                    logger.info('No auth parameters found, redirecting to sign in');
                    router.push('/auth/signin');
                    return;
                }

                // Verify OTP and establish session
                const { data, error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: tokenHash,
                    type: type as any,
                });

                if (verifyError) {
                    logger.error('OTP verification error:', verifyError);
                    throw verifyError;
                }

                if (!data?.user) {
                    throw new Error('Session non établie');
                }

                // For signup or recovery, redirect to password setup
                if (type === 'signup' || type === 'recovery') {
                    let setupPasswordUrl = `/auth/password-setup?token=${tokenHash}`;
                    
                    // Add next URL if provided
                    if (next) {
                        setupPasswordUrl += `&next=${encodeURIComponent(next)}`;
                    }

                    logger.info('Redirecting to password setup', { setupPasswordUrl });
                    router.push(setupPasswordUrl);
                    return;
                }

                // For other types (like email change), redirect to home
                router.push('/');
            } catch (error) {
                logger.error('Error in auth callback:', error);
                setError('Une erreur est survenue lors de la confirmation. Veuillez réessayer.');
                setLoading(false);
            }
        };

        handleEmailConfirmation();
    }, [params, router, showNotification]);

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/auth/signin')}
                        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    return <LoadingSpinner message="Confirmation en cours..." />;
} 
