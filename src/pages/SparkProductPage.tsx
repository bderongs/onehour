import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, ChevronDown, ChevronUp, ArrowLeft, AlertCircle } from 'lucide-react';
import { getSparkByUrl } from '../services/sparks';
import type { Spark } from '../types/spark';
import { formatDuration, formatPrice } from '../utils/format';
import { DashboardLayout } from '../layouts/DashboardLayout';
import logger from '../utils/logger';
import { createClientRequest, getClientRequestsByClientId } from '../services/clientRequests';
import { useClientSignUp } from '../contexts/ClientSignUpContext';
import { useAuth } from '../contexts/AuthContext';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// Context types for the page
type PageContext = 'consultant_marketing' | 'client_purchase' | 'consultant_preview';

export function SparkProductPage() {
    const { sparkUrl } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [spark, setSpark] = useState<Spark | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageContext, setPageContext] = useState<PageContext | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { setSparkUrlSlug } = useClientSignUp();

    const DEMO_CONSULTANT_ID = import.meta.env.VITE_DEMO_CONSULTANT_ID;

    useEffect(() => {
        const checkAuthAndFetchSpark = async () => {
            if (!sparkUrl) {
                navigate('/');
                return;
            }

            try {
                setIsAuthenticated(!!user);

                // Fetch spark
                const fetchedSpark = await getSparkByUrl(sparkUrl);
                if (!fetchedSpark) {
                    navigate('/');
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
                setError('Failed to load spark details. Please try again later.');
                setLoading(false);
            }
        };

        checkAuthAndFetchSpark();
    }, [sparkUrl, navigate, DEMO_CONSULTANT_ID, user]);

    const handleAction = () => {
        if (!spark) return;

        switch (pageContext) {
            case 'consultant_marketing':
                navigate('/consultants#signup-form');
                break;
            case 'client_purchase':
                if (!isAuthenticated) {
                    logger.info('User not authenticated, redirecting to signup', { sparkUrl });
                    // Store sparkUrlSlug in context and redirect to dedicated signup page
                    setSparkUrlSlug(sparkUrl || null);
                    navigate('/spark-signup');
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
                            navigate(`/client/requests/${request.id}`);
                        })
                        .catch(error => {
                            if (error?.type === 'existing_request' && error.requestId) {
                                navigate(`/client/requests/${error.requestId}`);
                            } else {
                                logger.error('Error creating client request:', error);
                                // TODO: Show error notification
                                alert('Une erreur est survenue lors de la création de votre demande. Veuillez réessayer.');
                            }
                        });
                }
                break;
            case 'consultant_preview':
                navigate('/sparks/manage');
                break;
        }
    };

    const handleBack = () => {
        if (pageContext === 'consultant_preview') {
            navigate('/sparks/manage');
        } else if (location.key) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading spark details...</p>
                </div>
            </div>
        );
    }

    if (error || !spark) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Spark not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Return to home
                    </button>
                </div>
            </div>
        );
    }

    const MainContent = () => (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Demo Warning Banner */}
            {pageContext === 'consultant_marketing' && (
                <div className="bg-amber-50 border-b border-amber-200">
                    <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 text-amber-800">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p className="text-xs sm:text-sm">Ceci est un exemple de Spark. Créez le vôtre en quelques minutes !</p>
                        </div>
                        <button 
                            onClick={() => navigate('/consultants#signup-form')}
                            className="text-xs sm:text-sm font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 whitespace-nowrap"
                        >
                            Créer mon Spark
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button - Consistent with edit pages */}
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
                        {/* Mobile Booking Button */}
                        <div className="lg:hidden w-full">
                            <button
                                onClick={handleAction}
                                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold 
                                        hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        {/* Detailed Description */}
                        <motion.section
                            className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                            variants={fadeInUp}
                        >
                            <h2 className="text-lg lg:text-xl font-semibold mb-4">Description détaillée</h2>
                            <p className="text-gray-600 whitespace-pre-line text-sm lg:text-base">
                                {spark.detailedDescription}
                            </p>
                        </motion.section>

                        {/* Methodology */}
                        {spark.methodology && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Méthodologie</h2>
                                <div className="space-y-3">
                                    {spark.methodology.map((step, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-600 text-sm lg:text-base">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Deliverables */}
                        {spark.deliverables && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Ce que vous obtiendrez</h2>
                                <div className="space-y-3">
                                    {spark.deliverables.map((deliverable, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600 text-sm lg:text-base">{deliverable}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* FAQ */}
                        {spark.faq && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Questions fréquentes</h2>
                                <div className="space-y-4">
                                    {spark.faq.map((item, index) => (
                                        <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                            <button
                                                className="w-full flex items-center justify-between text-left"
                                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                            >
                                                <span className="font-medium text-gray-900 text-sm lg:text-base pr-4">{item.question}</span>
                                                {expandedFaq === index ? (
                                                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                )}
                                            </button>
                                            {expandedFaq === index && (
                                                <p className="mt-2 text-gray-600 text-sm lg:text-base">{item.answer}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6 lg:space-y-8">
                        {/* Target Audience */}
                        {spark.targetAudience && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Pour qui ?</h2>
                                <div className="space-y-3">
                                    {spark.targetAudience.map((audience, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600 text-sm lg:text-base">{audience}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Prerequisites */}
                        {spark.prerequisites && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Prérequis</h2>
                                <div className="space-y-3">
                                    {spark.prerequisites.map((prerequisite, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600 text-sm lg:text-base">{prerequisite}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Expert Profile */}
                        {spark.expertProfile && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Profil de l'expert</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Expertise</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {spark.expertProfile.expertise.map((exp, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs lg:text-sm"
                                                >
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Expérience</h3>
                                        <p className="text-gray-600 text-sm lg:text-base">{spark.expertProfile.experience}</p>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* Next Steps */}
                        {spark.nextSteps && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Prochaines étapes</h2>
                                <div className="space-y-3">
                                    {spark.nextSteps.map((step, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600 text-sm lg:text-base">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Wrap in DashboardLayout for consultant preview
    return pageContext === 'consultant_preview' ? (
        <DashboardLayout>
            <MainContent />
        </DashboardLayout>
    ) : (
        <MainContent />
    );
} 