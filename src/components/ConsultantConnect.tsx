import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import { submitToGoogleForm } from '../services/formSubmission';
import type { DocumentTemplate, DocumentSummary } from '../types/chat';
import { Notification } from '../components/Notification';
import type { Message } from '../components/AIChatInterface';

interface ContactForm {
    name: string;
    email: string;
    phone?: string;
    preferredContact: 'email' | 'phone';
}

interface ConsultantConnectProps {
    onBack: (shouldReset?: boolean) => void;
    documentSummary: DocumentSummary;
    template: DocumentTemplate;
    confirmationMessage: string;
    submitMessage: string;
    messages: Message[];
}

export function ConsultantConnect({ 
    onBack, 
    documentSummary, 
    template,
    confirmationMessage,
    submitMessage,
    messages
}: ConsultantConnectProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [form, setForm] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        preferredContact: 'email'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Format the document summary as a single string
            const formattedSummary = JSON.stringify({
                challenge: documentSummary.challenge || 'missing',
                currentSituation: documentSummary.currentSituation || 'missing',
                desiredOutcome: documentSummary.desiredOutcome || 'missing',
                constraints: documentSummary.constraints || 'missing',
                stakeholders: documentSummary.stakeholders || 'missing',
                previousAttempts: documentSummary.previousAttempts || 'missing',
                hasEnoughData: documentSummary.hasEnoughData
            });

            // Format chat history
            const chatHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            await submitToGoogleForm({
                name: form.name,
                email: form.email,
                phone: form.phone || '',
                preferredContact: form.preferredContact,
                documentSummary: formattedSummary,
                chatHistory: JSON.stringify(chatHistory)
            });

            setIsSubmitted(true);
            setNotification({
                type: 'success',
                message: confirmationMessage
            });
        } catch (error) {
            console.error('Error submitting consultation:', error);
            setNotification({
                type: 'error',
                message: 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.'
            });
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
        onBack(true);
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSubmitted(false);
        onBack();
    };

    if (isSubmitted) {
        return (
            <div className="relative">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>
                <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Merci pour Votre Demande !
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                        {confirmationMessage}
                    </p>
                    <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-600 space-y-2">
                            <div className="mb-4">
                                <span className="font-medium">Vos coordonnées</span>
                            </div>
                            <div className="grid grid-cols-[120px,1fr] gap-2">
                                <span className="font-medium">Nom :</span>
                                <span>{form.name}</span>
                                
                                <span className="font-medium">Email :</span>
                                <span>{form.email}</span>
                                
                                {form.phone && (
                                    <>
                                        <span className="font-medium">Téléphone :</span>
                                        <span>{form.phone}</span>
                                    </>
                                )}
                                
                                <span className="font-medium">Contact :</span>
                                <span>{form.preferredContact === 'email' ? 'Email' : 'Téléphone'}</span>
                            </div>
                        </p>
                    </div>
                </div>
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
            
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900">Confirmez Votre Demande de Consultation</h2>
                    </div>
                    <button
                        onClick={handleBack}
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Résumé de votre besoin</h3>

                            <div className="space-y-4">
                                {template.fields.map(field => {
                                    const value = documentSummary[field.key];
                                    if (!value) return null;

                                    return (
                                        <div key={field.key} className="text-left">
                                            <h4 className="text-sm font-medium text-gray-700">{field.label}</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {field.type === 'list'
                                                    ? (value as string[]).join(', ')
                                                    : field.type === 'boolean'
                                                        ? (value ? 'Oui' : 'Non')
                                                        : value as string
                                                }
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {documentSummary.hasEnoughData && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-left">
                                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm">Votre contexte est clair !</span>
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
                                    {submitMessage}
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