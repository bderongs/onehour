import React, { useState } from 'react';
import { submitConsultantForm } from '../services/consultantFormSubmission';

const ConsultantPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        linkedin: '',
        email: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitConsultantForm(formData);
            setIsSubmitted(true);
            setFormData({ firstName: '', lastName: '', linkedin: '', email: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="mt-20 text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                        Créez votre profil de consultant
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Rejoignez notre communauté de consultants experts et développez votre activité grâce à une page de profil professionnelle qui convertit.
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                        <button onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                            Créer mon profil
                        </button>
                        <button onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-indigo-600">
                            En savoir plus
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-8 mb-16">
                    <div className="text-center mb-8">
                        <p className="text-sm font-semibold text-indigo-600">ILS NOUS FONT CONFIANCE</p>
                        <div className="mt-4 flex justify-center space-x-8">
                            <div className="text-gray-400">Logo Client 1</div>
                            <div className="text-gray-400">Logo Client 2</div>
                            <div className="text-gray-400">Logo Client 3</div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                                <div>
                                    <h4 className="font-semibold">Marie D.</h4>
                                    <p className="text-sm text-gray-600">Consultante Marketing Digital</p>
                                </div>
                            </div>
                            <p className="text-gray-600">"Grâce à mon profil, j'ai pu augmenter ma visibilité et obtenir des clients qualifiés régulièrement."</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                                <div>
                                    <h4 className="font-semibold">Thomas R.</h4>
                                    <p className="text-sm text-gray-600">Expert Finance</p>
                                </div>
                            </div>
                            <p className="text-gray-600">"La plateforme m'a permis de développer mon activité de conseil et de gérer efficacement mes rendez-vous."</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                                <div>
                                    <h4 className="font-semibold">Sophie M.</h4>
                                    <p className="text-sm text-gray-600">Consultante RH</p>
                                </div>
                            </div>
                            <p className="text-gray-600">"J'ai doublé mon nombre de clients en 3 mois grâce à mon profil professionnel sur la plateforme."</p>
                        </div>
                    </div>
                </div>

                <div id="benefits" className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Page de profil optimisée</h3>
                        <p className="text-gray-600">
                            Créez une vitrine professionnelle qui met en valeur votre expertise et convertit les visiteurs en clients.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Système de réservation</h3>
                        <p className="text-gray-600">
                            Intégrez votre calendrier et permettez aux clients de réserver directement vos créneaux de consultation.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Paiements sécurisés</h3>
                        <p className="text-gray-600">
                            Recevez vos paiements automatiquement après chaque consultation via notre système sécurisé.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Avis clients</h3>
                        <p className="text-gray-600">
                            Collectez et affichez automatiquement les avis de vos clients pour renforcer votre crédibilité.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Analytics avancés</h3>
                        <p className="text-gray-600">
                            Suivez vos performances et optimisez votre profil grâce à des statistiques détaillées.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Référencement optimisé</h3>
                        <p className="text-gray-600">
                            Bénéficiez d'une visibilité accrue grâce à un profil optimisé pour les moteurs de recherche.
                        </p>
                    </div>
                </div>

                <div id="how-it-works" className="bg-white rounded-xl p-8 mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        Créez votre profil en 4 étapes
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                            <h4 className="font-semibold mb-2 text-gray-900">Inscription</h4>
                            <p className="text-gray-600">Créez votre compte en quelques clics</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
                            <h4 className="font-semibold mb-2 text-gray-900">Profil</h4>
                            <p className="text-gray-600">Personnalisez votre page de profil</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                            <h4 className="font-semibold mb-2 text-gray-900">Validation</h4>
                            <p className="text-gray-600">Faites vérifier vos compétences</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">4</div>
                            <h4 className="font-semibold mb-2 text-gray-900">Publication</h4>
                            <p className="text-gray-600">Publiez et commencez à convertir</p>
                        </div>
                    </div>
                </div>

                <div id="signup-form" className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Créez votre profil maintenant
                    </h2>
                    {isSubmitted ? (
                        <div className="bg-green-50 text-green-800 p-4 rounded-lg max-w-md mx-auto mb-6">
                            <p className="text-xl mb-2">Merci pour votre inscription !</p>
                            <p>Nous allons vous contacter rapidement pour finaliser la création de votre profil.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Prénom"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Nom"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="URL LinkedIn (optionnel)"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email professionnel"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                                >
                                    Créer mon profil
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                En créant votre profil, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultantPage;