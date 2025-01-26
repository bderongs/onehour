import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification } from '../components/Notification';
import { PasswordSetupForm } from '../components/PasswordSetupForm';

// Password validation helper functions
const hasLowerCase = (str: string) => /[a-z]/.test(str);
const hasUpperCase = (str: string) => /[A-Z]/.test(str);
const hasNumber = (str: string) => /[0-9]/.test(str);
const isLongEnough = (str: string) => str.length >= 8;

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const navigate = useNavigate();

    // Password validation states
    const [validations, setValidations] = useState({
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        isLongEnough: false,
        passwordsMatch: false
    });

    // Update validations on password change
    useEffect(() => {
        setValidations({
            hasLower: hasLowerCase(password),
            hasUpper: hasUpperCase(password),
            hasNumber: hasNumber(password),
            isLongEnough: isLongEnough(password),
            passwordsMatch: password === confirmPassword && password !== ''
        });
    }, [password, confirmPassword]);

    // Check if all validations pass
    const isPasswordValid = Object.values(validations).every(v => v);

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
                    type: type as any,
                });

                if (verifyError) throw verifyError;

                // For both signup and recovery, we want to show the password form
                if (type === 'signup' || type === 'recovery') {
                    setShowPasswordForm(true);
                    setLoading(false);
                    return;
                }

                // For other types, redirect to home if verification successful
                if (data?.session) {
                    navigate('/');
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
        
        if (!isPasswordValid) {
            setError('Veuillez respecter toutes les exigences du mot de passe');
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
                    <PasswordSetupForm
                        password={password}
                        confirmPassword={confirmPassword}
                        validations={validations}
                        loading={loading}
                        isPasswordValid={isPasswordValid}
                        onPasswordChange={setPassword}
                        onConfirmPasswordChange={setConfirmPassword}
                        onSubmit={handleSetPassword}
                    />
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