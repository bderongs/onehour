import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Notification } from '../components/Notification';
import { signUpClientWithEmail } from '../services/auth';
import { ConsultantSignUpForm } from '../components/ConsultantSignUpForm';

type UserType = 'client' | 'consultant' | null;

interface ClientFormData {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    companyRole: string;
    industry: string;
}

export function SignUpPage() {
    const [selectedType, setSelectedType] = useState<UserType>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [clientFormData, setClientFormData] = useState<ClientFormData>({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        companyRole: '',
        industry: ''
    });

    const handleClientSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signUpClientWithEmail(clientFormData);
            setNotification({
                type: 'success',
                message: 'Inscription réussie ! Veuillez vérifier votre email pour finaliser votre inscription.'
            });
            navigate('/signin');
        } catch (error) {
            console.error('Error submitting form:', error);
            setNotification({
                type: 'error',
                message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClientFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setClientFormData({
            ...clientFormData,
            [e.target.name]: e.target.value
        });
    };

    const renderTypeSelection = () => (
        <div className="space-y-4">
            <button
                onClick={() => setSelectedType('client')}
                className="w-full flex items-center justify-between p-4 text-left border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
                <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">Je suis un client</p>
                    <p className="text-sm text-gray-500">Je cherche un expert pour m'accompagner</p>
                </div>
                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button
                onClick={() => setSelectedType('consultant')}
                className="w-full flex items-center justify-between p-4 text-left border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
                <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">Je suis un consultant</p>
                    <p className="text-sm text-gray-500">Je souhaite proposer mes services</p>
                </div>
                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
        </div>
    );

    const renderClientForm = () => (
        <form onSubmit={handleClientSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={clientFormData.firstName}
                        onChange={handleClientFormChange}
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
                        value={clientFormData.lastName}
                        onChange={handleClientFormChange}
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
                    value={clientFormData.company}
                    onChange={handleClientFormChange}
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
                    value={clientFormData.email}
                    onChange={handleClientFormChange}
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
                    value={clientFormData.companyRole}
                    onChange={handleClientFormChange}
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
                    value={clientFormData.industry}
                    onChange={handleClientFormChange}
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
                className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Inscription en cours...' : 'Créer mon compte'}
            </button>
        </form>
    );

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
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Créer un compte
                        </h2>
                        {!selectedType ? (
                            <p className="mt-2 text-sm text-gray-600">
                                Choisissez votre profil pour commencer
                            </p>
                        ) : (
                            <button
                                onClick={() => setSelectedType(null)}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                            >
                                ← Changer de profil
                            </button>
                        )}
                    </div>

                    {!selectedType ? (
                        renderTypeSelection()
                    ) : selectedType === 'client' ? (
                        renderClientForm()
                    ) : (
                        <ConsultantSignUpForm 
                            buttonText="Créer mon compte"
                            className="space-y-6"
                        />
                    )}

                    <p className="text-center text-sm text-gray-600">
                        Vous avez déjà un compte ?{' '}
                        <Link
                            to="/signin"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
} 