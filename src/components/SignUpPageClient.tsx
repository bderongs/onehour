'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClientSignUpForm } from '@/components/ClientSignUpForm';
import { ConsultantSignUpForm } from '@/components/ConsultantSignUpForm';
import { useClientSignUp } from '@/contexts/ClientSignUpContext';
import { UserTypeSelector } from '@/components/UserTypeSelector';
import { type UserType } from '@/types/auth';

interface SignUpPageClientProps {
    sparkUrlSlug?: string;
}

export function SignUpPageClient({ sparkUrlSlug }: SignUpPageClientProps) {
    const [selectedType, setSelectedType] = useState<UserType>(null);
    const router = useRouter();
    const { clearSignUpData } = useClientSignUp();

    const handleClientSignUpSuccess = () => {
        router.push('/auth/email-confirmation');
        clearSignUpData();
    };

    const handleConsultantSignUpSuccess = () => {
        router.push('/auth/email-confirmation');
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Créer un compte
                </h2>
                <div className="mt-2">
                    {!selectedType ? (
                        <p className="text-sm text-gray-600">
                            Choisissez votre profil pour commencer
                        </p>
                    ) : null}
                </div>
            </div>

            <UserTypeSelector 
                selectedType={selectedType}
                onTypeSelect={setSelectedType}
            />

            {selectedType === 'client' && (
                <ClientSignUpForm 
                    sparkUrlSlug={sparkUrlSlug}
                    onSuccess={handleClientSignUpSuccess}
                />
            )}

            {selectedType === 'consultant' && (
                <ConsultantSignUpForm 
                    onSuccess={handleConsultantSignUpSuccess}
                    className=""
                />
            )}

            <p className="text-center text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link
                    href="/signin"
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Se connecter
                </Link>
            </p>
        </div>
    );
} 