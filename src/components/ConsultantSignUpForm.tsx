import React, { useState } from 'react';
import { ArrowRight, Beaker } from 'lucide-react';
import { signUpConsultantWithEmail, checkEmailExists } from '../services/auth';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

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
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

        const testData = generateTestData();
        
        try {
            // Check if email is already registered
            const emailExists = await checkEmailExists(testData.email);
            if (emailExists) {
                throw new Error('Cette adresse email est déjà utilisée.');
            }

            await signUpConsultantWithEmail(testData);
            
            // Clear form data after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                linkedin: '',
                email: ''
            });

            // Navigate to email confirmation page instead of showing notification
            navigate('/email-confirmation');
            onSuccess?.();
        } catch (error: any) {
            console.error('Error submitting test form:', error);
            let errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
            
            if (error.message?.includes('timeout') || error.message?.includes('network')) {
                errorMessage = 'Problème de connexion. Veuillez vérifier votre connexion internet et réessayer.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            showNotification('error', errorMessage);
            onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Add validation before submission
            if (!formData.email || !formData.firstName || !formData.lastName) {
                throw new Error('Veuillez remplir tous les champs obligatoires.');
            }

            // Check if email is already registered
            const emailExists = await checkEmailExists(formData.email);
            if (emailExists) {
                throw new Error('Cette adresse email est déjà utilisée.');
            }

            await signUpConsultantWithEmail(formData);
            setFormData({ firstName: '', lastName: '', linkedin: '', email: '' });
            
            // Navigate to email confirmation page instead of showing notification
            navigate('/email-confirmation');
            onSuccess?.();
        } catch (error: any) {
            console.error('Error submitting form:', error);
            let errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
            
            if (error.message?.includes('timeout') || error.message?.includes('network')) {
                errorMessage = 'Problème de connexion. Veuillez vérifier votre connexion internet et réessayer.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            showNotification('error', errorMessage);
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
                            <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                            <span>Inscription en cours...</span>
                        </>
                    ) : (
                        <>
                            {buttonText}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {process.env.NODE_ENV === 'development' && (
                    <button
                        onClick={handleTestSignup}
                        disabled={loading}
                        className="w-full bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Beaker className="h-5 w-5" />
                        Test Signup
                    </button>
                )}
            </div>
            <p className="text-center text-sm text-gray-500">
                En créant votre profil, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
        </form>
    );
} 