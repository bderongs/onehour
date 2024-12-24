import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { submitToGoogleForm } from '../services/formSubmission';
import { ChatConfig } from '../types/chat';

interface ContactForm {
    name: string;
    email: string;
    phone?: string;
    preferredContact: 'email' | 'phone';
}

interface ConsultantConnectProps {
    onBack: () => void;
    problemSummary: {
        challenge: string;
        currentSituation: string;
        desiredOutcome: string;
        constraints: string;
        stakeholders: string;
        previousAttempts: string;
        readyForAssessment: boolean;
    };
    config: ChatConfig;
}

export function ConsultantConnect({ onBack, problemSummary, config }: ConsultantConnectProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [form, setForm] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        preferredContact: 'email'
    });

    console.log('ConsultantConnect - Received problemSummary:', problemSummary);
    console.log('ConsultantConnect - Summary values:', {
        challenge: problemSummary.challenge || 'missing',
        currentSituation: problemSummary.currentSituation || 'missing',
        desiredOutcome: problemSummary.desiredOutcome || 'missing',
        constraints: problemSummary.constraints || 'missing',
        stakeholders: problemSummary.stakeholders || 'missing',
        previousAttempts: problemSummary.previousAttempts || 'missing',
        readyForAssessment: problemSummary.readyForAssessment
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await submitToGoogleForm({
                name: form.name,
                email: form.email,
                phone: form.phone || '',
                problemSummary: JSON.stringify(problemSummary)
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting consultation:', error);
        }
    };

    const handleClose = () => {
        setIsSubmitted(false);
        setForm({
            name: '',
            email: '',
            phone: '',
            preferredContact: 'email'
        });
        onBack();
    };

    if (isSubmitted) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center relative">
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>
                <div className="flex justify-center mb-6">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Merci pour Votre Demande !
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    {config.confirmationMessage}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">
                        <span className="font-medium">Vos coordonnées :</span><br />
                        <span className="font-medium">Nom :</span> {form.name}<br />
                        <span className="font-medium">Email :</span> {form.email}
                        {form.phone && (
                            <>
                                <br />
                                <span className="font-medium">Téléphone :</span> {form.phone}
                            </>
                        )}
                        <br />
                        <span className="font-medium">Mode de contact préféré :</span> {form.preferredContact === 'email' ? 'Email' : 'Téléphone'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900">Confirmez Votre Demande de Consultation</h2>
                    </div>
                    <button 
                        onClick={onBack}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Summary Section - Left Column */}
                    <div className="lg:w-80">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de votre besoin</h3>
                            
                            <div className="space-y-4">
                                {problemSummary.challenge && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Défi</h4>
                                        <p className="text-sm text-gray-600 mt-1">{problemSummary.challenge}</p>
                                    </div>
                                )}
                                {problemSummary.currentSituation && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Situation Actuelle</h4>
                                        <p className="text-sm text-gray-600 mt-1">{problemSummary.currentSituation}</p>
                                    </div>
                                )}
                                {problemSummary.desiredOutcome && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Objectifs</h4>
                                        <p className="text-sm text-gray-600 mt-1">{problemSummary.desiredOutcome}</p>
                                    </div>
                                )}
                                {problemSummary.constraints && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Contraintes</h4>
                                        <p className="text-sm text-gray-600 mt-1">{problemSummary.constraints}</p>
                                    </div>
                                )}
                                {problemSummary.stakeholders && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Parties Prenantes</h4>
                                        <p className="text-sm text-gray-600 mt-1">{problemSummary.stakeholders}</p>
                                    </div>
                                )}
                                {problemSummary.previousAttempts && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700">Solutions Tentées</h4>
                                        <p className="text-sm text-gray-600 mt-1">{problemSummary.previousAttempts}</p>
                                    </div>
                                )}
                            </div>

                            {problemSummary.readyForAssessment && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm">Votre brief est complet !</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Section - Right Column */}
                    <div className="flex-1">
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
                                    {config.submitMessage}
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
            </div>
        </>
    );
}