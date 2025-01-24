import { useEffect, useState } from 'react';
import { CheckCircle, Star, Linkedin, Twitter, Globe, X, BadgeCheck, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { ConsultantConnect } from '../components/ConsultantConnect';
import { DOCUMENT_TEMPLATES } from '../data/documentTemplates';
import { CHAT_CONFIGS } from '../data/chatConfigs';
import type { DocumentSummary } from '../types/chat';
import type { Spark } from '../types/spark';
import type { ConsultantProfile, ConsultantReview } from '../types/consultant';
import { getConsultantProfile, getConsultantReviews, getConsultantSparks } from '../services/consultants';
import { formatDuration, formatPrice } from '../utils/format';
import { useNavigate } from 'react-router-dom';

export default function ConsultantProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState(false);
    const [showConnect, setShowConnect] = useState(false);
    const [messages, setMessages] = useState<Message[]>([CHAT_CONFIGS.consultant_qualification.initialMessage]);
    const [shouldReset, setShouldReset] = useState(false);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
    const [reviews, setReviews] = useState<ConsultantReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [documentSummary, setDocumentSummary] = useState<DocumentSummary>({
        challenge: '',
        currentSituation: '',
        desiredOutcome: '', 
        constraints: '',
        stakeholders: '',
        previousAttempts: '',
        hasEnoughData: false
    });

    // Fetch consultant data when component mounts
    useEffect(() => {
        console.log('ConsultantProfilePage - Fetching data, id:', id);
        const fetchData = async () => {
            if (!id) {
                console.log('ConsultantProfilePage - No ID provided');
                setError('Consultant ID is required');
                setLoading(false);
                return;
            }

            try {
                console.log('ConsultantProfilePage - Starting data fetch');
                const [consultantData, reviewsData, sparksData] = await Promise.all([
                    getConsultantProfile(id),
                    getConsultantReviews(id),
                    getConsultantSparks(id)
                ]);

                if (!consultantData) {
                    console.log('ConsultantProfilePage - Consultant not found');
                    setError('Consultant not found');
                    setLoading(false);
                    return;
                }

                console.log('ConsultantProfilePage - Data fetched successfully:', { 
                    consultant: consultantData,
                    reviews: reviewsData.length,
                    sparks: sparksData.length
                });

                setConsultant(consultantData);
                setReviews(reviewsData);
                setSparks(sparksData);
                setLoading(false);
            } catch (err) {
                console.error('ConsultantProfilePage - Error fetching data:', err);
                setError('Failed to load consultant data');
                setLoading(false);
            }
        };

        fetchData();
        
        // Cleanup function
        return () => {
            console.log('ConsultantProfilePage - Component cleanup');
            setLoading(true);
            setError(null);
            setConsultant(null);
            setReviews([]);
            setSparks([]);
        };
    }, [id]);

    // Log state changes
    useEffect(() => {
        console.log('ConsultantProfilePage - State update:', {
            loading,
            error,
            hasConsultant: !!consultant,
            reviewsCount: reviews.length,
            sparksCount: sparks.length
        });
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
        setMessages([CHAT_CONFIGS.consultant_qualification.initialMessage]);
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
        return (
            <div className="min-h-screen flex flex-col">
                {/* Animated Background */}
                <div className="fixed inset-0 pointer-events-none">
                    <div 
                        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 20% 35%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 75% 44%, rgba(165, 180, 252, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 5% 75%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 80% 95%, rgba(165, 180, 252, 0.15) 0%, transparent 50%)
                            `
                        }}
                    />
                    <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 50% 30%, rgba(147, 197, 253, 0.2) 0%, transparent 40%),
                                radial-gradient(circle at 70% 60%, rgba(165, 180, 252, 0.2) 0%, transparent 40%)
                            `
                        }}
                    />
                </div>
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement du profil...</p>
                    </div>
                </main>
            </div>
        );
    }

    // Handle error state
    if (error || !consultant) {
        return (
            <div className="min-h-screen flex flex-col">
                {/* Animated Background */}
                <div className="fixed inset-0 pointer-events-none">
                    <div 
                        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 20% 35%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 75% 44%, rgba(165, 180, 252, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 5% 75%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 80% 95%, rgba(165, 180, 252, 0.15) 0%, transparent 50%)
                            `
                        }}
                    />
                    <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 50% 30%, rgba(147, 197, 253, 0.2) 0%, transparent 40%),
                                radial-gradient(circle at 70% 60%, rgba(165, 180, 252, 0.2) 0%, transparent 40%)
                            `
                        }}
                    />
                </div>
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-red-500 mb-4">{error || 'Une erreur est survenue'}</div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="text-blue-600 hover:text-blue-700"
                        >
                            Réessayer
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 35%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 75% 44%, rgba(165, 180, 252, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 5% 75%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 95%, rgba(165, 180, 252, 0.15) 0%, transparent 50%)
                        `
                    }}
                />
                <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 50% 30%, rgba(147, 197, 253, 0.2) 0%, transparent 40%),
                            radial-gradient(circle at 70% 60%, rgba(165, 180, 252, 0.2) 0%, transparent 40%)
                        `
                    }}
                />
            </div>

            {/* Content */}
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
                                        src={consultant.profile_image_url || `https://ui-avatars.com/api/?name=${consultant.first_name}+${consultant.last_name}&size=384`}
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
                                                Discutons de votre projet
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
                                    <h2 className="text-xl font-semibold text-gray-900">{CHAT_CONFIGS.consultant_qualification.title}</h2>
                                </div>
                                <button 
                                    onClick={() => setShowChat(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{CHAT_CONFIGS.consultant_qualification.subtitle}</p>
                        </div>
                        <div className="p-4">
                            <AIChatInterface
                                template={DOCUMENT_TEMPLATES.consultant_qualification}
                                messages={messages}
                                onMessagesUpdate={handleMessagesUpdate}
                                shouldReset={shouldReset}
                                onConnect={handleConnect}
                                systemPrompt={CHAT_CONFIGS.consultant_qualification.systemPrompt}
                                summaryInstructions={CHAT_CONFIGS.consultant_qualification.summaryInstructions}
                            />
                        </div>
                    </div>
                </div>

                {/* Connect Form */}
                <div className={`max-w-4xl mx-auto px-4 mb-8 ${showConnect ? 'animate-slide-down' : 'hidden'}`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <ConsultantConnect 
                            onBack={handleBack}
                            documentSummary={documentSummary}
                            template={DOCUMENT_TEMPLATES.consultant_qualification}
                            confirmationMessage={CHAT_CONFIGS.consultant_qualification.confirmationMessage}
                            submitMessage={CHAT_CONFIGS.consultant_qualification.submitMessage}
                        />
                    </div>
                </div>

                {/* Service Packages Section */}
                <div className="overflow-hidden mb-8 animate-fade-in-up">
                    <div className="flex overflow-x-auto pb-6 scrollbar-hide">
                        <div className="flex gap-4 mx-auto px-4 py-2">
                            {sparks.map((pkg, index) => (
                                <div 
                                    key={pkg.id}
                                    className="flex flex-col bg-white rounded-xl shadow-md w-80 flex-shrink-0 
                                    hover:shadow-lg transition-all duration-200 ease-out hover:scale-[1.02]
                                    transform-gpu"
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
                                                {pkg.deliverables?.map((item, i) => (
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
                                            onClick={() => navigate(`/sparks/${pkg.url}`)}
                                            className={`w-full font-medium px-4 py-2 rounded-lg transition-colors ${
                                                index === 0 
                                                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                                : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                                            }`}
                                        >
                                            {index === 0 ? "Prendre RDV" : "En savoir plus"}
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
                                                src={review.client_image_url || `https://ui-avatars.com/api/?name=${review.client_name}&size=40`}
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
                                {consultant.key_competencies.map((competency, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                        <span>{competency}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
