import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientSignUpForm } from '../components/ClientSignUpForm';
import { ConsultantSignUpForm } from '../components/ConsultantSignUpForm';
import { useClientSignUp } from '../contexts/ClientSignUpContext';

export function SignUpPage() {
    const [userType, setUserType] = useState<'client' | 'consultant'>('client');
    const navigate = useNavigate();
    const { sparkId, clearSignUpData } = useClientSignUp();

    const handleClientSignUpSuccess = (data: { sparkId?: string }) => {
        // If there was a sparkId, the user will be redirected to the request page after email confirmation
        if (data.sparkId) {
            navigate('/auth/confirmation?message=Veuillez vérifier votre email pour accéder à votre demande');
        } else {
            navigate('/auth/confirmation');
        }
        clearSignUpData(); // Clear the stored sparkId
    };

    const handleConsultantSignUpSuccess = () => {
        navigate('/auth/confirmation');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Créer un compte
            </h1>

            {/* User Type Selection */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-lg p-1 bg-gray-100">
                    <button
                        onClick={() => setUserType('client')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            userType === 'client'
                                ? 'bg-white text-gray-900 shadow'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Client
                    </button>
                    <button
                        onClick={() => setUserType('consultant')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            userType === 'consultant'
                                ? 'bg-white text-gray-900 shadow'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Consultant
                    </button>
                </div>
            </div>

            {/* Sign Up Forms */}
            <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
                {userType === 'client' ? (
                    <ClientSignUpForm
                        sparkId={sparkId || undefined}
                        onSuccess={handleClientSignUpSuccess}
                    />
                ) : (
                    <ConsultantSignUpForm
                        onSuccess={handleConsultantSignUpSuccess}
                    />
                )}
            </div>
        </div>
    );
} 