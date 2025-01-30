import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { signUpConsultantWithEmail } from '../services/auth';
import { Notification } from './Notification';

interface ConsultantSignUpFormProps {
    className?: string;
    buttonText?: string;
}

export function ConsultantSignUpForm({ 
    className = "bg-white p-6 sm:p-8 rounded-xl shadow-md",
    buttonText = "Créer mes premiers Sparks gratuitement"
}: ConsultantSignUpFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        linkedin: '',
        email: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signUpConsultantWithEmail(formData);
            setIsSubmitted(true);
            setFormData({ firstName: '', lastName: '', linkedin: '', email: '' });
            setNotification({
                type: 'success',
                message: 'Inscription réussie ! Veuillez vérifier votre email pour finaliser votre inscription.'
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setNotification({
                type: 'error',
                message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (isSubmitted) {
        return (
            <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-2">Merci pour votre inscription !</h3>
                <p>Veuillez vérifier votre boîte mail pour confirmer votre adresse email. Une fois confirmée, vous pourrez accéder à la plateforme et commencer à créer vos Sparks et votre page de conversion.</p>
            </div>
        );
    }

    return (
        <>
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            <form onSubmit={handleSubmit} className={className}>
                <div className="space-y-6">
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
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
                    >
                        {buttonText}
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="mt-4 text-sm text-gray-500 text-center">
                        En créant votre profil, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                    </p>
                </div>
            </form>
        </>
    );
} 