'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { PasswordRequirements, isPasswordValid, doPasswordsMatch } from '../components/PasswordRequirements';
import logger from '@/utils/logger';
import { useNotification } from '@/contexts/NotificationContext';

export default function PasswordSetupPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        // Check if we have a valid token in the URL
        const token = params?.get('token');
        if (!token) {
            logger.error('No token found in URL, redirecting to signin');
            router.push('/signin');
            return;
        }

        // Get the email from the authenticated session
        const getEmail = async () => {
            const { data: { user } } = await createBrowserClient().auth.getUser();
            if (!user?.email) {
                logger.error('No user email found, redirecting to signin');
                router.push('/signin');
                return;
            }
            logger.info('Found user email for password setup', { email: user.email });
            setUserEmail(user.email);
        };

        getEmail();
    }, [params, router]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!isPasswordValid(password)) {
            showNotification('error', 'Le mot de passe ne respecte pas les critères de sécurité.');
            setLoading(false);
            return;
        }

        if (!doPasswordsMatch(password, confirmPassword)) {
            showNotification('error', 'Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        try {
            const token = params?.get('token');
            const next = params?.get('next');

            if (!token) {
                throw new Error('Token manquant');
            }

            logger.info('Updating user password');
            const { error } = await createBrowserClient().auth.updateUser({ password });

            if (error) throw error;

            // Sign in with the new password to get a fresh session
            logger.info('Signing in with new password', { email: userEmail });
            const { data: signInData, error: signInError } = await createBrowserClient().auth.signInWithPassword({
                email: userEmail,
                password: password
            });

            if (signInError) {
                logger.error('Error signing in with new password:', signInError);
                throw signInError;
            }
            if (!signInData.user) {
                logger.error('No user returned after sign in');
                throw new Error('Utilisateur non trouvé');
            }

            logger.info('Successfully signed in, waiting for session', { userId: signInData.user.id });
            // Wait for session to be established with a more robust approach
            let session = null;
            let retries = 0;
            const maxRetries = 5;
            
            while (!session && retries < maxRetries) {
                const { data: { session: currentSession } } = await createBrowserClient().auth.getSession();
                if (currentSession) {
                    session = currentSession;
                    logger.info('Session established', { userId: session.user.id });
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
                retries++;
                logger.info(`Retry ${retries}/${maxRetries} for session establishment`);
            }

            if (!session) {
                logger.error('Failed to establish session after maximum retries');
                throw new Error('Session non établie après plusieurs tentatives');
            }

            // Refresh the session to ensure we have the latest data
            const { data: refreshData, error: refreshError } = await createBrowserClient().auth.refreshSession();
            if (refreshError) {
                logger.error('Error refreshing session:', refreshError);
                throw refreshError;
            }
            if (refreshData.session) {
                session = refreshData.session;
                logger.info('Session refreshed successfully');
            }

            showNotification('success', 'Votre mot de passe a été configuré avec succès.');

            // If we have a next URL, use it for redirection
            if (next) {
                logger.info('Redirecting to next URL', { next });
                const decodedNext = decodeURIComponent(next);
                
                // Wait a moment for the session to be fully established
                await new Promise(resolve => setTimeout(resolve, 1500));

                try {
                    // Double check that we're still authenticated
                    const { data: { session: finalSession } } = await createBrowserClient().auth.getSession();
                    if (!finalSession) {
                        logger.error('Session lost after password setup');
                        throw new Error('Session perdue après la configuration du mot de passe');
                    }

                    logger.info('Starting redirection to', { url: decodedNext });
                    window.location.href = decodedNext;
                    return;
                } catch (error) {
                    logger.error('Error during redirection:', error);
                    throw error;
                }
            }

            // Fallback to role-based redirection if no next URL
            // Wait a moment for the session to be fully established
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const { data: profile } = await createBrowserClient()
                .from('profiles')
                .select('roles')
                .eq('id', session.user.id)
                .single();

            if (!profile) throw new Error('Profil non trouvé');
            logger.info('Found user profile', { roles: profile.roles });

            if (profile.roles.includes('consultant') || profile.roles.includes('admin')) {
                logger.info('Redirecting consultant/admin to sparks/manage', { roles: profile.roles });
                window.location.href = '/sparks/manage';
            } else if (profile.roles.includes('client')) {
                logger.info('Redirecting client to dashboard', { roles: profile.roles });
                window.location.href = '/client/dashboard';
            } else {
                logger.error('Unrecognized user role', { roles: profile.roles });
                throw new Error('Rôle non reconnu');
            }
        } catch (err: any) {
            console.error('Error setting password:', err);
            logger.error('Error in password setup:', err);
            showNotification('error', err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Configuration du mot de passe
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Choisissez un mot de passe sécurisé pour votre compte
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Hidden email field for password managers */}
                        <input
                            type="email"
                            name="username"
                            autoComplete="username"
                            value={userEmail}
                            readOnly
                            className="hidden"
                        />

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Nouveau mot de passe"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="sr-only">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirmer le mot de passe"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <PasswordRequirements 
                            password={password}
                            confirmPassword={confirmPassword}
                        />

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                                    </span>
                                ) : null}
                                {loading ? 'Configuration en cours...' : 'Configurer le mot de passe'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 