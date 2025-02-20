'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import logger from '@/utils/logger';
import { useNotification } from '@/contexts/NotificationContext';

export default function AuthCallback() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showNotification } = useNotification();

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            try {
                // First check if we already have a valid session
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    logger.info('Valid session found, skipping confirmation flow');
                    router.push('/');
                    return;
                }

                const tokenHash = searchParams.get('token_hash');
                const type = searchParams.get('type');
                const next = searchParams.get('next');
                
                logger.info('Processing auth callback', { type, hasTokenHash: !!tokenHash, hasNext: !!next });

                // If no parameters and no session, redirect to sign in
                if (!tokenHash || !type) {
                    logger.info('No auth parameters found, redirecting to sign in');
                    router.push('/signin');
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
                    let setupPasswordUrl = `/setup-password?token=${tokenHash}`;
                    
                    // Add next URL if provided
                    if (next) {
                        setupPasswordUrl += `&next=${encodeURIComponent(next)}`;
                    }

                    logger.info('Redirecting to password setup', { setupPasswordUrl });
                    router.push(setupPasswordUrl);
                    return;
                }

                // For other types (like magic link), redirect to the next URL or default location
                const redirectUrl = next || '/';
                logger.info('Redirecting to', { redirectUrl });
                router.push(redirectUrl);

            } catch (err: any) {
                logger.error('Error during email confirmation:', err);
                const email = searchParams.get('email') || '';
                const errorMessage = err.message || 'Une erreur est survenue lors de la confirmation';
                setError(errorMessage);
                showNotification('error', errorMessage);
                // Redirect to signin with just the email parameter
                router.push(`/signin?email=${encodeURIComponent(email)}`);
            } finally {
                setLoading(false);
            }
        };

        handleEmailConfirmation();
    }, [router, searchParams, showNotification]);

    if (loading) {
        return <LoadingSpinner message="Vérification de votre email..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                    <div className="text-center mt-4">
                        <p className="text-gray-600">
                            Veuillez réessayer de vous connecter.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
} 
