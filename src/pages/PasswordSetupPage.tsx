import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Notification } from '../components/Notification';
import { Lock } from 'lucide-react';
import { PasswordRequirements, isPasswordValid, doPasswordsMatch } from '../components/PasswordRequirements';

export function PasswordSetupPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Check if we have a valid token in the URL
        const token = searchParams.get('token');
        if (!token) {
            navigate('/signin');
        }
    }, [searchParams, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isPasswordValid(password)) {
            setNotification({
                type: 'error',
                message: 'Le mot de passe ne respecte pas les critères de sécurité.'
            });
            return;
        }

        if (!doPasswordsMatch(password, confirmPassword)) {
            setNotification({
                type: 'error',
                message: 'Les mots de passe ne correspondent pas.'
            });
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

            setNotification({
                type: 'success',
                message: 'Votre mot de passe a été configuré avec succès.'
            });

            // Redirect based on role
            setTimeout(() => {
                switch (profile.role) {
                    case 'consultant':
                    case 'admin':
                        navigate('/sparks/manage');
                        break;
                    case 'client':
                        navigate('/client/dashboard');
                        break;
                    default:
                        throw new Error('Rôle non reconnu');
                }
            }, 1000); // Short delay to show success message

        } catch (error: any) {
            setNotification({
                type: 'error',
                message: error.message || 'Une erreur est survenue lors de la configuration du mot de passe.'
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