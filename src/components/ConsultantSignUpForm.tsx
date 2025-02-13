import React, { useState } from 'react';
import { ArrowRight, Beaker } from 'lucide-react';
import { signUpConsultantWithEmail } from '../services/auth';
import { Notification } from './Notification';

interface ConsultantSignUpFormProps {
    buttonText?: string;
    className?: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

export function ConsultantSignUpForm({ 
    buttonText = "Créer mes premiers Sparks",
    className = "",
    onSuccess,
    onError
}: ConsultantSignUpFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        linkedin: '',
        email: ''
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const generateTestData = () => {
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
        return {
            firstName: 'Test',
            lastName: 'Consultant',
            linkedin: 'https://linkedin.com/in/test-consultant',
            email: `matthieu+testconsultant${timestamp}@sparkier.io`
        };
    };

    const handleTestSignup = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setNotification(null);

        const testData = generateTestData();
        
        try {
            await signUpConsultantWithEmail(testData);
            
            // Clear form data after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                linkedin: '',
                email: ''
            });

            setNotification({
                type: 'success',
                message: 'Inscription réussie ! Veuillez vérifier votre email pour finaliser votre inscription.'
            });

            onSuccess?.();
        } catch (error: any) {
            console.error('Error submitting test form:', error);
            let errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
            
            if (error.message?.includes('timeout') || error.message?.includes('network')) {
                errorMessage = 'Problème de connexion. Veuillez vérifier votre connexion internet et réessayer.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            setNotification({
                type: 'error',
                message: errorMessage
            });
            onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signUpConsultantWithEmail(formData);
            setFormData({ firstName: '', lastName: '', linkedin: '', email: '' });
            setNotification({
                type: 'success',
                message: 'Inscription réussie ! Veuillez vérifier votre email pour finaliser votre inscription.'
            });
            onSuccess?.();
        } catch (error) {
            console.error('Error submitting form:', error);
            setNotification({
                type: 'error',
                message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
            });
            onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prénom
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Votre prénom"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Votre nom"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email professionnel
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="vous@entreprise.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn (optionnel)
                    </label>
                    <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/votre-profil"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                                <span className="ml-2">Inscription en cours...</span>
                            </>
                        ) : (
                            <>
                                {buttonText}
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>

                    {import.meta.env.DEV && (
                        <button
                            type="button"
                            onClick={handleTestSignup}
                            disabled={loading}
                            className="w-full bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Beaker className="h-5 w-5" />
                            <span>Test Signup</span>
                        </button>
                    )}
                </div>
                <p className="text-center text-sm text-gray-500">
                    En créant votre profil, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
            </form>
        </>
    );
} 