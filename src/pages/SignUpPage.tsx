import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Notification } from '../components/Notification';
import { signUpClientWithEmail, signUpConsultantWithEmail } from '../services/auth';

type UserType = 'client' | 'consultant' | null;

interface ClientFormData {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    role: string;
    industry: string;
}

interface ConsultantFormData {
    firstName: string;
    lastName: string;
    linkedin: string;
    email: string;
    expertise: string;
    experience: string;
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
        role: '',
        industry: ''
    });

    const [consultantFormData, setConsultantFormData] = useState<ConsultantFormData>({
        firstName: '',
        lastName: '',
        linkedin: '',
        email: '',
        expertise: '',
        experience: ''
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

    const handleConsultantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signUpConsultantWithEmail(consultantFormData);
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

    const handleConsultantFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setConsultantFormData({
            ...consultantFormData,
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
                    name="role"
                    value={clientFormData.role}
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

    const renderConsultantForm = () => (
        <form onSubmit={handleConsultantSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={consultantFormData.firstName}
                        onChange={handleConsultantFormChange}
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
                        value={consultantFormData.lastName}
                        onChange={handleConsultantFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Votre nom"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domaine d'expertise
                </label>
                <select
                    name="expertise"
                    value={consultantFormData.expertise}
                    onChange={handleConsultantFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Sélectionnez votre domaine</option>
                    <option value="digital">Transformation Digitale</option>
                    <option value="strategy">Stratégie & Management</option>
                    <option value="marketing">Marketing & Communication</option>
                    <option value="hr">Ressources Humaines</option>
                    <option value="finance">Finance & Gestion</option>
                    <option value="tech">Technologies & IT</option>
                    <option value="other">Autre</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Années d'expérience
                </label>
                <select
                    name="experience"
                    value={consultantFormData.experience}
                    onChange={handleConsultantFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Sélectionnez votre expérience</option>
                    <option value="1-3">1-3 ans</option>
                    <option value="4-7">4-7 ans</option>
                    <option value="8-12">8-12 ans</option>
                    <option value="13+">13+ ans</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn (optionnel)
                </label>
                <input
                    type="url"
                    name="linkedin"
                    value={consultantFormData.linkedin}
                    onChange={handleConsultantFormChange}
                    placeholder="https://linkedin.com/in/votre-profil"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email professionnel
                </label>
                <input
                    type="email"
                    name="email"
                    value={consultantFormData.email}
                    onChange={handleConsultantFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="vous@entreprise.com"
                />
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
                        renderConsultantForm()
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