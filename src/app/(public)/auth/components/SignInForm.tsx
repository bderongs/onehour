/**
 * SignInForm.tsx
 * 
 * This component handles user authentication through email and password.
 * It provides a form for users to enter their credentials and manages the sign-in process,
 * including error handling and redirection based on user roles.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import logger from '@/utils/logger';
import { getCurrentUser, signOut } from '@/services/auth/client';

// Define authentication stages for better UI state management
type AuthStage = 'idle' | 'authenticating' | 'redirecting';

export default function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authStage, setAuthStage] = useState<AuthStage>('idle');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();
    const { showNotification } = useNotification();

    // Add a timeout to prevent the sign-in process from getting stuck
    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;
        
        if (authStage !== 'idle') {
            timeoutId = setTimeout(() => {
                logger.error('Sign-in process timed out after 15 seconds');
                setAuthStage('idle');
                showNotification('error', 'La connexion a pris trop de temps. Veuillez réessayer.');
            }, 15000); // 15 seconds timeout
        }
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [authStage, showNotification]);

    // Check if user is already signed in and sign them out on component mount
    useEffect(() => {
        const checkAndSignOut = async () => {
            try {
                const supabase = createBrowserClient();
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user) {
                    logger.info('User already signed in, signing out first...');
                    await signOut();
                    logger.info('Successfully signed out');
                }
            } catch (error) {
                logger.error('Error checking auth state:', error);
            }
        };
        
        checkAndSignOut();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        // Prevent default form submission which would expose credentials in URL
        e.preventDefault();
        
        if (authStage !== 'idle') return;
        
        setAuthStage('authenticating');
        logger.info('Starting sign-in process...');

        try {
            logger.info('Attempting to sign in with email...');
            const supabase = createBrowserClient();
            
            // First, ensure we're starting with a clean state
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    logger.info('Existing session found, signing out first for clean login');
                    await supabase.auth.signOut();
                    // Reduced delay to ensure signout is processed
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } catch (sessionError) {
                logger.warn('Error checking session before login:', sessionError);
                // Continue with sign-in attempt even if this fails
            }
            
            // Now attempt to sign in
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

            if (!signInData?.user) {
                logger.error('Sign-in successful but no user returned');
                throw new Error('Authentification réussie mais aucun utilisateur trouvé.');
            }

            logger.info('Sign-in successful, user ID:', signInData.user.id);
            
            // Update state to show we're now redirecting
            setAuthStage('redirecting');
            
            // Use window.location.href for redirection to ensure a full page reload
            const returnUrl = searchParams?.get('returnUrl');
            
            // Reduced delay before redirection to improve perceived performance
            // while still giving time for the auth state to propagate
            setTimeout(() => {
                try {
                    if (returnUrl) {
                        logger.info(`Redirecting to return URL: ${returnUrl}`);
                        window.location.href = returnUrl;
                    } else {
                        // Check user roles to determine where to redirect
                        logger.info('Checking user roles for redirection');
                        
                        // We'll use the session user ID to fetch the profile directly
                        // This avoids relying on the AuthContext which might not be updated yet
                        supabase
                            .from('profiles')
                            .select('roles')
                            .eq('id', signInData.user.id)
                            .single()
                            .then(({ data: profile, error: profileError }: { data: { roles: ("consultant" | "admin" | "client")[] } | null, error: Error | null }) => {
                                if (profileError || !profile) {
                                    logger.error('Error fetching user profile for redirection:', profileError);
                                    window.location.href = '/';
                                    return;
                                }
                                
                                logger.info('User roles for redirection:', profile.roles);
                                
                                if (profile.roles.includes('admin')) {
                                    window.location.href = '/admin/dashboard';
                                } else if (profile.roles.includes('consultant')) {
                                    window.location.href = '/sparks/manage';
                                } else if (profile.roles.includes('client')) {
                                    window.location.href = '/client/dashboard';
                                } else {
                                    window.location.href = '/';
                                }
                            })
                            .catch((error: Error) => {
                                logger.error('Error in profile fetch for redirection:', error);
                                window.location.href = '/';
                            });
                    }
                } catch (error) {
                    logger.error('Error during redirection:', error);
                    showNotification('error', 'Erreur lors de la redirection. Veuillez réessayer.');
                    // If redirection fails, reload the page as a fallback
                    window.location.reload();
                }
            }, 500); // Reduced from 1000ms to 500ms
        } catch (error: any) {
            logger.error('Error during sign-in:', error);
            showNotification('error', error.message || 'Une erreur est survenue lors de la connexion');
            setAuthStage('idle');
        }
    };

    // Get button text based on current auth stage
    const getButtonText = () => {
        switch (authStage) {
            case 'authenticating':
                return 'Connexion en cours...';
            case 'redirecting':
                return 'Redirection...';
            default:
                return 'Se connecter';
        }
    };

    return (
        <form 
            className="space-y-6" 
            onSubmit={handleSubmit} 
            method="POST"
            action="#" // Add action attribute to prevent form from submitting to the current URL
        >
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
                        disabled={authStage !== 'idle'}
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
                        disabled={authStage !== 'idle'}
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
                    disabled={authStage !== 'idle'}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        authStage !== 'idle' ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                >
                    {authStage !== 'idle' && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {getButtonText()}
                </button>
            </div>
        </form>
    );
} 