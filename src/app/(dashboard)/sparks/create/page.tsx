import { Suspense } from 'react';
import { Metadata } from 'next';
import CreateSparkForm from './components/CreateSparkForm';
import CreateSparkFormSkeleton from './components/CreateSparkFormSkeleton';

export const metadata: Metadata = {
    title: 'Créer un nouveau Spark | Sparkier',
    description: 'Créez un nouveau Spark pour partager vos connaissances et votre expertise.',
};

export default function SparkCreatePage() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Créer un nouveau Spark</h1>
                <Suspense fallback={<CreateSparkFormSkeleton />}>
                    <CreateSparkForm />
                </Suspense>
            </div>
        </div>
    );
} 