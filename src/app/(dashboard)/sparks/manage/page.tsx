import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSparksByConsultant } from '@/services/sparks';
import { SparksManagementClient } from './components/SparksManagementClient';
import { SparksManagementSkeleton } from './components/SparksManagementSkeleton';
import { getCurrentUser } from '@/services/auth/server';
import logger from '@/utils/logger';

export const metadata = {
    title: 'Gérer mes Sparks | Sparkier',
    description: 'Gérez vos Sparks, créez de nouveaux appels optimisés et développez votre activité de conseil.',
    openGraph: {
        title: 'Gérer mes Sparks | Sparkier',
        description: 'Gérez vos Sparks, créez de nouveaux appels optimisés et développez votre activité de conseil.',
    },
};

export default async function SparkManagementPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    // Only allow consultants and admins to access this page
    if (!user.roles?.includes('consultant') && !user.roles?.includes('admin')) {
        redirect('/');
    }

    try {
        // Fetch sparks on the server
        const sparks = await getSparksByConsultant(user.id);

        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Mes Sparks</h1>
                    </div>

                    <Suspense fallback={<SparksManagementSkeleton />}>
                        <SparksManagementClient initialSparks={sparks} />
                    </Suspense>
                </div>
            </div>
        );
    } catch (error) {
        logger.error('Error in SparkManagementPage:', error);
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Impossible de charger les Sparks. Veuillez réessayer plus tard.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }
}