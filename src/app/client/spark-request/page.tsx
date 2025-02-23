'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientRequest, getClientRequestsByClientId } from '@/services/clientRequests';
import { getSparkByUrl } from '@/services/sparks';
import { createBrowserClient } from '@/lib/supabase';
import logger from '@/utils/logger';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useNotification } from '@/contexts/NotificationContext';

export default function SparkRequestHandler() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showNotification } = useNotification();

    useEffect(() => {
        const handleSparkRequest = async () => {
            try {
                const sparkUrl = searchParams.get('spark_url');
                logger.info('Processing spark request', { sparkUrl });

                if (!sparkUrl) {
                    logger.error('Missing spark_url parameter');
                    throw new Error('Paramètre spark_url manquant');
                }

                // Get the spark
                const spark = await getSparkByUrl(sparkUrl);
                if (!spark) {
                    logger.error('Spark not found', { sparkUrl });
                    throw new Error('Spark non trouvé');
                }

                // Get current user
                const { data: { user } } = await createBrowserClient().auth.getUser();
                if (!user) {
                    throw new Error('Utilisateur non trouvé');
                }

                // Check for existing requests
                const requests = await getClientRequestsByClientId(user.id);
                const existingRequest = requests.find(r => 
                    r.sparkId === spark.id && 
                    (r.status === 'pending' || r.status === 'accepted')
                );

                if (existingRequest) {
                    logger.info('Found existing request, redirecting', { requestId: existingRequest.id });
                    router.replace(`/client/requests/${existingRequest.id}`);
                    return;
                }

                // Create new request
                logger.info('Creating new request', { sparkId: spark.id });
                const request = await createClientRequest({
                    sparkId: spark.id,
                    clientId: user.id,
                    status: 'pending',
                    message: ''
                });
                router.replace(`/client/requests/${request.id}`);

            } catch (err: any) {
                logger.error('Error handling spark request:', err);
                const errorMessage = err.message || 'Une erreur est survenue lors de la création de la demande';
                setError(errorMessage);
                showNotification('error', errorMessage);
                router.push('/client/dashboard');
            } finally {
                setLoading(false);
            }
        };

        handleSparkRequest();
    }, [router, searchParams, showNotification]);

    if (loading) {
        return <LoadingSpinner message="Traitement de votre demande..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                    <div className="text-center">
                        <p className="text-gray-600">
                            Une erreur est survenue. Veuillez réessayer.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
} 