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
                        Développez votre activité de conseil
                    </h1>
                    <p className="text-xl text-gray-600">
                        Rejoignez notre plateforme et connectez-vous avec des clients qualifiés.
                    </p>
                </div>

                <div id="benefits" className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Visibilité accrue</h3>
                        <p className="text-gray-600">
                            Créez votre profil professionnel et présentez votre expertise à une clientèle ciblée.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Gestion simplifiée</h3>
                        <p className="text-gray-600">
                            Synchronisez votre calendrier et laissez vos clients réserver directement leurs créneaux.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Revenus additionnels</h3>
                        <p className="text-gray-600">
                            Proposez des consultations ponctuelles et développez une nouvelle source de revenus.
                        </p>
                    </div>
                </div>

                <div id="how-it-works" className="bg-white rounded-xl p-8 mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        Comment ça marche ?
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                            <h4 className="font-semibold mb-2 text-gray-900">Inscription</h4>
                            <p className="text-gray-600">Créez votre compte gratuitement.</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
                            <h4 className="font-semibold mb-2 text-gray-900">Compétences</h4>
                            <p className="text-gray-600">Validez vos expertises.</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
                            <h4 className="font-semibold mb-2 text-gray-900">Calendrier</h4>
                            <p className="text-gray-600">Configurez vos disponibilités.</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">4</div>
                            <h4 className="font-semibold mb-2 text-gray-900">Consultations</h4>
                            <p className="text-gray-600">Commencez à conseiller vos clients.</p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Prêt à nous rejoindre ?
                    </h2>
                    {isSubmitted ? (
                        <div className="text-green-600 text-xl mb-6">
                            Merci, nous reviendrons très vite vers vous.
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
                                        placeholder="Lien LinkedIn (optionnel)"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                                >
                                    Devenir consultant
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultantPage;