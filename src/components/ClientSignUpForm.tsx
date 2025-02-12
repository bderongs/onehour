import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { signUpClientWithEmail, type ClientSignUpData } from '../services/auth';
import { Notification } from './Notification';

interface ClientSignUpFormProps {
    buttonText?: string;
    className?: string;
    sparkUrlSlug?: string;
    onSuccess?: (data: { sparkUrlSlug?: string }) => void;
    onError?: (error: any) => void;
}

export function ClientSignUpForm({ 
    buttonText = "Créer mon compte",
    className = "",
    sparkUrlSlug,
    onSuccess,
    onError
}: ClientSignUpFormProps) {
    const [formData, setFormData] = useState<ClientSignUpData>({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        companyRole: '',
        industry: '',
        sparkUrlSlug
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signUpClientWithEmail(formData);
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
            onSuccess?.(result);
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Inscription en cours...' : buttonText}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-center text-sm text-gray-500">
                    En créant votre compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
            </form>
        </>
    );
} 