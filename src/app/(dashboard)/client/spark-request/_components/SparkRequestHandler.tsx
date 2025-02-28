'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientRequest, getClientRequestsByClientId } from '@/services/clientRequests';
import { getSparkBySlug } from '@/services/sparks';
import { createBrowserClient } from '@/lib/supabase/client';
import logger from '@/utils/logger';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useNotification } from '@/contexts/NotificationContext';

interface SparkRequestHandlerProps {
    sparkSlug: string | null;
}

export function SparkRequestHandler({ sparkSlug }: SparkRequestHandlerProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { showNotification } = useNotification();

    useEffect(() => {
        const handleSparkRequest = async () => {
            try {
                logger.info('Processing spark request', { sparkSlug });

                if (!sparkSlug) {
                    logger.error('Missing spark_url parameter');
                    throw new Error('Paramètre spark_url manquant');
                }

                // Get the spark
                const spark = await getSparkBySlug(sparkSlug);
                if (!spark) {
                    logger.error('Spark not found', { sparkSlug });
                    throw new Error('Spark non trouvé');
                }

                // Get current user
                const { data: { session } } = await createBrowserClient().auth.getSession();
                if (!session?.user) {
                    throw new Error('Utilisateur non trouvé');
                }

                // Check for existing requests
                const existingRequests = await getClientRequestsByClientId(session.user.id);
                const existingRequest = existingRequests.find(r => 
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
                    clientId: session.user.id,
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
    }, [router, sparkSlug, showNotification]);

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