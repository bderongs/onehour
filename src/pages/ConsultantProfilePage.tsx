import { useEffect, useState } from 'react';
import { CheckCircle, Star, ArrowRight, Linkedin, Twitter, Globe, X, BadgeCheck, Sparkles, AlertCircle } from 'lucide-react';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { ConsultantConnect } from '../components/ConsultantConnect';
import { DOCUMENT_TEMPLATES } from '../data/documentTemplates';
import { CHAT_CONFIGS } from '../data/chatConfigs';
import type { DocumentSummary } from '../types/chat';
import { Spark } from '../types/spark';
import { getSparksByConsultant } from '../services/sparks';
import { formatDuration, formatPrice } from '../utils/format';
import { useNavigate } from 'react-router-dom';

interface Review {
    name: string;
    role: string;
    company: string;
    review: string;
    rating: number;
    initials: string;
    image: string;
}

// Keep track of used times to avoid duplicates
const usedTimes = new Set<string>();

function getNextAvailability(): string {
    const now = new Date();
    
    // Generate a random day in the next 1-3 days
    const daysToAdd = Math.floor(Math.random() * 3) + 1;
    const availabilityDate = new Date(now);
    availabilityDate.setDate(availabilityDate.getDate() + daysToAdd);
    
    // Keep adding days until we find a weekday (1-5, Monday-Friday)
    while (availabilityDate.getDay() === 0 || availabilityDate.getDay() === 6) {
        availabilityDate.setDate(availabilityDate.getDate() + 1);
    }

    // Generate a random time during working hours (9:00-17:00)
    // We'll try up to 10 times to find an unused time
    let time = '';
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        // Generate hours between 9 and 16 (to ensure end time is before 17:00)
        const hours = Math.floor(Math.random() * 8) + 9;
        // Generate minutes in 15-minute increments (0, 15, 30, 45)
        const minutes = Math.floor(Math.random() * 4) * 15;
        
        time = `${hours.toString().padStart(2, '0')}h${minutes === 0 ? '00' : minutes}`;
        
        // Check if this time is already used
        const dateTimeKey = `${availabilityDate.toDateString()}-${time}`;
        if (!usedTimes.has(dateTimeKey)) {
            usedTimes.add(dateTimeKey);
            break;
        }
        
        attempts++;
    }

    // If we couldn't find an unused time, just use the last generated one
    
    // Format the date in French
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    };
    return `${availabilityDate.toLocaleDateString('fr-FR', options)}, ${time}`;
}

function useScrollAnimation() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-50px 0px'
            }
        );

        const elements = document.querySelectorAll('.scroll-animation');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);
}

export default function ConsultantProfilePage() {
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState(false);
    const [showConnect, setShowConnect] = useState(false);
    const [messages, setMessages] = useState<Message[]>([CHAT_CONFIGS.consultant_qualification.initialMessage]);
    const [shouldReset, setShouldReset] = useState(false);
    const [sparks, setSparks] = useState<Spark[]>([]);
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

    const clientReviews: Review[] = [
        {
            name: "Pascal Dubois",
            role: "CTO",
            company: "TechCorp",
            review: "Service exceptionnel ! J'ai pu résoudre mon problème en une heure seulement. Arnaud était très compétent et a parfaitement compris nos besoins.",
            rating: 5,
            initials: "PL",
            image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5"
        },
        {
            name: "Marie Jarry",
            role: "Directrice Innovation",
            company: "ScienceLab",
            review: "Arnaud est très professionnel et à l'écoute. Je recommande vivement. La qualité des conseils a dépassé mes attentes.",
            rating: 5,
            initials: "MC",
            image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
        },
        {
            name: "Albert Dapas",
            role: "CEO",
            company: "FutureTech",
            review: "Une solution rapide et efficace. Très satisfait du service. L'accompagnement était personnalisé et pertinent.",
            rating: 5,
            initials: "AE",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
        }
    ];

    useScrollAnimation();

    const CONSULTANT_ID = '3c957f54-d43b-4cef-bd65-b519cd8b09d1';

    // Add function to handle navigation to spark product page
    const handleSparkClick = (pkg: Spark) => {
        navigate(`/sparks/${pkg.url}`);
    };

    // No need to filter sparks anymore since we're fetching only the consultant's sparks
    const consultingPackages = sparks;

    // Calculate average rating
    const averageRating = clientReviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / clientReviews.length;

    // Fetch sparks when component mounts
    useEffect(() => {
        const fetchSparks = async () => {
            try {
                const fetchedSparks = await getSparksByConsultant(CONSULTANT_ID);
                setSparks(fetchedSparks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching sparks:', err);
                setError('Failed to load sparks. Please try again later.');
                setLoading(false);
            }
        };

        fetchSparks();
    }, []);

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
                    top: elementPosition - 100, // Offset to leave some space at the top
                    behavior: 'smooth'
                });
            }
        }, 50); // Reduced delay to start scroll earlier in the animation
    };


    const handleConnect = () => {
        console.log('ConsultantProfilePage - handleConnect called, current summary:', documentSummary);
        setShowConnect(true);
        setShowChat(false);
    };

    const handleBack = () => {
        console.log('ConsultantProfilePage - handleBack called');
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

    // Add handler for messages update to extract summary
    const handleMessagesUpdate = (newMessages: Message[]) => {
        setMessages(newMessages);
        // Look for the latest summary in the messages
        for (let i = newMessages.length - 1; i >= 0; i--) {
            const msg = newMessages[i];
            if (msg.role === 'assistant' && msg.summary) {
                console.log('ConsultantProfilePage - Found summary in message:', msg.summary);
                setDocumentSummary(msg.summary);
                break;
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            <style>
                {`
                    .scroll-animation {
                        opacity: 0;
                        transform: translateY(30px);
                        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                        will-change: transform, opacity;
                    }
                    .animate-in {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .scroll-animation {
                            transition: none;
                            opacity: 1;
                            transform: none;
                        }
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .slide-down-enter {
                        opacity: 0;
                        max-height: 0;
                        transform: translateY(-20px);
                        overflow: hidden;
                    }
                    .slide-down-enter-active {
                        opacity: 1;
                        max-height: 2000px;
                        transform: translateY(0);
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                        overflow: hidden;
                    }
                    .slide-down-exit {
                        opacity: 1;
                        max-height: 2000px;
                        transform: translateY(0);
                        overflow: hidden;
                    }
                    .slide-down-exit-active {
                        opacity: 0;
                        max-height: 0;
                        transform: translateY(-20px);
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                        overflow: hidden;
                    }
                `}
            </style>

            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
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

            {/* Sample Profile Warning Banner */}
            <div className="bg-amber-50 border-b border-amber-200">
                <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">Ceci est un profil exemple à des fins de démonstration. Les informations présentées ne sont pas réelles.</p>
                    </div>
                    <a href="/consultants" className="text-xs sm:text-sm font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 whitespace-nowrap">
                        Créer mon profil
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </div>
            </div>

            <main className="flex-grow relative">
                {/* Cover Section - Full Width */}
                <div className="scroll-animation w-full bg-white shadow-md mb-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative p-4 md:p-6 flex flex-col gap-6">
                            {/* Logo Section - Mobile only */}
                            <div className="block md:hidden text-right">
                                <div className="text-xl md:text-3xl font-bold text-blue-600">ShowMeTheWay</div>
                                <div className="text-lg md:text-2xl font-semibold text-gray-700">Consulting</div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                <div className="w-40 h-40 md:w-72 md:h-96 mx-auto md:mx-0 flex-shrink-0 bg-gray-400 rounded-2xl border-4 border-white overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&w=800&q=80"
                                        alt="Arnaud Lacaze"
                                        width={288}
                                        height={384}
                                        loading="eager"
                                        className="w-full h-full object-cover"
                                        style={{ objectPosition: '50% 10%' }}
                                    />
                                </div>
                                <div className="flex-grow flex flex-col justify-between">
                                    {/* Logo Section - Desktop only */}
                                    <div className="hidden md:block text-right">
                                        <div className="text-xl md:text-3xl font-bold text-blue-600">ShowMeTheWay</div>
                                        <div className="text-lg md:text-2xl font-semibold text-gray-700">Consulting</div>
                                    </div>
                                    
                                    <div className="text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
                                            <h2 className="text-xl md:text-2xl font-bold">Arnaud Lacaze</h2>
                                            <div className="flex gap-3 justify-center md:justify-start">
                                                <a href="https://linkedin.com/in/arnaud-lacaze" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                                    <Linkedin className="h-5 w-5" />
                                                </a>
                                                <a href="https://twitter.com/arnaudlacaze" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                                    <Twitter className="h-5 w-5" />
                                                </a>
                                                <a href="https://arnaudlacaze.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Globe className="h-5 w-5" />
                                                </a>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-base md:text-lg font-semibold tracking-wide">Expert en Transformation Digitale & Innovation</p>
                                    </div>

                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed text-center md:text-left mt-4 md:mt-6">
                                        Passionné par l'innovation et la transformation digitale, j'accompagne les entreprises dans leur évolution technologique depuis plus de 15 ans. Mon approche combine expertise technique et vision stratégique pour des résultats concrets et durables.
                                    </p>

                                    <div className="flex flex-col gap-2 mt-4 md:mt-auto">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-500 text-center md:text-left">
                                            <span>📍 Paris, France</span>
                                            <span className="hidden md:inline">•</span>
                                            <span>🗣️ Français, English, Español</span>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4">
                                            <div className="flex items-center gap-1">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600 ml-1">
                                                    {averageRating.toFixed(1)}/5 ({clientReviews.length} avis)
                                                </span>
                                            </div>
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

                {/* Chat Section - Always mounted but conditionally visible */}
                <div className={`max-w-4xl mx-auto px-4 mb-8 slide-down-enter slide-down-enter-active ${showChat && !showConnect ? 'block' : 'hidden'}`}>
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

                {/* Connect Form - Always mounted but conditionally visible */}
                <div className={`max-w-4xl mx-auto px-4 mb-8 slide-down-enter slide-down-enter-active ${showConnect ? 'block' : 'hidden'}`}>
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
                <div className="scroll-animation overflow-hidden mb-8">
                    <div className="flex overflow-x-auto pb-6 scrollbar-hide">
                        <div className="flex gap-4 mx-auto px-4 py-2">
                            {loading ? (
                                // Loading state
                                Array(3).fill(0).map((_, index) => (
                                    <div 
                                        key={index}
                                        className="flex flex-col bg-white rounded-xl shadow-md w-80 flex-shrink-0 animate-pulse"
                                    >
                                        <div className="p-6">
                                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                            <div className="h-20 bg-gray-200 rounded mb-4"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : error ? (
                                // Error state
                                <div className="w-full flex items-center justify-center py-8">
                                    <div className="text-center">
                                        <div className="text-red-500 mb-2">Une erreur est survenue lors du chargement des services</div>
                                        <button 
                                            onClick={() => window.location.reload()} 
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            Réessayer
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Normal state with data
                                consultingPackages.map((pkg, index) => (
                                    <div 
                                        key={index}
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
                                                    {(pkg.deliverables || pkg.benefits || []).map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                            <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0">
                                            <div className="text-center mb-3">
                                                <div className="text-sm text-gray-500">Prochaine disponibilité</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {getNextAvailability()}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleSparkClick(pkg)}
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
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Container for the rest of the content */}
                <div className="max-w-4xl mx-auto px-4">
                    {/* Client References Section */}
                    <div className="scroll-animation bg-white p-6 rounded-lg shadow-md mb-8">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold">Références clients</h3>
                            <a 
                                href="https://www.trustboard.eu" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <BadgeCheck className="h-4 w-4 text-blue-600" />
                                Vérifiées par Trustboard
                            </a>
                        </div>
                        <div className="space-y-4">
                            {clientReviews.map((review, index) => (
                                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={review.image}
                                            alt={review.name}
                                            className="h-10 w-10 rounded-full object-cover object-top"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-medium text-gray-900">{review.name}</div>
                                        <div className="text-sm text-gray-600">{review.role} chez {review.company}</div>
                                        <div className="mt-2 text-gray-700">{review.review}</div>
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

                    {/* Key Competencies Section */}
                    <div className="scroll-animation bg-white p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-semibold mb-4">Compétences clés</h3>
                        <ul className="grid md:grid-cols-2 gap-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Stratégie digitale</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Innovation produit</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Transformation organisationnelle</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Management de l'innovation</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Conduite du changement</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Agilité à l'échelle</span>
                            </li>
                        </ul>
                    </div>

                    {/* Toolkit Section */}
                    {/*<div className="scroll-animation bg-white p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-semibold mb-4">Toolkit</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Gestion de Projet & Agilité</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Jira</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Confluence</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Trello</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Azure DevOps</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Miro</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Design & Prototypage</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Figma</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Adobe XD</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">InVision</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Sketch</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Analyse & Reporting</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Tableau</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Power BI</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Google Analytics</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Looker</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Collaboration & Communication</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Slack</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Microsoft Teams</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Notion</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Google Workspace</span>
                                </div>
                            </div>
                        </div>
                    </div>*/}

                    {/* Recent Missions Section */}
                    {<div className="scroll-animation bg-white p-6 rounded-lg shadow-md mb-16">
                        <h3 className="text-xl font-semibold mb-4">Mes dernières missions</h3>
                        <div className="space-y-6">
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h4 className="font-semibold text-lg text-gray-900">Transformation Agile chez TotalEnergies</h4>
                                <p className="text-gray-600 mt-1">Accompagnement de la transformation agile à l'échelle pour une business unit de 400 personnes. Mise en place du framework SAFe, formation des équipes et du management, et création d'un centre d'excellence agile.</p>
                                <div className="text-sm text-gray-500 mt-2">2023 - 6 mois</div>
                            </div>
                            
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h4 className="font-semibold text-lg text-gray-900">Innovation Produit chez Decathlon</h4>
                                <p className="text-gray-600 mt-1">Refonte du processus d'innovation produit et mise en place d'une approche design thinking. Animation d'ateliers d'idéation et accompagnement des équipes dans le développement de nouveaux produits connectés.</p>
                                <div className="text-sm text-gray-500 mt-2">2022 - 8 mois</div>
                            </div>
                            
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h4 className="font-semibold text-lg text-gray-900">Stratégie Digitale pour La Poste</h4>
                                <p className="text-gray-600 mt-1">Définition et déploiement de la stratégie de transformation digitale. Création d'une feuille de route sur 3 ans et accompagnement dans la mise en place des premiers projets structurants.</p>
                                <div className="text-sm text-gray-500 mt-2">2022 - 4 mois</div>
                            </div>
                        </div>
                    </div>}
                </div>
            </main>
        </div>
    );
}
