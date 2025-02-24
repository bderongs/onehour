'use client';

import React, { useState } from 'react';
import { ArrowRight, Beaker } from 'lucide-react';
import type { ClientSignUpData } from '@/services/auth/types';
import { signUpClient, checkEmail } from '@/app/auth/actions';
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
        industry: '',
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
            industry: 'tech',
            sparkUrlSlug
        };
    };

    const handleTestSignup = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        const testData = generateTestData();
        
        try {
            // Check if email is already registered
            const emailCheck = await checkEmail(testData.email);
            if (!emailCheck.success) {
                throw new Error(emailCheck.error);
            }
            
            if (emailCheck.exists) {
                // Show notification before redirect
                showNotification('success', 'Un compte existe déjà avec cet email. Vous allez être redirigé vers la page de connexion.');
                // Redirect to signin page with email parameter
                router.push(`/signin?email=${encodeURIComponent(testData.email)}`);
                return;
            }

            const result = await signUpClient(testData);
            if (!result.success) {
                throw new Error(result.error);
            }
            
            // Clear form data after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                company: '',
                email: '',
                companyRole: '',
                industry: ''
            });

            // Navigate to email confirmation page instead of showing notification
            router.push('/auth/email-confirmation');
            onSuccess?.({ sparkUrlSlug: undefined });
        } catch (error: any) {
            logger.error('Error submitting test form:', error);
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
        if (loading) return;
        setLoading(true);

        try {
            // Add validation before submission
            if (!formData.email || !formData.firstName || !formData.lastName || !formData.company || !formData.companyRole || !formData.industry) {
                throw new Error('Veuillez remplir tous les champs obligatoires.');
            }

            // Check if email is already registered
            const emailCheck = await checkEmail(formData.email);
            if (!emailCheck.success) {
                throw new Error(emailCheck.error);
            }
            
            if (emailCheck.exists) {
                // Show notification before redirect
                showNotification('success', 'Un compte existe déjà avec cet email. Vous allez être redirigé vers la page de connexion.');
                // Redirect to signin page with email parameter
                router.push(`/signin?email=${encodeURIComponent(formData.email)}`);
                return;
            }

            const result = await signUpClient(formData);
            if (!result.success) {
                throw new Error(result.error);
            }

            setFormData({
                firstName: '',
                lastName: '',
                company: '',
                email: '',
                companyRole: '',
                industry: ''
            });

            // Navigate to email confirmation page instead of showing notification
            router.push('/auth/email-confirmation');
            onSuccess?.({ sparkUrlSlug: undefined });
        } catch (error: any) {
            logger.error('Error submitting form:', error);
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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
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