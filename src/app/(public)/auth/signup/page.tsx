/**
 * Signup page component that allows users to create a new account.
 * Uses the same styling as the signin page for consistency.
 */
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <Suspense fallback={<SignUpPageSkeleton />}>
                    <SignUpPageClient />
                </Suspense>
            </div>
        </div>
    );
} 