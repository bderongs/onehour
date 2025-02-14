import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createClientRequest, getClientRequestsByClientId } from '../../services/clientRequests';
import { getSparkByUrl } from '../../services/sparks';
import { Notification } from '../../components/Notification';
import { supabase } from '../../lib/supabase';
import logger from '../../utils/logger';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function SparkRequestHandler() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

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
                const { data: { user } } = await supabase.auth.getUser();
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
                    navigate(`/client/requests/${existingRequest.id}`, { replace: true });
                    return;
                }

                // Create new request
                logger.info('Creating new request', { sparkId: spark.id });
                const request = await createClientRequest({ sparkId: spark.id });
                navigate(`/client/requests/${request.id}`, { replace: true });

            } catch (err: any) {
                logger.error('Error handling spark request:', err);
                const errorMessage = err.message || 'Une erreur est survenue lors de la création de la demande';
                setError(errorMessage);
                navigate('/client/dashboard');
            } finally {
                setLoading(false);
            }
        };

        handleSparkRequest();
    }, [navigate, searchParams]);

    if (loading) {
        return <LoadingSpinner message="Traitement de votre demande..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                    <Notification
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                </div>
            </div>
        );
    }

    return null;
} 
