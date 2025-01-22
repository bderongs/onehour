import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification } from '../components/Notification';

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const setupSession = async () => {
            try {
                // First check if we already have a session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) throw sessionError;

                if (session) {
                    // User is authenticated, show password form
                    setShowPasswordForm(true);
                    setLoading(false);
                } else {
                    // Check for error in URL parameters first
                    const urlParams = new URLSearchParams(window.location.search);
                    const code = urlParams.get('code');
                    const email = urlParams.get('email') || '';

                    // Debug logging
                    console.log('URL Search params:', {
                        fullUrl: window.location.href,
                        search: window.location.search,
                        params: Object.fromEntries(urlParams.entries()),
                        code
                    });

                    // Handle various error cases
                    if (urlParams.get('error') === 'access_denied' && urlParams.get('error_code') === 'otp_expired') {
                        navigate(`/signin?error=expired_confirmation&message=Le lien de confirmation a expiré. Veuillez vous inscrire à nouveau pour recevoir un nouveau lien.&email=${encodeURIComponent(email)}`);
                        return;
                    }

                    if (urlParams.get('error_description')) {
                        const errorDesc = urlParams.get('error_description') || '';
                        if (errorDesc.includes('expired')) {
                            navigate(`/signin?error=expired_confirmation&message=Le lien de confirmation a expiré. Veuillez vous inscrire à nouveau pour recevoir un nouveau lien.&email=${encodeURIComponent(email)}`);
                        } else {
                            navigate(`/signin?error=auth_error&message=${encodeURIComponent(errorDesc)}&email=${encodeURIComponent(email)}`);
                        }
                        return;
                    }

                    // If we have a code, exchange it for a session
                    if (code) {
                        // The code is present in the URL, exchange it for a session
                        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

                        if (error) {
                            console.error('Error exchanging code for session:', error);
                            throw error;
                        }

                        if (data?.session) {
                            setShowPasswordForm(true);
                        } else {
                            throw new Error('No session established after code exchange');
                        }
                    } else {
                        // Check for tokens in hash params as fallback
                        const hashParams = new URLSearchParams(window.location.hash.substring(1));
                        const accessToken = hashParams.get('access_token');
                        const refreshToken = hashParams.get('refresh_token');

                        if (!accessToken) {
                            console.error('No code or access token found in URL');
                            navigate(`/signin?error=invalid_token&message=Le lien de confirmation est invalide. Veuillez entrer votre email pour en recevoir un nouveau.&email=${encodeURIComponent(email)}`);
                            return;
                        }

                        // Try to set the session with the tokens
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken || '',
                        });

                        if (error) {
                            console.error('Error setting session:', error);
                            throw error;
                        }

                        if (data?.session) {
                            setShowPasswordForm(true);
                        } else {
                            throw new Error('No session established');
                        }
                    }
                }
            } catch (err) {
                console.error('Error setting up session:', err);
                const email = new URLSearchParams(window.location.search).get('email') || '';
                navigate(`/signin?error=auth_error&message=Échec de la configuration de la session. Veuillez réessayer.&email=${encodeURIComponent(email)}`);
            } finally {
                setLoading(false);
            }
        };

        setupSession();
    }, [navigate]);

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

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
        } catch (err) {
            console.error('Error setting password:', err);
            setError('Échec de la définition du mot de passe. Veuillez réessayer.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Configuration de votre compte en cours...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                {error && (
                    <Notification
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                )}

                {showPasswordForm ? (
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Définissez votre mot de passe
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Veuillez définir un mot de passe sécurisé pour votre compte
                        </p>
                        <form className="mt-8 space-y-6" onSubmit={handleSetPassword}>
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="password" className="sr-only">Mot de passe</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="sr-only">Confirmer le mot de passe</label>
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirmer le mot de passe"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {loading ? 'Configuration en cours...' : 'Définir le mot de passe'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600">Erreur d'authentification</h2>
                        <p className="mt-2 text-gray-600">
                            Impossible de vous authentifier. Veuillez réessayer de vous inscrire.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 