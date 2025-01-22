import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification } from '../components/Notification';
import { Mail, Lock } from 'lucide-react';

export function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [errorType, setErrorType] = useState<string | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

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
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Email ou mot de passe incorrect.');
                }
                throw error;
            }

            // Get user role and redirect accordingly
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Utilisateur non trouvé');

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (!profile) throw new Error('Profil non trouvé');

            // Redirect based on role
            switch (profile.role) {
                case 'consultant':
                    navigate('/sparks/manage');
                    break;
                case 'admin':
                    navigate('/sparks/manage');
                    break;
                case 'client':
                    navigate('/client/dashboard');
                    break;
                default:
                    throw new Error('Rôle non reconnu');
            }
        } catch (error: any) {
            setNotification({
                type: 'error',
                message: error.message || 'Une erreur est survenue lors de la connexion.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!isPasswordResetMode) {
            setIsPasswordResetMode(true);
            return;
        }

        if (!email) {
            setNotification({
                type: 'error',
                message: 'Veuillez entrer votre adresse email pour réinitialiser votre mot de passe.'
            });
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback`,
            });

            if (error) throw error;

            setNotification({
                type: 'success',
                message: 'Un email de réinitialisation de mot de passe vous a été envoyé.'
            });
            setIsPasswordResetMode(false);
        } catch (error: any) {
            setNotification({
                type: 'error',
                message: error.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.'
            });
        }
    };

    const handleResendConfirmation = async () => {
        if (!email) {
            setNotification({
                type: 'error',
                message: 'Veuillez entrer votre adresse email pour recevoir un nouveau lien de confirmation.'
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;

            setNotification({
                type: 'success',
                message: 'Un nouveau lien de confirmation vous a été envoyé par email.'
            });
        } catch (error: any) {
            setNotification({
                type: 'error',
                message: error.message || 'Une erreur est survenue lors de l\'envoi du lien de confirmation.'
            });
        } finally {
            setLoading(false);
        }
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
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md space-y-6">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isPasswordResetMode
                            ? 'Réinitialisation du mot de passe'
                            : (errorType === 'expired_confirmation' || errorType === 'invalid_token')
                                ? 'Renvoyer le lien de confirmation'
                                : 'Connectez-vous à votre compte'
                        }
                    </h2>
                    {(errorType !== 'expired_confirmation' && errorType !== 'invalid_token' && !isPasswordResetMode) && (
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Vous n'avez pas encore de compte ?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Inscrivez-vous
                            </button>
                        </p>
                    )}
                    {isPasswordResetMode && (
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Nous vous enverrons un email avec les instructions pour réinitialiser votre mot de passe.
                        </p>
                    )}
                </div>
                {(errorType === 'expired_confirmation' || errorType === 'invalid_token') ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleResendConfirmation(); }} className="mt-8 space-y-6">
                        <div className="rounded-md">
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
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Adresse email"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                                </span>
                            ) : null}
                            {loading ? 'Envoi en cours...' : 'Renvoyer le lien de confirmation'}
                        </button>
                    </form>
                ) : isPasswordResetMode ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }} className="mt-8 space-y-6">
                        <div className="rounded-md">
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
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Adresse email"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsPasswordResetMode(false)}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Retour
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Envoi...' : 'Envoyer'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordResetMode(true)}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                )}
            </div>
        </div>
    );
} 