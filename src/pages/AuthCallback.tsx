import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification } from '../components/Notification';

export default function AuthCallback() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
                    type: type as any,
                });

                if (verifyError) throw verifyError;

                // For signup and recovery, redirect to password setup
                if (type === 'signup' || type === 'recovery') {
                    navigate(`/setup-password?token=${tokenHash}`);
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
                setError(errorMessage);
                navigate(`/signin?error=auth_error&message=${encodeURIComponent(errorMessage)}&email=${encodeURIComponent(email)}`);
            } finally {
                setLoading(false);
            }
        };

        handleEmailConfirmation();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Vérification de votre email...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                    <Notification
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                    <div className="text-center mt-4">
                        <p className="text-gray-600">
                            Veuillez réessayer de vous connecter.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
} 