import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { getChatHistory } from '../services/chatStorage';
import { submitToGoogleForm } from '../services/formSubmission';

interface ContactForm {
    name: string;
    email: string;
    phone?: string;
    preferredContact: 'email' | 'phone';
}

interface ProblemDetails {
    challenge?: string;
    currentSituation?: string;
    desiredOutcome?: string;
    constraints?: string[];
    additionalInfo?: string[];
}

interface ConsultantConnectProps {
    onBack: () => void;
}

export function ConsultantConnect({ onBack }: ConsultantConnectProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [form, setForm] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        preferredContact: 'email'
    });

    const problemSummary: ProblemDetails = JSON.parse(localStorage.getItem('problemSummary') || '{}');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Get chat history from localStorage or state management
        const chatHistory = getChatHistory();

        try {
            await submitToGoogleForm({
                name: form.name,
                email: form.email,
                phone: form.phone || '',
                problemSummary: JSON.stringify(problemSummary),
                chatHistory: JSON.stringify(chatHistory)
            });

            // Show success message and redirect
            setIsSubmitted(true);
            setTimeout(onBack, 3000);

        } catch (error) {
            console.error('Error submitting consultation:', error);
            // You might want to show an error message to the user here
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Merci pour Votre Demande !
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Nous avons reçu votre demande de consultation et vous contacterons dans les prochaines 24 heures
                        par {form.preferredContact === 'email' ? 'email' : 'téléphone'}.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <p className="text-gray-600">
                            <span className="font-medium">Coordonnées :</span><br />
                            {form.name}<br />
                            {form.preferredContact === 'email' ? form.email : form.phone}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Redirection vers l'accueil dans quelques secondes...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button
                onClick={onBack}
                className="flex items-center text-blue-600 mb-6 hover:text-blue-700"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
            </button>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirmez Votre Demande de Consultation</h1>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-blue-600 mb-2">Résumé du Problème</h2>
                    {problemSummary.challenge && (
                        <div className="mb-3">
                            <h3 className="font-medium text-gray-700">Défi</h3>
                            <p className="text-gray-600">{problemSummary.challenge}</p>
                        </div>
                    )}
                    {problemSummary.currentSituation && (
                        <div className="mb-3">
                            <h3 className="font-medium text-gray-700">Situation Actuelle</h3>
                            <p className="text-gray-600">{problemSummary.currentSituation}</p>
                        </div>
                    )}
                    {problemSummary.desiredOutcome && (
                        <div className="mb-3">
                            <h3 className="font-medium text-gray-700">Résultat Souhaité</h3>
                            <p className="text-gray-600">{problemSummary.desiredOutcome}</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom Complet *
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse Email *
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Numéro de Téléphone (optionnel)
                        </label>
                        <input
                            type="tel"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mode de Contact Préféré *
                        </label>
                        <div className="space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="contactMethod"
                                    value="email"
                                    checked={form.preferredContact === 'email'}
                                    onChange={() => setForm({ ...form, preferredContact: 'email' })}
                                />
                                <span className="ml-2">Email</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="contactMethod"
                                    value="phone"
                                    checked={form.preferredContact === 'phone'}
                                    onChange={() => setForm({ ...form, preferredContact: 'phone' })}
                                />
                                <span className="ml-2">Téléphone</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800">
                            En soumettant ce formulaire, vous serez contacté par l'un de nos consultants experts dans les prochaines 24 heures.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Demander une Consultation
                    </button>
                </form>
            </div>
        </div>
    );
} 