import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification } from '../components/Notification';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [_errorType, setErrorType] = useState<string | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        // If user is already authenticated, redirect them
        if (user && !authLoading) {
            const returnUrl = searchParams.get('returnUrl');
            if (returnUrl) {
                navigate(returnUrl);
            } else if (user.roles.includes('consultant') || user.roles.includes('admin')) {
                navigate('/sparks/manage');
            } else if (user.roles.includes('client')) {
                navigate('/client/dashboard');
            }
        }
    }, [user, authLoading, navigate, searchParams]);

    useEffect(() => {
        // Check for error messages in URL
        const errorMessage = searchParams.get('message');
        const error = searchParams.get('error');
        setErrorType(error);
        
        if (errorMessage) {
            setNotification({
                type: 'error',
                message: errorMessage
            });
            // Pre-fill email if it's in the URL
            const emailParam = searchParams.get('email');
            if (emailParam) {
                setEmail(emailParam);
            }
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                if (signInError.message.includes('Invalid login credentials')) {
                    throw new Error('Email ou mot de passe incorrect.');
                }
                throw signInError;
            }

            // Wait for session to be established
            let session = null;
            let retries = 0;
            const maxRetries = 5;
            
            while (!session && retries < maxRetries) {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                if (currentSession) {
                    session = currentSession;
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
                retries++;
            }

            if (!session) {
                throw new Error('Session non établie après plusieurs tentatives');
            }

            // Refresh the session to ensure we have the latest data
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) throw refreshError;
            if (refreshData.session) {
                session = refreshData.session;
            }

            // Get user profile and roles
            const { data: profile } = await supabase
                .from('profiles')
                .select('roles')
                .eq('id', session.user.id)
                .single();

            if (!profile) throw new Error('Profil non trouvé');

            // Wait a moment for the session to be fully established
            await new Promise(resolve => setTimeout(resolve, 500));

            // Double check that we're still authenticated
            const { data: { session: finalSession } } = await supabase.auth.getSession();
            if (!finalSession) {
                throw new Error('Session perdue après la connexion');
            }

            // Get return URL if any
            const returnUrl = searchParams.get('returnUrl');

            // Use window.location.href for redirection to ensure a full page reload
            if (returnUrl) {
                window.location.href = returnUrl;
            } else if (profile.roles.includes('consultant') || profile.roles.includes('admin')) {
                window.location.href = '/sparks/manage';
            } else if (profile.roles.includes('client')) {
                window.location.href = '/client/dashboard';
            } else {
                throw new Error('Rôle non reconnu');
            }
        } catch (error: any) {
            setNotification({
                type: 'error',
                message: error.message || 'Une erreur est survenue lors de la connexion.'
            });
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        navigate('/reset-password');
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="max-w-md w-full">
                <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Connectez-vous à votre compte
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Vous n'avez pas encore de compte ?{' '}
                            <Link
                                to="/signup"
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