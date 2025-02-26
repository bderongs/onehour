import { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import SignInForm from '../components/SignInForm';
import SignInFormSkeleton from '../components/SignInFormSkeleton';

export const metadata: Metadata = {
    title: 'Connexion | Sparkier',
    description: 'Connectez-vous à votre compte Sparkier pour accéder à votre espace personnel.',
    robots: {
        index: false,
        follow: true,
    },
};

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Connexion
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ou{' '}
                        <Link
                            href="/consultants#signup-form"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            créez votre compte consultant
                        </Link>
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    <Suspense fallback={<SignInFormSkeleton />}>
                        <SignInForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
} 