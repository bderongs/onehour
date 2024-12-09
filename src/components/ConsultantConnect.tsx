import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

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
        // Here you would typically send this to your backend
        console.log('Form submitted:', form);
        setIsSubmitted(true);
        // Wait 3 seconds before going back
        setTimeout(onBack, 3000);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Thank You for Your Request!
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        We've received your consultation request and will contact you within the next 24 hours
                        via {form.preferredContact === 'email' ? 'email' : 'phone'}.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <p className="text-gray-600">
                            <span className="font-medium">Contact Details:</span><br />
                            {form.name}<br />
                            {form.preferredContact === 'email' ? form.email : form.phone}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        Redirecting you back to home in a few seconds...
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
                Back
            </button>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirm Your Consultation Request</h1>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-blue-600 mb-2">Problem Summary</h2>
                    {problemSummary.challenge && (
                        <div className="mb-3">
                            <h3 className="font-medium text-gray-700">Challenge</h3>
                            <p className="text-gray-600">{problemSummary.challenge}</p>
                        </div>
                    )}
                    {problemSummary.currentSituation && (
                        <div className="mb-3">
                            <h3 className="font-medium text-gray-700">Current Situation</h3>
                            <p className="text-gray-600">{problemSummary.currentSituation}</p>
                        </div>
                    )}
                    {problemSummary.desiredOutcome && (
                        <div className="mb-3">
                            <h3 className="font-medium text-gray-700">Desired Outcome</h3>
                            <p className="text-gray-600">{problemSummary.desiredOutcome}</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
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
                            Email Address *
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
                            Phone Number (optional)
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
                            Preferred Contact Method *
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
                                <span className="ml-2">Phone</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800">
                            By submitting this form, you'll be contacted by one of our expert consultants within the next 24 hours.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Request Consultation
                    </button>
                </form>
            </div>
        </div>
    );
} 