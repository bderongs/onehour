'use client';

import React, { useState } from 'react';
import { ArrowRight, Beaker } from 'lucide-react';
import type { ClientSignUpData } from '@/services/auth/types';
import { signUpClient, checkEmail, testSupabaseConnection } from '@/app/(public)/auth/actions';
import { useNotification } from '@/contexts/NotificationContext';
import { useRouter } from 'next/navigation';
import logger from '@/utils/logger';

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
        sparkUrlSlug
    });
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const generateTestData = () => {
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
        return {
            firstName: 'Test',
            lastName: 'User',
            company: '[TEST] Test Company',
            email: `matthieu+test${timestamp}@sparkier.io`,
            companyRole: 'Test Role',
            sparkUrlSlug
        };
    };

    const handleTestSignup = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            // First test the Supabase connection
            logger.info('Testing Supabase connection before signup');
            const connectionTest = await testSupabaseConnection();
            if (!connectionTest.success) {
                logger.error('Supabase connection test failed');
                throw new Error('Unable to connect to the database. Please try again later.');
            }
            
            const testData = generateTestData();
            
            // Validate form data before submission
            if (!testData.email || !testData.firstName || !testData.lastName || 
                !testData.company || !testData.companyRole) {
                showNotification('error', 'Veuillez remplir tous les champs obligatoires.');
                setLoading(false);
                return;
            }
            
            // Check if email is already registered
            logger.info('Checking if email exists:', testData.email);
            const emailCheck = await checkEmail(testData.email);
            if (!emailCheck.success) {
                logger.error('Error checking email:', emailCheck.error);
                throw new Error(emailCheck.error || 'Erreur lors de la vérification de l\'email');
            }
            
            if (emailCheck.exists) {
                // Show notification before redirect
                showNotification('success', 'Un compte existe déjà avec cet email. Vous allez être redirigé vers la page de connexion.');
                // Redirect to signin page with email parameter
                router.push(`/auth/signin?email=${encodeURIComponent(testData.email)}`);
                return;
            }

            logger.info('Submitting client signup form');
            const result = await signUpClient(testData);
            if (!result.success) {
                logger.error('Error submitting client signup form:', result.error);
                throw new Error(result.error || 'Échec de l\'inscription');
            }
            
            logger.info('Client signup successful');
            // Clear form data after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                company: '',
                email: '',
                companyRole: ''
            });
            
            // Show success message
            showNotification('success', 'Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.');
            
            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess({ sparkUrlSlug });
            }
            
        } catch (error) {
            logger.error('Error submitting test form:', error);
            
            // Handle specific error messages
            let errorMessage = 'Une erreur est survenue lors de l\'inscription';
            
            if (error instanceof Error) {
                // Check for password-related errors
                if (error.message.includes('Password')) {
                    errorMessage = 'Erreur interne: Problème avec la génération du mot de passe temporaire. Veuillez réessayer.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            showNotification('error', errorMessage);
            
            // Call onError callback if provided
            if (onError) {
                onError(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            // First test the Supabase connection
            logger.info('Testing Supabase connection before signup');
            const connectionTest = await testSupabaseConnection();
            if (!connectionTest.success) {
                logger.error('Supabase connection test failed');
                throw new Error('Unable to connect to the database. Please try again later.');
            }
            
            // Add validation before submission
            if (!formData.email || !formData.firstName || !formData.lastName || !formData.company || !formData.companyRole) {
                throw new Error('Veuillez remplir tous les champs obligatoires.');
            }

            // Check if email is already registered
            logger.info('Checking if email exists:', formData.email);
            const emailCheck = await checkEmail(formData.email);
            if (!emailCheck.success) {
                logger.error('Error checking email:', emailCheck.error);
                throw new Error(emailCheck.error || 'Erreur lors de la vérification de l\'email');
            }
            
            if (emailCheck.exists) {
                // Show notification before redirect
                showNotification('success', 'Un compte existe déjà avec cet email. Vous allez être redirigé vers la page de connexion.');
                // Redirect to signin page with email parameter
                router.push(`/auth/signin?email=${encodeURIComponent(formData.email)}`);
                return;
            }

            logger.info('Submitting client signup form');
            const result = await signUpClient(formData);
            if (!result.success) {
                logger.error('Error submitting client signup form:', result.error);
                throw new Error(result.error || 'Échec de l\'inscription');
            }

            logger.info('Client signup successful');
            setFormData({
                firstName: '',
                lastName: '',
                company: '',
                email: '',
                companyRole: ''
            });

            // Navigate to email confirmation page
            router.push('/auth/email-confirmation');
            if (onSuccess) {
                onSuccess({ sparkUrlSlug: undefined });
            }
        } catch (error) {
            logger.error('Error submitting form:', error);
            
            // Handle specific error messages
            let errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
            
            if (error instanceof Error) {
                // Check for specific error types
                if (error.message.includes('Password')) {
                    errorMessage = 'Erreur interne: Problème avec la génération du mot de passe temporaire. Veuillez réessayer.';
                } else if (error.message.includes('timeout') || error.message.includes('network')) {
                    errorMessage = 'Problème de connexion. Veuillez vérifier votre connexion internet et réessayer.';
                } else {
                    errorMessage = error.message;
                }
            }

            showNotification('error', errorMessage);
            if (onError) {
                onError(error);
            }
        } finally {
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
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
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
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
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
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
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
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
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
        </form>
    );
} 