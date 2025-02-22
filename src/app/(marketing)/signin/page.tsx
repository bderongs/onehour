'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        
        setLoading(true);
        logger.info('Starting sign-in process...');

        try {
            logger.info('Attempting to sign in with email...');
            const supabase = createBrowserClient();
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
            logger.error('Error during sign-in:', error);
            showNotification('error', error.message || 'Une erreur est survenue lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // If already authenticated, redirect based on role
        if (!authLoading && user) {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Connexion
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ou{' '}
                        <Link
                            href="/consultants#signup-form"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            créez votre compte consultant
                        </Link>
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="vous@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
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
                                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link
                                    href="/auth/reset-password"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 