'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import logger from '@/utils/logger';
import { getCurrentUser } from '@/services/auth';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading, refreshUser } = useAuth();
    const { showNotification } = useNotification();
    const supabase = createClientComponentClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        
        setLoading(true);
        logger.info('Starting sign-in process...');

        try {
            logger.info('Attempting to sign in with email...');
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                logger.error('Sign-in error:', signInError);
                if (signInError.message.includes('Invalid login credentials')) {
                    throw new Error('Email ou mot de passe incorrect.');
                }
                throw signInError;
            }

            logger.info('Sign-in successful, waiting for session...');
            
            // Wait for session to be established
            let session = signInData.session;
            if (!session) {
                logger.error('No session established after sign in');
                throw new Error('Session non établie après la connexion');
            }

            // Force refresh the auth context
            await refreshUser();
            
            // Handle redirect immediately after successful sign-in
            const returnUrl = searchParams?.get('returnUrl');
            if (returnUrl) {
                window.location.href = returnUrl;
            } else {
                const currentUser = await getCurrentUser();
                if (currentUser?.roles.includes('admin')) {
                    window.location.href = '/admin/dashboard';
                } else if (currentUser?.roles.includes('consultant')) {
                    window.location.href = '/sparks/manage';
                } else if (currentUser?.roles.includes('client')) {
                    window.location.href = '/client/dashboard';
                }
            }
        } catch (error: any) {
            logger.error('Sign-in process failed:', error);
            showNotification('error', error.message || 'Une erreur est survenue lors de la connexion.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchParams) {
            // Pre-fill email if it's in the URL
            const emailParam = searchParams.get('email');
            if (emailParam) {
                setEmail(emailParam);
            }

            // Display error message if present
            const errorMessage = searchParams.get('message');
            if (errorMessage) {
                showNotification('error', errorMessage);
            }
        }
    }, [searchParams, showNotification]);

    // If already authenticated, redirect immediately
    useEffect(() => {
        if (user && !authLoading) {
            const returnUrl = searchParams?.get('returnUrl');
            if (returnUrl) {
                window.location.href = returnUrl;
            } else if (user.roles.includes('admin')) {
                window.location.href = '/admin/dashboard';
            } else if (user.roles.includes('consultant')) {
                window.location.href = '/sparks/manage';
            } else if (user.roles.includes('client')) {
                window.location.href = '/client/dashboard';
            }
        }
    }, [user, authLoading, searchParams]);

    const handleForgotPassword = () => {
        router.push('/auth/reset-password');
    };

    // If already authenticated, show loading state
    if (user && !authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Redirection en cours...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Connectez-vous à votre compte
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Vous n'avez pas encore de compte ?{' '}
                            <Link
                                href="/signup"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Créer un compte
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Adresse email"
                                    />
                                </div>
                            </div>
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
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Mot de passe"
                                    />
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Le mot de passe doit contenir au moins 8 caractères et inclure des lettres et des chiffres.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                        </div>

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
                                {loading ? 'Connexion en cours...' : 'Se connecter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 