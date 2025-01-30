import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConsultantSignUpForm } from '../components/ConsultantSignUpForm';
import { ClientSignUpForm } from '../components/ClientSignUpForm';

type UserType = 'client' | 'consultant' | null;

export function SignUpPage() {
    const [selectedType, setSelectedType] = useState<UserType>(null);
    const navigate = useNavigate();

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

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                        <ClientSignUpForm 
                            onSuccess={() => navigate('/signin')}
                        />
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