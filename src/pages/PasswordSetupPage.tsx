import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification } from '../components/Notification';
import { Lock } from 'lucide-react';
import { PasswordRequirements, isPasswordValid, doPasswordsMatch } from '../components/PasswordRequirements';
import logger from '../utils/logger';

export function PasswordSetupPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if we have a valid token in the URL
        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
            logger.error('No token found in URL, redirecting to signin');
            navigate('/signin');
            return;
        }

        // Get the email from the authenticated session
        const getEmail = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) {
                logger.error('No user email found, redirecting to signin');
                navigate('/signin');
                return;
            }
            logger.info('Found user email for password setup', { email: user.email });
            setUserEmail(user.email);
        };

        getEmail();
    }, [location.search, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        if (!isPasswordValid(password)) {
            setNotification({
                type: 'error',
                message: 'Le mot de passe ne respecte pas les critères de sécurité.'
            });
            setLoading(false);
            return;
        }

        if (!doPasswordsMatch(password, confirmPassword)) {
            setNotification({
                type: 'error',
                message: 'Les mots de passe ne correspondent pas.'
            });
            setLoading(false);
            return;
        }

        try {
            const urlParams = new URLSearchParams(location.search);
            const token = urlParams.get('token');
            const next = urlParams.get('next');

            if (!token) {
                throw new Error('Token manquant');
            }

            logger.info('Updating user password');
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            // Sign in with the new password to get a fresh session
            logger.info('Signing in with new password', { email: userEmail });
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: userEmail,
                password: password
            });

            if (signInError) throw signInError;
            if (!signInData.user) throw new Error('Utilisateur non trouvé');

            logger.info('Successfully signed in, waiting for session');
            // Wait for session to be established with a more robust approach
            let session = null;
            let retries = 0;
            const maxRetries = 5;
            
            while (!session && retries < maxRetries) {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                if (currentSession) {
                    session = currentSession;
                    logger.info('Session established');
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay to 1 second
                retries++;
                logger.info(`Retry ${retries} for session establishment`);
            }

            if (!session) {
                throw new Error('Session non établie après plusieurs tentatives');
            }

            // Refresh the session to ensure we have the latest data
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
                logger.error('Error refreshing session:', refreshError);
                throw refreshError;
            }
            if (refreshData.session) {
                session = refreshData.session;
                logger.info('Session refreshed successfully');
            }

            setNotification({
                type: 'success',
                message: 'Votre mot de passe a été configuré avec succès.'
            });

            // If we have a next URL, use it for redirection
            if (next) {
                logger.info('Redirecting to next URL', { next });
                const decodedNext = decodeURIComponent(next);
                
                // Wait a moment for the session to be fully established
                await new Promise(resolve => setTimeout(resolve, 500));

                // Double check that we're still authenticated
                const { data: { session: finalSession } } = await supabase.auth.getSession();
                if (!finalSession) {
                    logger.error('Session lost after password setup');
                    throw new Error('Session perdue après la configuration du mot de passe');
                }

                // If it's a full URL, extract the path
                try {
                    const url = new URL(decodedNext);
                    if (url.origin === window.location.origin) {
                        window.location.href = url.pathname + url.search + url.hash;
                    } else {
                        window.location.href = decodedNext;
                    }
                } catch {
                    // If it's not a valid URL, assume it's a path
                    window.location.href = decodedNext;
                }
                return;
            }

            // Fallback to role-based redirection if no next URL
            const { data: profile } = await supabase
                .from('profiles')
                .select('roles')
                .eq('id', session.user.id)
                .single();

            if (!profile) throw new Error('Profil non trouvé');
            logger.info('Found user profile', { roles: profile.roles });

            if (profile.roles.includes('consultant') || profile.roles.includes('admin')) {
                logger.info('Redirecting consultant/admin to sparks/manage');
                navigate('/sparks/manage', { replace: true });
            } else if (profile.roles.includes('client')) {
                logger.info('Redirecting client to dashboard');
                navigate('/client/dashboard', { replace: true });
            } else {
                throw new Error('Rôle non reconnu');
            }
        } catch (err: any) {
            console.error('Error setting password:', err);
            logger.error('Error in password setup:', err);
            setNotification({
                type: 'error',
                message: err.message || 'Une erreur est survenue'
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
                                disabled={loading || !isPasswordValid(password) || !doPasswordsMatch(password, confirmPassword)}
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