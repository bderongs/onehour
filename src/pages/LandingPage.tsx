import React, { useState, useEffect } from 'react';
import { Bot, Users, Package2, Plus, Clock, Briefcase, Target, CheckCircle, MessageSquare, Calendar, Zap, ArrowRightCircle, Shield, Award, Star, Quote, Sparkles, ArrowRight, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { ConsultantConnect } from '../components/ConsultantConnect';
import { UseCaseForm } from '../components/UseCaseForm';
import { motion } from 'framer-motion';

interface UseCase {
    icon: React.ReactNode;
    title: string;
    description: string;
    prefillText: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export function LandingPage() {
    const navigate = useNavigate();
    const [problem, setProblem] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [showConnect, setShowConnect] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [scrollY, setScrollY] = useState(0);
    const [shouldReset, setShouldReset] = useState(false);
    const [problemSummary, setProblemSummary] = useState({
        challenge: '',
        currentSituation: '',
        desiredOutcome: '',
        constraints: '',
        stakeholders: '',
        previousAttempts: '',
        readyForAssessment: false
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (shouldReset) {
            setShouldReset(false);
        }
    }, [shouldReset]);

    const useCases: UseCase[] = [
        {
            icon: <Package2 className="h-6 w-6" />,
            title: "Choisir un logiciel",
            description: "Sélectionnez les meilleurs logiciels pour votre activité.",
            prefillText: "Je cherche à choisir un logiciel pour mon entreprise. J'ai besoin d'aide pour comparer les solutions du marché et identifier celle qui correspond le mieux à mes besoins spécifiques."
        },
        {
            icon: <Bot className="h-6 w-6" />,
            title: "IA & Entreprise",
            description: "Automatisez vos processus avec l'IA et économisez des heures de travail manuel.",
            prefillText: "Je souhaite comprendre comment l'intelligence artificielle pourrait être utile dans mon entreprise. J'aimerais identifier les opportunités concrètes d'application et les bénéfices potentiels."
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Recrutement",
            description: "Sélectionnez les meilleurs candidats avec un expert du domaine.",
            prefillText: "Je dois recruter dans un domaine que je ne maîtrise pas et j'ai besoin d'un expert pour m'aider à évaluer les compétences des candidats lors des entretiens."
        },
        {
            icon: <Plus className="h-6 w-6" />,
            title: "Autre sujet",
            description: "J'ai une autre problématique.",
            prefillText: ""
        }
    ];

    const handleUseCaseClick = (prefillText: string) => {
        setProblem(prefillText);
    };

    const handleSubmit = (e: React.FormEvent, message: string) => {
        e.preventDefault();
        if (message.trim()) {
            const initialMessages: Message[] = [{
                role: 'user',
                content: message.trim()
            }];
            setMessages(initialMessages);
            setShowChat(true);
            setShowForm(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e, problem);
        }
    };

    const handleConnect = () => {
        console.log('LandingPage - handleConnect called, current summary:', problemSummary);
        setShowConnect(true);
        setShowChat(false);
    };

    const handleBack = () => {
        setShowConnect(false);
        setShowChat(false);
        setShowForm(true);
        setMessages([]);
        setShouldReset(true);
        setProblemSummary({
            challenge: '',
            currentSituation: '',
            desiredOutcome: '',
            constraints: '',
            stakeholders: '',
            previousAttempts: '',
            readyForAssessment: false
        });
        setProblem('');
    };

    const handleMessagesUpdate = (newMessages: Message[]) => {
        setMessages(newMessages);
        for (let i = newMessages.length - 1; i >= 0; i--) {
            const msg = newMessages[i];
            if (msg.role === 'assistant' && msg.summary) {
                console.log('LandingPage - Found summary in message:', msg.summary);
                setProblemSummary(msg.summary);
                break;
            }
        }
    };

    const chatConfig = {
        initialMessage: {
            role: 'assistant' as const,
            content: "Bonjour ! Je suis l'assistant virtuel de OneHour Consulting. Mon rôle est de vous aider à clarifier votre besoin avant de vous mettre en relation avec l'expert le plus pertinent. Plus je comprends précisément votre situation, plus nous pourrons vous proposer des solutions adaptées. Pouvez-vous me parler de votre projet ?"
        },
        systemPrompt: `You are OneHour Consulting's AI assistant.
            Your primary role is to help clarify the client's needs before matching them with the most relevant expert.
            Guide the conversation to gather comprehensive information that will help identify the best consultant.
            
            When a user presents their initial problem:
            1) Acknowledge their need
            2) Ask specific follow-up questions about unclear aspects. Only one question at a time.
            3) Keep responses short and focused
            4) Ask one question at a time

            Focus on gathering details about:
            1) Current situation specifics
            2) Desired outcomes and success criteria
            3) Previous attempts or solutions tried
            4) Constraints (budget, timeline, technical limitations)
            5) Key stakeholders involved
            6) Decision-making process

            Do not suggest specific solutions - that's the expert's role.
            When you have gathered sufficient information, explain that you'll help match them with the most relevant expert. No need to suggest a meeting as this is taken care of in the next step.`,
        title: "Assistant OneHour",
        subtitle: "Je vous aide à trouver l'expert idéal",
        onConnect: handleConnect,
        submitMessage: "En soumettant ce formulaire, vous serez contacté par l'un de nos consultants experts dans les prochaines 24 heures.",
        confirmationMessage: "Nous avons bien reçu votre demande. L'un de nos consultants experts vous contactera dans les prochaines 24 heures pour approfondir votre projet et vous proposer les solutions les plus adaptées.",
        summaryInstructions: `Analyze the conversation and create a JSON summary with the following structure.
        IMPORTANT: The summary must be in the same language as the conversation (French if the conversation is in French).
        IMPORTANT: Do not return any other output than the JSON with all fields filled.
        IMPORTANT: The readyForAssessment field must be a boolean (true/false), not a string.
        IMPORTANT: All fields must be filled with non-empty strings, except readyForAssessment which must be a boolean.
        
        {
            "challenge": "Brief description of the main challenge or project",
            "currentSituation": "Current state and context",
            "desiredOutcome": "Desired outcomes and success criteria",
            "constraints": "Budget, timeline, and technical constraints",
            "stakeholders": "Key stakeholders involved",
            "previousAttempts": "Previous solutions or attempts",
            "readyForAssessment": false
        }`
    };

    const whyChoose = [
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Efficace",
            description: "Des solutions concrètes et actionnables, de 30 minutes à plusieurs jours selon vos besoins.",
            metrics: "95% de satisfaction client"
        },
        {
            icon: <Briefcase className="h-6 w-6" />,
            title: "Professionnel",
            description: "Des experts sélectionnés avec plus de 10 ans d'expérience.",
            metrics: "Top 5% des consultants"
        },
        {
            icon: <Target className="h-6 w-6" />,
            title: "Simple",
            description: "Des missions packagées avec un prix affiché, sans devis ni négociation.",
            metrics: "Prix transparent"
        },
        {
            icon: <CheckCircle className="h-6 w-6" />,
            title: "Innovant",
            description: "IA de qualification et matching expert automatisé.",
            metrics: "Réponse en 24h"
        }
    ];

    const howItWorks = [
        {
            icon: <MessageSquare className="h-6 w-6" />,
            title: "Décrivez votre besoin",
            description: "Notre IA qualifie votre demande et identifie vos enjeux clés."
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            title: "Matching expert",
            description: "Nous vous mettons en relation avec l'expert le plus pertinent."
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Session de conseil",
            description: "Une session de conseil adaptée à vos besoins pour des solutions concrètes."
        },
        {
            icon: <CheckCircle className="h-6 w-6" />,
            title: "Suivi & Support",
            description: "Accompagnement dans la mise en œuvre des recommandations."
        }
    ];

    const expertiseAreas = [
        {
            title: "Transformation Digitale",
            description: "Stratégie digitale, innovation produit, conduite du changement",
            icon: <Zap className="h-6 w-6" />
        },
        {
            title: "Management & Organisation",
            description: "Agilité, leadership, excellence opérationnelle",
            icon: <Users className="h-6 w-6" />
        },
        {
            title: "Technologie & Data",
            description: "Architecture IT, data science, cybersécurité",
            icon: <Bot className="h-6 w-6" />
        },
        {
            title: "Innovation & Stratégie",
            description: "Business model, R&D, go-to-market",
            icon: <Target className="h-6 w-6" />
        }
    ];

    const clientReviews = [
        {
            name: "Pascal Dubois",
            role: "CTO",
            company: "TechCorp",
            review: "Service exceptionnel ! J'ai pu résoudre mon problème en une heure seulement. L'expert était très compétent et a parfaitement compris nos besoins.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5"
        },
        {
            name: "Marie Jarry",
            role: "Directrice Innovation",
            company: "ScienceLab",
            review: "Les experts sont très professionnels et à l'écoute. Je recommande vivement. La qualité des conseils a dépassé mes attentes.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
        },
        {
            name: "Albert Dapas",
            role: "CEO",
            company: "FutureTech",
            review: "Une solution rapide et efficace. Très satisfait du service. L'accompagnement était personnalisé et pertinent.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
        }
    ];

    return (
        <div className="min-h-screen">
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
                        transform: `translateY(${scrollY * 0.2}px)`,
                        backgroundImage: `
                            radial-gradient(circle at 50% ${30 + (scrollY * 0.02)}%, rgba(147, 197, 253, 0.2) 0%, transparent 40%),
                            radial-gradient(circle at ${70 - (scrollY * 0.01)}% ${60 + (scrollY * 0.01)}%, rgba(165, 180, 252, 0.2) 0%, transparent 40%)
                        `,
                        transition: 'transform 0.1s ease-out'
                    }}
                />
            </div>

            <div className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Hero Section */}
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                            La boutique du consulting
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto">
                            Décrivez votre problème et trouvez le service et l'expert qu'il vous faut.
                            <br/>
                            On garantit la qualité de la prestation.
                        </p>

                        {/* Use Case Form Section */}
                        <div className="max-w-4xl mx-auto">
                            <div className={`${showForm ? 'block' : 'hidden'}`}>
                                <UseCaseForm
                                    useCases={useCases}
                                    problem={problem}
                                    setProblem={setProblem}
                                    handleSubmit={handleSubmit}
                                    handleUseCaseClick={handleUseCaseClick}
                                    handleKeyDown={handleKeyDown}
                                />
                            </div>

                            {/* Chat Interface */}
                            <div className={`slide-down-enter slide-down-enter-active ${showChat && !showConnect ? 'block' : 'hidden'}`}>
                                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-blue-600" />
                                                <h2 className="text-xl font-semibold text-gray-900">{chatConfig.title}</h2>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 text-left">{chatConfig.subtitle}</p>
                                    </div>
                                    <div className="p-4">
                                        <AIChatInterface
                                            messages={messages}
                                            onMessagesUpdate={handleMessagesUpdate}
                                            config={{
                                                ...chatConfig,
                                                initialMessage: messages.length > 0 ? messages[0] : chatConfig.initialMessage
                                            }}
                                            shouldReset={shouldReset}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Connect Form */}
                            <div className={`slide-down-enter slide-down-enter-active ${showConnect ? 'block' : 'hidden'}`}>
                                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <ConsultantConnect
                                        onBack={handleBack}
                                        problemSummary={problemSummary}
                                        config={chatConfig}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Service Packages Carousel */}
                    <motion.div 
                        className="mb-24"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Nos services
                            </h2>
                            <p className="text-xl text-gray-600 mb-2">
                                Des solutions packagées pour tous vos besoins
                            </p>
                        </div>
                        <div className="max-w-7xl mx-auto select-none">
                            {/* First Row: Software & AI */}
                            <div className="overflow-hidden">
                                <div className="relative px-2 py-2">
                                    <div className="animate-scroll-right flex gap-6">
                                        {/* Duplicate the cards for seamless scrolling */}
                                        {[...Array(2)].map((_, arrayIndex) => (
                                            <div key={arrayIndex} className="flex gap-6 animate-scroll">
                                                {[
                                                    // Software Selection Services
                                                    {
                                                        title: "Sélection CRM",
                                                        duration: "1 journée",
                                                        price: "1\u00A0200\u00A0€",
                                                        description: "Choix d'un CRM adapté à votre équipe commerciale de 5-20 personnes. Comparaison Salesforce, HubSpot, Pipedrive.",
                                                    },
                                                    {
                                                        title: "Choix ERP PME",
                                                        duration: "2 semaines",
                                                        price: "4\u00A0800\u00A0€",
                                                        description: "Sélection d'un ERP pour PME de 50-200 employés. Analyse Sage, SAP Business One, Microsoft Dynamics.",
                                                    },
                                                    {
                                                        title: "Migration Cloud",
                                                        duration: "3 semaines",
                                                        price: "6\u00A0500\u00A0€",
                                                        description: "Migration de vos serveurs vers le cloud. Choix entre AWS, Azure, GCP selon vos contraintes techniques et budgétaires.",
                                                    },
                                                    {
                                                        title: "Outils Collaboratifs",
                                                        duration: "1 semaine",
                                                        price: "2\u00A0800\u00A0€",
                                                        description: "Mise en place d'outils collaboratifs pour équipe hybride. Microsoft 365 vs Google Workspace vs alternatives.",
                                                    },
                                                    // AI Services
                                                    {
                                                        title: "Automatisation RH",
                                                        duration: "2 jours",
                                                        price: "2\u00A0400\u00A0€",
                                                        description: "Automatisation du tri de CV et présélection des candidats avec l'IA. Réduction de 70% du temps de recrutement.",
                                                    },
                                                    {
                                                        title: "IA Service Client",
                                                        duration: "3 semaines",
                                                        price: "7\u00A0500\u00A0€",
                                                        description: "Chatbot IA pour votre service client. Traitement automatique de 40% des demandes clients 24/7.",
                                                    },
                                                    {
                                                        title: "GPT sur mesure",
                                                        duration: "2 semaines",
                                                        price: "5\u00A0200\u00A0€",
                                                        description: "Création d'un assistant GPT personnalisé pour votre métier. Formation sur vos données et documents internes.",
                                                    },
                                                    {
                                                        title: "IA Analyse Data",
                                                        duration: "4 semaines",
                                                        price: "8\u00A0900\u00A0€",
                                                        description: "Analyse prédictive de vos données clients. Prévision des ventes et détection des opportunités commerciales.",
                                                    }
                                                ].map((pkg, index) => (
                                                    <div 
                                                        key={index}
                                                        className="flex flex-col bg-white/80 backdrop-blur-sm rounded-xl shadow-md w-80 flex-shrink-0 
                                                        border border-gray-100
                                                        transform-gpu relative
                                                        before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-br before:from-blue-50/50 before:to-indigo-50/50 before:rounded-xl"
                                                    >
                                                        <div className="p-6 flex flex-col h-full">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-gray-900">{pkg.title}</h4>
                                                                    <p className="text-sm text-gray-500">{pkg.duration}</p>
                                                                    <div className="text-sm font-bold text-gray-900 mt-1">{pkg.price}</div>
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Add gradient overlays */}
                                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f8fafc] to-transparent pointer-events-none z-10"></div>
                                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none z-10"></div>
                                </div>
                            </div>

                            {/* Second Row: Recruitment */}
                            <div className="overflow-hidden">
                                <div className="relative px-4 py-4">
                                    <div className="animate-scroll-left flex gap-6">
                                        {/* Duplicate the cards for seamless scrolling */}
                                        {[...Array(2)].map((_, arrayIndex) => (
                                            <div key={arrayIndex} className="flex gap-6 animate-scroll">
                                                {[
                                                    // Recruitment Services
                                                    {
                                                        title: "Dev Full-Stack",
                                                        duration: "1 semaine",
                                                        price: "2\u00A0900\u00A0€",
                                                        description: "Recrutement développeur Full-Stack (React, Node.js). Tests techniques et entretiens structurés inclus.",
                                                    },
                                                    {
                                                        title: "Équipe Data",
                                                        duration: "1 mois",
                                                        price: "5\u00A0000\u00A0€",
                                                        description: "Constitution d'une équipe Data de 3-4 personnes. Data Scientists et Data Engineers avec 3-5 ans d'expérience.",
                                                    },
                                                    {
                                                        title: "CTO Startup",
                                                        duration: "3 jours",
                                                        price: "3\u00A0200\u00A0€",
                                                        description: "Évaluation et recrutement de votre CTO. Idéal pour startup en Seed/Série A cherchant un profil expérimenté.",
                                                    },
                                                    {
                                                        title: "Tech Lead",
                                                        duration: "2 semaines",
                                                        price: "4\u00A0500\u00A0€",
                                                        description: "Recrutement Tech Lead pour équipe de 5-8 développeurs. Focus architecture logicielle et leadership technique.",
                                                    }
                                                ].map((pkg, index) => (
                                                    <div 
                                                        key={index}
                                                        className="flex flex-col bg-white/80 backdrop-blur-sm rounded-xl shadow-md w-80 flex-shrink-0 
                                                        border border-gray-100
                                                        transform-gpu relative
                                                        before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-br before:from-blue-50/50 before:to-indigo-50/50 before:rounded-xl"
                                                    >
                                                        <div className="p-6 flex flex-col h-full">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-gray-900">{pkg.title}</h4>
                                                                    <p className="text-sm text-gray-500">{pkg.duration}</p>
                                                                    <div className="text-sm font-bold text-gray-900 mt-1">{pkg.price}</div>
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Add gradient overlays */}
                                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f8fafc] to-transparent pointer-events-none z-10"></div>
                                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none z-10"></div>
                                </div>
                            </div>
                        </div>

                        <style>{`
                            @keyframes scroll-right {
                                0% {
                                    transform: translateX(0);
                                }
                                50% {
                                    transform: translateX(-25%);
                                }
                                100% {
                                    transform: translateX(0);
                                }
                            }

                            @keyframes scroll-left {
                                0% {
                                    transform: translateX(-25%);
                                }
                                50% {
                                    transform: translateX(0);
                                }
                                100% {
                                    transform: translateX(-25%);
                                }
                            }

                            .animate-scroll-right {
                                animation: scroll-right 80s linear infinite;
                            }

                            .animate-scroll-left {
                                animation: scroll-left 80s linear infinite;
                            }

                            .animate-scroll-right:hover,
                            .animate-scroll-left:hover {
                                animation-play-state: paused;
                            }
                        `}</style>
                    </motion.div>

                    {/* Why Choose Section */}
                    <motion.div 
                        className="mb-24"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Pourquoi OneHour ?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Une nouvelle approche du conseil, simple et efficace
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {whyChoose.map((reason, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                                        {React.cloneElement(reason.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{reason.title}</h3>
                                    <p className="text-gray-600 mb-4">{reason.description}</p>
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <BadgeCheck className="h-5 w-5" />
                                        <span className="text-sm font-medium">{reason.metrics}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* How it Works Section */}
                    <motion.div 
                        className="mb-24"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Comment ça marche ?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Un processus simple en quatre étapes
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {howItWorks.map((step, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-md text-center"
                                >
                                    <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                                        {React.cloneElement(step.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Expertise Areas Section */}
                    <motion.div 
                        className="mb-24"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Nos domaines d'expertise
                            </h2>
                            <p className="text-xl text-gray-600">
                                Des experts spécialisés pour chaque problématique
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {expertiseAreas.map((area, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-md"
                                >
                                    <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                                        {React.cloneElement(area.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{area.title}</h3>
                                    <p className="text-gray-600">{area.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Client Reviews Section */}
                    <motion.div 
                        className="mb-24"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Ce qu'en disent nos clients
                            </h2>
                            <p className="text-xl text-gray-600">
                                Des résultats concrets et mesurables
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {clientReviews.map((review, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="bg-white p-6 rounded-xl shadow-md"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <img 
                                            src={review.image} 
                                            alt={review.name} 
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                            <p className="text-sm text-gray-600">{review.role}</p>
                                            <p className="text-sm text-gray-600">{review.company}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">"{review.review}"</p>
                                    <div className="flex">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">
                            Prêt à commencer ?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Décrivez votre problématique et trouvez l'expert qu'il vous faut
                        </p>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 group"
                        >
                            Commencer maintenant
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                </div>
            </div>

            <style>{`
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
            `}</style>
        </div>
    );
}