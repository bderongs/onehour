import React, { useState } from 'react';
import { ArrowRight, Beaker } from 'lucide-react';
import { signUpClientWithEmail, type ClientSignUpData, checkEmailExists } from '../services/auth';
import { Notification } from './Notification';

interface ClientSignUpFormProps {
    buttonText?: string;
    className?: string;
    sparkUrlSlug?: string;
    initialEmail?: string;
    onSuccess?: (data: { sparkUrlSlug?: string }) => void;
    onError?: (error: any) => void;
}

export function ClientSignUpForm({ 
    buttonText = "Créer mon compte",
    className = "",
    sparkUrlSlug,
    initialEmail = '',
    onSuccess,
    onError
}: ClientSignUpFormProps) {
    const [formData, setFormData] = useState<ClientSignUpData>({
        firstName: '',
        lastName: '',
        company: '',
        email: initialEmail,
        companyRole: '',
        industry: '',
        sparkUrlSlug
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const generateTestData = () => {
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
        return {
            firstName: 'Test',
            lastName: 'User',
            company: '[TEST] Test Company',
            email: `matthieu+test${timestamp}@sparkier.io`,
            companyRole: 'Test Role',
            industry: 'tech',
            sparkUrlSlug
        };
    };

    const handleTestSignup = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setNotification(null);

        const testData = generateTestData();
        
        try {
            // Check if email is already registered
            const emailExists = await checkEmailExists(testData.email);
            if (emailExists) {
                throw new Error('Cette adresse email est déjà utilisée.');
            }

            const result = await signUpClientWithEmail(testData);
            
            // Update form data after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                company: '',
                email: '',
                companyRole: '',
                industry: '',
                sparkUrlSlug: undefined
            });

            setNotification({
                type: 'success',
                message: 'Inscription réussie ! Veuillez vérifier votre email pour finaliser votre inscription.'
            });

            onSuccess?.({ sparkUrlSlug: result?.sparkUrlSlug });
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
        if (loading) return; // Prevent multiple submissions while loading
        setLoading(true);
        setNotification(null); // Clear any previous notifications

        // Add a timeout to reset loading state if it takes too long
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setNotification({
                type: 'error',
                message: 'La requête a pris trop de temps. Veuillez réessayer.'
            });
        }, 30000); // 30 seconds timeout

        try {
            // Add validation before submission
            if (!formData.email || !formData.firstName || !formData.lastName || !formData.company || !formData.companyRole || !formData.industry) {
                throw new Error('Veuillez remplir tous les champs obligatoires.');
            }

            // Check if email is already registered
            const emailExists = await checkEmailExists(formData.email);
            if (emailExists) {
                throw new Error('Cette adresse email est déjà utilisée.');
            }

            const result = await signUpClientWithEmail(formData);
            
            // Clear form data only after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                company: '',
                email: '',
                companyRole: '',
                industry: '',
                sparkUrlSlug: undefined
            });

            setNotification({
                type: 'success',
                message: 'Inscription réussie ! Veuillez vérifier votre email pour finaliser votre inscription.'
            });

            // Extract only the sparkUrlSlug for the onSuccess callback
            onSuccess?.({ sparkUrlSlug: result?.sparkUrlSlug });
        } catch (error: any) {
            console.error('Error submitting form:', error);
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
            clearTimeout(timeoutId);
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                        Entreprise
                    </label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom de votre entreprise"
                    />
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
                        Fonction
                    </label>
                    <input
                        type="text"
                        name="companyRole"
                        value={formData.companyRole}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Votre fonction dans l'entreprise"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secteur d'activité
                    </label>
                    <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Sélectionnez votre secteur</option>
                        <option value="tech">Technologies</option>
                        <option value="finance">Finance</option>
                        <option value="retail">Commerce & Distribution</option>
                        <option value="manufacturing">Industrie</option>
                        <option value="services">Services</option>
                        <option value="healthcare">Santé</option>
                        <option value="other">Autre</option>
                    </select>
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
                    En créant votre compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
            </form>
        </>
    );
} 