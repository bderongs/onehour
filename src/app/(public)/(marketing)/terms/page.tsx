import { Metadata } from 'next';
import { Suspense } from 'react';
import BackButton from './components/BackButton';
import TermsContent from './components/TermsContent';

export const metadata: Metadata = {
    title: 'Termes et conditions | Sparkier',
    description: 'Les termes et conditions d\'utilisation de Sparkier. Découvrez nos règles et règlements pour l\'utilisation de notre site web.',
    openGraph: {
        title: 'Termes et conditions | Sparkier',
        description: 'Les termes et conditions d\'utilisation de Sparkier. Découvrez nos règles et règlements pour l\'utilisation de notre site web.',
    }
};

export default function Terms() {
    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Suspense fallback={<div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />}>
                        <BackButton />
                    </Suspense>
                    <h1 className="text-4xl font-extrabold text-gray-900">Termes et conditions</h1>
                </div>
                <Suspense fallback={
                    <div className="space-y-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-5/6" />
                            </div>
                        ))}
                    </div>
                }>
                    <TermsContent />
                </Suspense>
            </div>
        </div>
    );
} 