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
        const handleEmailConfirmation = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const tokenHash = urlParams.get('token_hash');
                const type = urlParams.get('type');
                
                if (!tokenHash || !type) {
                    throw new Error('Invalid URL parameters');
                }

                // Verify the OTP
                const { data, error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: tokenHash,
                    type: type as any, // 'signup' | 'invite' | etc
                });

                if (verifyError) throw verifyError;
                
                if (data?.session) {
                    setShowPasswordForm(true);
                    setLoading(false);
                    return;
                }

                throw new Error('No session established');

            } catch (err: any) {
                console.error('Error during email confirmation:', err);
                const email = new URLSearchParams(window.location.search).get('email') || '';
                const errorMessage = err.message || 'An error occurred during confirmation';
                navigate(`/signin?error=auth_error&message=${encodeURIComponent(errorMessage)}&email=${encodeURIComponent(email)}`);
            } finally {
                setLoading(false);
            }
        };

        handleEmailConfirmation();
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