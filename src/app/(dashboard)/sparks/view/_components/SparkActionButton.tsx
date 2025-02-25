import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useClientSignUp } from '@/contexts/ClientSignUpContext';
import { createClientRequest, getClientRequestsByClientId } from '@/services/clientRequests';
import { getSparkByUrl } from '@/services/sparks';
import type { Spark } from '@/types/spark';
import logger from '@/utils/logger';

type PageContext = 'consultant_marketing' | 'client_purchase' | 'consultant_preview';

interface SparkActionButtonProps {
    pageContext: PageContext;
    sparkUrl: string;
    className?: string;
    isMobile?: boolean;
}

'use client'

export function SparkActionButton({ pageContext, sparkUrl, className = '', isMobile = false }: SparkActionButtonProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { setSparkUrlSlug } = useClientSignUp();
    const isAuthenticated = !!user;

    const handleAction = () => {
        switch (pageContext) {
            case 'consultant_marketing':
                router.push('/consultants#signup-form');
                break;
            case 'client_purchase':
                if (!isAuthenticated) {
                    logger.info('User not authenticated, redirecting to signup', { sparkUrl });
                    setSparkUrlSlug(sparkUrl || null);
                    router.push('/spark-signup');
                } else {
                    if (!sparkUrl || !user) return;
                    logger.info('Creating client request for authenticated user', { sparkUrl });
                    
                    getSparkByUrl(sparkUrl)
                        .then((spark: Spark | null) => {
                            if (!spark) {
                                logger.error('Spark not found when creating request', { sparkUrl });
                                throw new Error('Spark not found');
                            }
                            logger.info('Found spark, checking existing requests', { sparkId: spark.id });
                            
                            return getClientRequestsByClientId(user.id)
                                .then((requests) => {
                                    const existingRequest = requests.find(r => 
                                        r.sparkId === spark.id && 
                                        (r.status === 'pending' || r.status === 'accepted')
                                    );
                                    
                                    if (existingRequest) {
                                        logger.info('Found existing active request, redirecting', { requestId: existingRequest.id });
                                        return Promise.reject({ type: 'existing_request', requestId: existingRequest.id });
                                    }
                                    
                                    logger.info('No existing active request found, creating new request', { sparkId: spark.id });
                                    return createClientRequest({
                                        sparkId: spark.id,
                                        clientId: user.id,
                                        status: 'pending',
                                        message: undefined
                                    });
                                });
                        })
                        .then((request) => {
                            logger.info('Client request created successfully', { requestId: request.id });
                            router.push(`/client/requests/${request.id}`);
                        })
                        .catch((error: { type?: string; requestId?: string }) => {
                            if (error?.type === 'existing_request' && error.requestId) {
                                router.push(`/client/requests/${error.requestId}`);
                            } else {
                                logger.error('Error creating client request:', error);
                                alert('Une erreur est survenue lors de la création de votre demande. Veuillez réessayer.');
                            }
                        });
                }
                break;
            case 'consultant_preview':
                router.push('/sparks/manage');
                break;
        }
    };

    const buttonClasses = `${className} ${
        isMobile
            ? 'w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'
            : 'bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap'
    }`;

    return (
        <button onClick={handleAction} className={buttonClasses}>
            {pageContext === 'consultant_marketing' && (
                <>
                    Créer mon premier Spark
                    <ArrowRight className="h-5 w-5" />
                </>
            )}
            {pageContext === 'client_purchase' && (
                <>
                    Réserver maintenant
                    <ArrowRight className="h-5 w-5" />
                </>
            )}
            {pageContext === 'consultant_preview' && (
                <>
                    Retour à mes Sparks
                    <ArrowRight className="h-5 w-5" />
                </>
            )}
        </button>
    );
} 