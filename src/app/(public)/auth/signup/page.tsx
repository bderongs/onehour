import { Suspense } from 'react';
import { type Metadata } from 'next';
import { SignUpPageClient } from '../components/SignUpPageClient';
import { SignUpPageSkeleton } from '../components/SignUpPageSkeleton';

export const metadata: Metadata = {
    title: 'Créer un compte | Sparkier',
    description: 'Rejoignez Sparkier en tant que client ou consultant. Créez votre compte pour accéder à notre plateforme de mise en relation.',
    openGraph: {
        title: 'Créer un compte | Sparkier',
        description: 'Rejoignez Sparkier en tant que client ou consultant. Créez votre compte pour accéder à notre plateforme de mise en relation.',
    },
};

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <Suspense fallback={<SignUpPageSkeleton />}>
                    <SignUpPageClient />
                </Suspense>
            </div>
        </div>
    );
} 