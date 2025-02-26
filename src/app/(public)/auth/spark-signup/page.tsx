import { Suspense } from 'react';
import { Metadata } from 'next';
import { SignUpFormManager } from './components/SignUpFormManager';
import { SignUpFormSkeleton } from './components/SignUpFormSkeleton';

export const metadata: Metadata = {
    title: 'Inscription | Sparkier',
    description: 'Créez votre compte client pour réserver des prestations avec nos Sparks.',
    openGraph: {
        title: 'Inscription | Sparkier',
        description: 'Créez votre compte client pour réserver des prestations avec nos Sparks.',
    },
};

export default function SparkSignUpPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SignUpFormSkeleton />}>
                <SignUpFormManager />
            </Suspense>
        </div>
    );
} 