import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../components/Notification';
import { ArrowRight } from 'lucide-react';
import { signUpClientWithEmail, type ClientSignUpData } from '../services/auth';

export function SignUpPage() {
    const [formData, setFormData] = useState<ClientSignUpData>({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        role: '',
        industry: ''
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signUpClientWithEmail(formData);
            setFormData({
                firstName: '',
                lastName: '',
                company: '',
                email: '',
                role: '',
                industry: ''
            });
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

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md space-y-6">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Créez votre compte
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Vous avez déjà un compte ?{' '}
                        <button
                            onClick={() => navigate('/signin')}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Connectez-vous
                        </button>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prénom
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleFormChange}
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
                                onChange={handleFormChange}
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
                            onChange={handleFormChange}
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
                            onChange={handleFormChange}
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
                            name="role"
                            value={formData.role}
                            onChange={handleFormChange}
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
                            onChange={handleFormChange}
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
                        className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
                    >
                        Créer mon compte
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="text-sm text-gray-500 text-center">
                        En créant votre compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                    </p>
                </form>
            </div>
        </div>
    );
} 