'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, ChevronDown, ChevronUp, ArrowLeft, AlertCircle } from 'lucide-react';
import { getSparkByUrl } from '@/services/sparks';
import type { Spark } from '@/types/spark';
import { formatDuration, formatPrice } from '@/utils/format';
import logger from '@/utils/logger';
import { createClientRequest, getClientRequestsByClientId } from '@/services/clientRequests';
import { useClientSignUp } from '@/contexts/ClientSignUpContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Metadata } from '@/components/Metadata';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// Context types for the page
type PageContext = 'consultant_marketing' | 'client_purchase' | 'consultant_preview';

export default function SparkProductPage() {
    const router = useRouter();
    const params = useParams();
    const sparkUrl = params.sparkUrl as string;
    const { user } = useAuth();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [spark, setSpark] = useState<Spark | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageContext, setPageContext] = useState<PageContext | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { setSparkUrlSlug } = useClientSignUp();

    const DEMO_CONSULTANT_ID = process.env.NEXT_PUBLIC_DEMO_CONSULTANT_ID;

    useEffect(() => {
        const checkAuthAndFetchSpark = async () => {
            if (!sparkUrl) {
                router.push('/');
                return;
            }

            try {
                setIsAuthenticated(!!user);

                // Fetch spark
                const fetchedSpark = await getSparkByUrl(sparkUrl);
                if (!fetchedSpark) {
                    router.push('/');
                    return;
                }
                setSpark(fetchedSpark);

                // Determine page context
                if (fetchedSpark.consultant === DEMO_CONSULTANT_ID) {
                    setPageContext('consultant_marketing');
                } else if (user) {
                    if (user.roles?.includes('consultant')) {
                        setPageContext('consultant_preview');
                    } else {
                        setPageContext('client_purchase');
                    }
                } else {
                    setPageContext('client_purchase');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Impossible de charger les détails du spark. Veuillez réessayer plus tard.');
                setLoading(false);
            }
        };

        checkAuthAndFetchSpark();
    }, [sparkUrl, router, DEMO_CONSULTANT_ID, user]);

    const handleAction = () => {
        if (!spark) return;

        switch (pageContext) {
            case 'consultant_marketing':
                router.push('/consultants#signup-form');
                break;
            case 'client_purchase':
                if (!isAuthenticated) {
                    logger.info('User not authenticated, redirecting to signup', { sparkUrl });
                    // Store sparkUrlSlug in context and redirect to dedicated signup page
                    setSparkUrlSlug(sparkUrl || null);
                    router.push('/spark-signup');
                } else {
                    // If authenticated, create a client request directly
                    if (!sparkUrl || !user) return;
                    logger.info('Creating client request for authenticated user', { sparkUrl });
                    
                    // Get the spark by URL first to ensure we have the correct data
                    getSparkByUrl(sparkUrl)
                        .then(spark => {
                            if (!spark) {
                                logger.error('Spark not found when creating request', { sparkUrl });
                                throw new Error('Spark not found');
                            }
                            logger.info('Found spark, checking existing requests', { sparkId: spark.id });
                            
                            // Check for existing requests
                            return getClientRequestsByClientId(user.id)
                                .then(requests => {
                                    const existingRequest = requests.find(r => 
                                        r.sparkId === spark.id && 
                                        (r.status === 'pending' || r.status === 'accepted')
                                    );
                                    
                                    if (existingRequest) {
                                        logger.info('Found existing active request, redirecting', { requestId: existingRequest.id });
                                        return Promise.reject({ type: 'existing_request', requestId: existingRequest.id });
                                    }
                                    
                                    logger.info('No existing active request found, creating new request', { sparkId: spark.id });
                                    return createClientRequest({ sparkId: spark.id });
                                });
                        })
                        .then(request => {
                            logger.info('Client request created successfully', { requestId: request.id });
                            router.push(`/client/requests/${request.id}`);
                        })
                        .catch(error => {
                            if (error?.type === 'existing_request' && error.requestId) {
                                router.push(`/client/requests/${error.requestId}`);
                            } else {
                                logger.error('Error creating client request:', error);
                                // TODO: Show error notification
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

    const handleBack = () => {
        if (pageContext === 'consultant_preview') {
            router.push('/sparks/manage');
        } else {
            router.back();
        }
    };

    if (loading) {
        return <LoadingSpinner message="Chargement du Spark..." />;
    }

    if (error || !spark) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Spark not found'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Return to home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <Metadata spark={spark} />
            
            {/* Demo Warning Banner */}
            {pageContext === 'consultant_marketing' && (
                <div className="bg-amber-50 border-b border-amber-200">
                    <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 text-amber-800">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p className="text-xs sm:text-sm">Ceci est un exemple de Spark. Créez le vôtre en quelques minutes !</p>
                        </div>
                        <button 
                            onClick={() => router.push('/consultants#signup-form')}
                            className="text-xs sm:text-sm font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 whitespace-nowrap"
                        >
                            Créer mon Spark
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                </div>

                {/* Hero Section */}
                <motion.div
                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8"
                    variants={fadeInUp}
                    initial={false}
                    animate="animate"
                >
                    <div className="flex flex-col gap-6 lg:gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3 lg:mb-4">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{spark.title}</h1>
                                {spark.highlight && (
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {spark.highlight}
                                    </span>
                                )}
                            </div>
                            <p className="text-base lg:text-lg text-gray-600 mb-4 lg:mb-6">{spark.description}</p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-5 w-5" />
                                    <span>{formatDuration(spark.duration)}</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{formatPrice(spark.price)}</div>
                            </div>
                        </div>
                        {/* Desktop Booking Button */}
                        <div className="hidden lg:flex justify-end">
                            <button
                                onClick={handleAction}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 
                                        transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
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
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 