'use client';

import { useEffect, useState, useMemo, use } from 'react';
import { CheckCircle, Star, Linkedin, Twitter, Globe, X, BadgeCheck, Sparkles, PenSquare, Instagram, Facebook, Youtube, FileText, BookOpen } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { AIChatInterface, Message } from '@/components/AIChatInterface';
import { ConsultantConnect } from '@/components/ConsultantConnect';
import { DOCUMENT_TEMPLATES } from '@/data/documentTemplates';
import { createChatConfigs } from '@/data/chatConfigs';
import type { DocumentSummary } from '@/types/chat';
import type { Spark } from '@/types/spark';
import type { ConsultantProfile, ConsultantReview, ConsultantMission } from '@/types/consultant';
import { getConsultantBySlugAction, getConsultantReviewsAction, getConsultantSparksAction, getConsultantMissionsAction } from './actions';
import { formatDuration, formatPrice } from '@/utils/format';
import { getCurrentUser } from '@/services/auth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useNotification } from '@/contexts/NotificationContext';
import { getDefaultAvatarUrl } from '@/utils/avatar';
import logger from '@/utils/logger';

export default function ConsultantProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { showNotification } = useNotification();
    const [showChat, setShowChat] = useState(false);
    const [showConnect, setShowConnect] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [shouldReset, setShouldReset] = useState(false);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
    const [reviews, setReviews] = useState<ConsultantReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
    const [documentSummary, setDocumentSummary] = useState<DocumentSummary>({
        challenge: '',
        currentSituation: '',
        desiredOutcome: '', 
        constraints: '',
        stakeholders: '',
        previousAttempts: '',
        hasEnoughData: false
    });
    const [missions, setMissions] = useState<ConsultantMission[]>([]);

    // Use resolvedParams.slug instead of params.slug
    const consultantIdentifier = resolvedParams.slug;

    // Fetch current user when component mounts
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };
        fetchCurrentUser();
    }, []);

    // Fetch consultant data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Always use getConsultantBySlug since we're on the [slug] route
                const consultantData = await getConsultantBySlugAction(consultantIdentifier || '');

                if (!consultantData) {
                    logger.error('No consultant found for slug:', consultantIdentifier || 'unknown');
                    setError('Consultant not found');
                    setLoading(false);
                    router.push('/');
                    showNotification('error', 'Vous avez été redirigé vers la page d\'accueil car le profil n\'existe pas.');
                    return;
                }

                const [reviewsData, sparksData, missionsData] = await Promise.all([
                    getConsultantReviewsAction(consultantData.id),
                    getConsultantSparksAction(consultantData.id),
                    getConsultantMissionsAction(consultantData.id)
                ]);

                setConsultant(consultantData);
                setReviews(reviewsData);
                setSparks(sparksData);
                setMissions(missionsData);
                setLoading(false);
            } catch (err) {
                logger.error('Error fetching consultant data:', err);
                setError('Impossible de charger les données du consultant');
                setLoading(false);
                router.push('/');
                showNotification('error', 'Vous avez été redirigé vers la page d\'accueil car le profil n\'existe pas.');
            }
        };

        fetchData();
        
        // Cleanup function
        return () => {
            setLoading(true);
            setError(null);
            setConsultant(null);
            setReviews([]);
            setSparks([]);
            setMissions([]);
        };
    }, [consultantIdentifier, router, showNotification]);

    // Memoize chat configs based on consultant's firstname
    const chatConfigs = useMemo(
        () => createChatConfigs(consultant?.first_name),
        [consultant?.first_name]
    );

    // Update messages when consultant changes
    useEffect(() => {
        if (consultant) {
            setMessages([chatConfigs.consultant_qualification.initialMessage]);
        }
    }, [consultant, chatConfigs]);

    // Log state changes using logger instead of console.log
    useEffect(() => {
        if (error) {
            logger.error('Error in ConsultantProfilePage:', error);
        }
        if (loading) {
            logger.info('Loading consultant profile...');
        }
        if (consultant) {
            logger.info('Consultant profile loaded:', { id: consultant.id });
        }
    }, [loading, error, consultant, reviews, sparks]);

    // Reset shouldReset after it's been consumed
    useEffect(() => {
        if (shouldReset) {
            setShouldReset(false);
        }
    }, [shouldReset]);

    const handleChatOpen = () => {
        setShowChat(true);
        // Coordinate the scroll timing with the animation
        setTimeout(() => {
            const chatElement = document.querySelector('.slide-down-enter-active');
            if (chatElement) {
                const elementPosition = chatElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - 100,
                    behavior: 'smooth'
                });
            }
        }, 50);
    };

    const handleConnect = () => {
        setShowConnect(true);
        setShowChat(false);
    };

    const handleBack = () => {
        setShowConnect(false);
        setShowChat(false);
        setShouldReset(true);
        if (consultant) {
            setMessages([chatConfigs.consultant_qualification.initialMessage]);
        }
        setDocumentSummary({
            challenge: '',
            currentSituation: '',
            desiredOutcome: '',
            constraints: '',
            stakeholders: '',
            previousAttempts: '',
            hasEnoughData: false
        });
    };

    const handleMessagesUpdate = (newMessages: Message[]) => {
        setMessages(newMessages);
        for (let i = newMessages.length - 1; i >= 0; i--) {
            const msg = newMessages[i];
            if (msg.role === 'assistant' && msg.summary) {
                if ('hasEnoughData' in msg.summary) {
                    setDocumentSummary(msg.summary as DocumentSummary);
                }
                break;
            }
        }
    };

    // Handle loading state
    if (loading) {
        return <LoadingSpinner message="Chargement du profil..." />;
    }

    // If no consultant data, don't render anything as we're redirecting
    if (!consultant) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Sticky Edit Button */}
            {currentUser?.id === consultant.id && (
                <div className="fixed right-4 top-4 z-50">
                    <button
                        onClick={() => router.push(`/consultants/${consultant.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl border border-gray-200 text-gray-700 hover:text-blue-600 transition-all duration-200"
                        title="Modifier mon profil"
                    >
                        <PenSquare className="h-5 w-5" />
                        <span className="font-medium">Modifier</span>
                    </button>
                </div>
            )}

            <main className="flex-grow relative">
                {/* Cover Section - Full Width */}
                <div className="w-full bg-white shadow-md mb-8 animate-fade-in-up">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative p-4 md:p-6 flex flex-col gap-6">
                            {/* Logo Section - Mobile only */}
                            {(consultant.company || consultant.company_title) && (
                                <div className="block md:hidden text-right">
                                    {consultant.company && (
                                        <div className="text-xl md:text-3xl font-bold text-blue-600">{consultant.company}</div>
                                    )}
                                    {consultant.company_title && (
                                        <div className="text-lg md:text-2xl font-semibold text-gray-700">{consultant.company_title}</div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                <div className="w-40 h-40 md:w-72 md:h-96 mx-auto md:mx-0 flex-shrink-0 bg-gray-400 rounded-2xl border-4 border-white overflow-hidden">
                                    <img
                                        src={consultant.profile_image_url || getDefaultAvatarUrl(consultant.id, 384)}
                                        alt={`${consultant.first_name} ${consultant.last_name}`}
                                        width={288}
                                        height={384}
                                        loading="eager"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow flex flex-col justify-between">
                                    {/* Logo Section - Desktop only */}
                                    {(consultant.company || consultant.company_title) && (
                                        <div className="hidden md:block text-right">
                                            {consultant.company && (
                                                <div className="text-xl md:text-3xl font-bold text-blue-600">{consultant.company}</div>
                                            )}
                                            {consultant.company_title && (
                                                <div className="text-lg md:text-2xl font-semibold text-gray-700">{consultant.company_title}</div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
                                            <h2 className="text-xl md:text-2xl font-bold">
                                                {consultant.first_name} {consultant.last_name}
                                            </h2>
                                            <div className="flex gap-3 justify-center md:justify-start">
                                                {consultant.linkedin && (
                                                    <a href={consultant.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                                        <Linkedin className="h-5 w-5" />
                                                    </a>
                                                )}
                                                {consultant.twitter && (
                                                    <a href={consultant.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                                        <Twitter className="h-5 w-5" />
                                                    </a>
                                                )}
                                                {consultant.instagram && (
                                                    <a href={consultant.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                                                        <Instagram className="h-5 w-5" />
                                                    </a>
                                                )}
                                                {consultant.facebook && (
                                                    <a href={consultant.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                                                        <Facebook className="h-5 w-5" />
                                                    </a>
                                                )}
                                                {consultant.youtube && (
                                                    <a href={consultant.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                                                        <Youtube className="h-5 w-5" />
                                                    </a>
                                                )}
                                                {consultant.medium && (
                                                    <a href={consultant.medium} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                                                        <FileText className="h-5 w-5" />
                                                    </a>
                                                )}
                                                {consultant.substack && (
                                                    <a href={consultant.substack} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                                                        <BookOpen className="h-5 w-5" />
                                                    </a>
                                                )}
                                                {consultant.website && (
                                                    <a href={consultant.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                                                        <Globe className="h-5 w-5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-base md:text-lg font-semibold tracking-wide">
                                            {consultant.title}
                                        </p>
                                    </div>

                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed text-center md:text-left mt-4 md:mt-6">
                                        {consultant.bio}
                                    </p>

                                    <div className="flex flex-col gap-2 mt-4 md:mt-auto">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-500 text-center md:text-left">
                                            {consultant.location && <span>📍 {consultant.location}</span>}
                                            {consultant.languages && consultant.languages.length > 0 && (
                                                <>
                                                    <span className="hidden md:inline">•</span>
                                                    <span>🗣️ {consultant.languages.join(', ')}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4">
                                            {consultant.average_rating && (
                                                <div className="flex items-center gap-1">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                className={`h-4 w-4 ${i < Math.round(consultant.average_rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-600 ml-1">
                                                        {consultant.average_rating.toFixed(1)}/5 ({consultant.review_count} avis)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 md:mt-4 flex justify-center md:justify-start">
                                            <button 
                                                onClick={handleChatOpen}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group"
                                            >
                                                <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" />
                                                Soumettre une demande
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Section */}
                <div className={`max-w-4xl mx-auto px-4 mb-8 ${showChat && !showConnect ? 'animate-slide-down' : 'hidden'}`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {consultant && chatConfigs.consultant_qualification.title}
                                    </h2>
                                </div>
                                <button 
                                    onClick={() => setShowChat(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                {chatConfigs.consultant_qualification.subtitle}
                            </p>
                        </div>
                        <div className="p-4">
                            {consultant && chatConfigs && chatConfigs.consultant_qualification && (
                                <AIChatInterface
                                    template={DOCUMENT_TEMPLATES.consultant_qualification}
                                    messages={messages}
                                    onMessagesUpdate={handleMessagesUpdate}
                                    shouldReset={shouldReset}
                                    onConnect={handleConnect}
                                    systemPrompt={chatConfigs.consultant_qualification.systemPrompt}
                                    summaryInstructions={chatConfigs.consultant_qualification.summaryInstructions}
                                    hideSummary={false}
                                    shouldHandleAICall={true}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Connect Form */}
                <div className={`max-w-4xl mx-auto px-4 mb-8 ${showConnect ? 'animate-slide-down' : 'hidden'}`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {consultant && (
                            <ConsultantConnect 
                                onBack={handleBack}
                                documentSummary={documentSummary}
                                template={DOCUMENT_TEMPLATES.consultant_qualification}
                                confirmationMessage={chatConfigs.consultant_qualification.confirmationMessage}
                                submitMessage={chatConfigs.consultant_qualification.submitMessage}
                                messages={messages}
                            />
                        )}
                    </div>
                </div>

                {/* Service Packages Section */}
                <div className="overflow-hidden mb-8 animate-fade-in-up">
                    <div className="flex overflow-x-auto pb-6 scrollbar-hide">
                        <div className="flex gap-4 mx-auto px-4 py-2">
                            {sparks.sort((a, b) => {
                                const priceA = !a.price || a.price === '' ? 0 : parseFloat(a.price);
                                const priceB = !b.price || b.price === '' ? 0 : parseFloat(b.price);
                                return priceA - priceB;
                            }).map((pkg) => (
                                <div 
                                    key={pkg.id}
                                    onClick={() => router.push(`/sparks/${pkg.url}`)}
                                    className="flex flex-col bg-white rounded-xl shadow-md w-80 flex-shrink-0 
                                    hover:shadow-lg transition-all duration-200 ease-out hover:scale-[1.02]
                                    transform-gpu cursor-pointer"
                                >
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">{pkg.title}</h4>
                                                <div className="flex items-center gap-4 text-gray-500">
                                                    <span>{formatDuration(pkg.duration)}</span>
                                                    <div className="text-sm font-bold text-gray-900">{formatPrice(pkg.price)}</div>
                                                </div>
                                            </div>
                                            {pkg.highlight && (
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {pkg.highlight}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                                        <div className="mt-auto">
                                            <div className="text-sm font-medium text-gray-900 mb-2">Ce qui est inclus :</div>
                                            <ul className="space-y-2">
                                                {pkg.deliverables?.map((item: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/sparks/${pkg.url}`);
                                            }}
                                            className={`w-full font-medium px-4 py-2 rounded-lg transition-colors ${
                                                (!pkg.price || parseFloat(pkg.price) === 0)
                                                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                                : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                                            }`}
                                        >
                                            {(!pkg.price || parseFloat(pkg.price) === 0) ? "Prendre RDV" : "En savoir plus"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Container for the rest of the content */}
                <div className="max-w-4xl mx-auto px-4">
                    {/* Client References Section */}
                    {reviews.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in-up">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold">Références clients</h3>
                                {consultant.is_verified && (
                                    <a 
                                        href="https://www.trustboard.eu" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <BadgeCheck className="h-4 w-4 text-blue-600" />
                                        Vérifiées par Trustboard
                                    </a>
                                )}
                            </div>
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={review.client_image_url || getDefaultAvatarUrl(review.id, 40)}
                                                alt={review.client_name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-lg font-medium text-gray-900">{review.client_name}</div>
                                            {(review.client_role || review.client_company) && (
                                                <div className="text-sm text-gray-600">
                                                    {review.client_role}{review.client_company && ` chez ${review.client_company}`}
                                                </div>
                                            )}
                                            <div className="mt-2 text-gray-700">{review.review_text}</div>
                                            <div className="mt-2 flex">
                                                {Array.from({ length: review.rating }).map((_, i) => (
                                                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Competencies Section */}
                    {consultant.key_competencies && consultant.key_competencies.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in-up">
                            <h3 className="text-xl font-semibold mb-4">Compétences clés</h3>
                            <ul className="grid md:grid-cols-2 gap-2">
                                {consultant.key_competencies.map((competency: string, index: number) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                        <span>{competency}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Past Experiences Section */}
                    {missions.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-16 animate-fade-in-up">
                            <h3 className="text-xl font-semibold mb-4">Mes dernières missions</h3>
                            <div className="space-y-6">
                                {missions.map((mission, index) => (
                                    <div key={index} className="border-l-4 border-blue-600 pl-4">
                                        <h4 className="font-semibold text-lg text-gray-900">{mission.title}</h4>
                                        <p className="text-gray-600 mt-1">{mission.description}</p>
                                        <div className="text-sm text-gray-500 mt-2">
                                            {new Date(mission.date).getFullYear()} - {mission.duration}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}