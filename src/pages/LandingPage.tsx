import React, { useState, useEffect } from 'react';
import { Bot, Users, Package2, Plus, Clock, Briefcase, Target, CheckCircle, MessageSquare, Calendar, Zap, ArrowRightCircle, Shield, Award, Star, Quote, Sparkle, ArrowRight, BadgeCheck, FileText } from 'lucide-react';
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

interface ExpertCall {
    icon: React.ReactNode;
    title: string;
    duration: string;
    prefillText: string;
    price?: string;
    description?: string;
    benefits?: string[];
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
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(null);

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

    useEffect(() => {
        if (expandedCallIndex === null) {
            setExpandedCallIndex(0);
        }
    }, []);

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

    const expertCalls: ExpertCall[] = [
        {
            icon: <Package2 className="h-6 w-6" />,
            title: "Choisir un CRM",
            duration: "1h",
            price: "290€ HT",
            description: "Un expert en solutions CRM vous aide à comparer et sélectionner la meilleure solution pour votre entreprise.",
            benefits: [
                "Analyse de vos besoins spécifiques",
                "Comparaison des solutions du marché",
                "Recommandations personnalisées"
            ],
            prefillText: "J'ai besoin d'aide pour choisir un CRM adapté à mon entreprise de 50 personnes."
        },
        {
            icon: <Bot className="h-6 w-6" />,
            title: "Automatiser le support client",
            duration: "1h30",
            price: "390€ HT",
            description: "Optimisez votre service client grâce à l'IA. Un expert vous guide dans l'automatisation intelligente de vos processus.",
            benefits: [
                "Audit de vos processus actuels",
                "Identification des opportunités d'automatisation",
                "Plan d'implémentation détaillé"
            ],
            prefillText: "Je souhaite automatiser notre support client avec l'IA pour réduire le temps de réponse."
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Recruter un CTO",
            duration: "2h",
            price: "490€ HT",
            description: "Un expert en recrutement tech vous accompagne dans la définition du profil et la stratégie de recrutement de votre futur CTO.",
            benefits: [
                "Définition du profil idéal",
                "Stratégie de sourcing",
                "Grille d'évaluation technique"
            ],
            prefillText: "J'ai besoin d'aide pour recruter un CTO pour ma startup en série A."
        },
        {
            icon: <Target className="h-6 w-6" />,
            title: "Définir ma stratégie marketing",
            duration: "1h30",
            price: "390€ HT",
            description: "Construisez une stratégie marketing efficace avec l'aide d'un expert qui analyse votre marché et vos objectifs.",
            benefits: [
                "Analyse de votre positionnement",
                "Identification des canaux prioritaires",
                "Plan d'action concret"
            ],
            prefillText: "Je cherche à définir ma stratégie marketing digital pour 2024."
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Optimiser mes process",
            duration: "1h",
            price: "290€ HT",
            description: "Identifiez et éliminez les inefficacités dans vos processus avec l'aide d'un expert en optimisation opérationnelle.",
            benefits: [
                "Cartographie des processus",
                "Identification des points de friction",
                "Recommandations d'amélioration"
            ],
            prefillText: "Je veux optimiser les processus internes de mon entreprise."
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Audit sécurité",
            duration: "2h",
            price: "490€ HT",
            description: "Évaluez la sécurité de votre infrastructure IT et identifiez les points d'amélioration avec un expert en cybersécurité.",
            benefits: [
                "Analyse des vulnérabilités",
                "Évaluation des risques",
                "Plan d'action prioritaire"
            ],
            prefillText: "J'aimerais faire un audit de sécurité de mon infrastructure IT."
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            title: "Planifier ma levée de fonds",
            duration: "1h30",
            price: "390€ HT",
            description: "Préparez votre levée de fonds avec un expert qui vous aide à structurer votre approche et maximiser vos chances de succès.",
            benefits: [
                "Évaluation de votre maturité",
                "Stratégie de pitch",
                "Planning détaillé"
            ],
            prefillText: "Je prépare une levée de fonds et j'ai besoin de conseils stratégiques."
        },
        {
            icon: <MessageSquare className="h-6 w-6" />,
            title: "Améliorer mes ventes",
            duration: "1h",
            price: "290€ HT",
            description: "Boostez vos performances commerciales avec un expert qui analyse votre processus de vente et identifie les leviers de croissance.",
            benefits: [
                "Audit du tunnel de vente",
                "Optimisation du closing",
                "Techniques d'acquisition"
            ],
            prefillText: "Je cherche à améliorer la performance de mon équipe commerciale."
        },
        {
            icon: <FileText className="h-6 w-6" />,
            title: "Rédiger mon business plan",
            duration: "2h",
            price: "490€ HT",
            description: "Structurez votre business plan avec l'aide d'un expert qui vous guide dans la construction d'un document convaincant.",
            benefits: [
                "Structure personnalisée",
                "Analyse financière",
                "Storytelling impactant"
            ],
            prefillText: "J'ai besoin d'aide pour structurer mon business plan."
        },
        {
            icon: <Briefcase className="h-6 w-6" />,
            title: "Développer à l'international",
            duration: "1h30",
            price: "390€ HT",
            description: "Planifiez votre expansion internationale avec un expert qui vous aide à identifier les opportunités et éviter les pièges.",
            benefits: [
                "Analyse des marchés cibles",
                "Stratégie d'entrée",
                "Plan de déploiement"
            ],
            prefillText: "Je souhaite développer mon entreprise à l'international."
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
            content: "Bonjour ! Je suis l'assistant virtuel de Sparkier. Mon rôle est de vous aider à clarifier votre besoin avant de vous mettre en relation avec l'expert le plus pertinent. Plus je comprends précisément votre situation, plus nous pourrons vous proposer des solutions adaptées. Pouvez-vous me parler de votre projet ?"
        },
        systemPrompt: `You are Sparkier Consulting's AI assistant.
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
        title: "Assistant Sparkier",
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

    const howItWorks = [
        {
            icon: <MessageSquare className="h-6 w-6" />,
            title: "Choisissez votre Spark",
            description: "Sélectionnez le module qui correspond à votre problématique."
        },
        {
            icon: <Bot className="h-6 w-6" />,
            title: "Précisez votre contexte",
            description: "Notre IA vous aide à structurer votre demande pour optimiser la session."
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Échangez avec votre Expert",
            description: "Discutez en direct avec le consultant pour obtenir des réponses concrètes."
        },
        {
            icon: <FileText className="h-6 w-6" />,
            title: "Recevez votre Rapport",
            description: "Recevez un rapport détaillé prêt à partager avec vos équipes."
        }
    ];

    const features = [
        {
            title: "Format structuré ",
            description: "Un concentré de conseil pour répondre à une problématique précise, sans engagement et sans perte de temps.",
            icon: <Zap className="h-6 w-6" />
        },
        {
            title: "Tarif défini",
            description: "Pas de surprise, le tarif est annoncé avant le début de la session.",
            icon: <Briefcase className="h-6 w-6" />
        },
        {
            title: "Qualité garantie",
            description: "Chaque consultant est limité à 10 Sparks maximum, assurant une expertise pointue sur chaque sujet proposé.",
            icon: <Shield className="h-6 w-6" />
        },
        {
            title: "Gestion simplifiée",
            description: "Pas de temps masqué ni de gestion commerciale complexe. Réservez votre session et commencez immédiatement.",
            icon: <Calendar className="h-6 w-6" />
        }
    ];

    const about_content = [
        {
            title: "Sparkier encadre la prestation",
            description: "Sparkier va au-delà de la mise en relation, et structure les prestations proposées par nos consultants pour en garantir la pertinence et la qualité. Nos experts ne peuvent proposer que 10 Spark chacun au maximum, ce qui les force à ne proposer des prestations sur lesquelles ils sont réellement experts.",
            icon: <Shield className="h-6 w-6" />
        },
        {
            title: "Sparkier vous épargne la gestion de la relation commerciale",
            description: "Pas de temps masqué. Sélectionnez un Spark, détaillez votre contexte et réservez la session. La mission commence et s'arrête avec votre rendez-vous.",
            icon: <Calendar className="h-6 w-6" />
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
                            Découvrez le Spark
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto">
                            Un concentré de conseil : 30 min à 2h avec un expert.
                        </p>

                        {/* Use Case Form Section */}
                        <div className="max-w-4xl mx-auto">
                            <div className={`${showForm ? 'block' : 'hidden'}`}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                                    {expertCalls.map((call, index) => (
                                        <motion.div
                                            key={index}
                                            layout
                                            variants={fadeInUp}
                                            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                                                ${expandedCallIndex === index ? 'md:col-span-2 md:row-span-3' : ''}`}
                                            onClick={() => {
                                                if (expandedCallIndex === index) {
                                                    return;
                                                }
                                                setExpandedCallIndex(expandedCallIndex === index ? null : index);
                                            }}
                                        >
                                            <div className="p-4 h-full flex flex-col">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="p-1.5 bg-blue-50 rounded-lg w-fit">
                                                        <Sparkle className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-gray-900 text-left">
                                                        {call.title}
                                                    </h3>
                                                </div>

                                                {expandedCallIndex === index ? (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex flex-col flex-grow"
                                                    >
                                                        <p className="text-gray-600 text-sm mb-4 text-left">
                                                            {call.description}
                                                        </p>

                                                        <div className="space-y-4 mb-4">
                                                            <div className="flex items-center gap-2 text-gray-900 text-left">
                                                                <Clock className="h-4 w-4 text-blue-600" />
                                                                <span className="text-sm">{call.duration}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-900 text-left">
                                                                <BadgeCheck className="h-4 w-4 text-blue-600" />
                                                                <span className="text-sm">{call.price}</span>
                                                            </div>
                                                        </div>

                                                        {call.benefits && (
                                                            <div className="space-y-2 mb-6">
                                                                {call.benefits.map((benefit, i) => (
                                                                    <div key={i} className="flex items-start gap-2 text-left">
                                                                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                        <span className="text-sm text-gray-600">{benefit}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUseCaseClick(call.prefillText);
                                                                setExpandedCallIndex(null);
                                                            }}
                                                            className="mt-auto w-full bg-blue-600 text-white px-4 py-2 rounded-lg 
                                                                     font-semibold hover:bg-blue-700 transition-colors flex items-center 
                                                                     justify-center gap-2"
                                                        >
                                                            Choisir ce Spark
                                                            <ArrowRight className="h-4 w-4" />
                                                        </button>
                                                    </motion.div>
                                                ) : (
                                                    <div className="flex flex-col flex-grow">
                                                        <div className="mt-auto flex items-center justify-end text-sm text-left">
                                                            <div className="flex items-center gap-1 text-blue-600 mr-2">
                                                                <Clock className="h-4 w-4 ml-auto" />
                                                                <span className="w-[15px]">{call.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-6 text-center flex flex-col items-center gap-4">
                                    <div className="inline-flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                                        <Plus className="h-4 w-4" />
                                        <span className="text-sm">Et bien d'autres possibilités selon vos besoins</span>
                                    </div>

                                    <div className="relative w-full max-w-md flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Décrivez votre problématique..."
                                                className="w-full px-4 py-3 pl-10 bg-white rounded-lg border border-gray-200 
                                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                         transition-all shadow-sm"
                                            />
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <svg
                                                    className="h-5 w-5 text-gray-400"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <button
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                                       transition-colors duration-200 flex items-center justify-center
                                                       shadow-sm"
                                            onClick={() => {
                                                // Add search functionality here
                                                console.log('Search query:', searchQuery);
                                            }}
                                        >
                                            Rechercher
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Interface */}
                            <div className={`slide-down-enter slide-down-enter-active ${showChat && !showConnect ? 'block' : 'hidden'}`}>
                                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Sparkle className="h-5 w-5 text-blue-600" />
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

                    {/* Service Packages Section - Replace with Features Section */}
                    <motion.div
                        id="spark"
                        className="mb-24"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Le Spark: un concentré de conseil
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                Une décision importante à prendre ? Un problème à régler ? Besoin de visibilité sur un sujet complexe ?
                                Chaque module Spark vous permet de répondre à une problématique précise.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-md"
                                >
                                    <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                                        {React.cloneElement(feature.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* How it Works Section */}
                    <motion.div
                        id="how-it-works"
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
                        id="why-sparkier"
                        className="mb-24"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Pourquoi Sparkier ?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Une nouvelle approche du conseil, simple et efficace
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {about_content.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-md"
                                >
                                    <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                                        {React.cloneElement(item.icon as React.ReactElement, {
                                            className: "h-6 w-6 text-blue-600"
                                        })}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>
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

            <div className="hidden">
                <textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Décrivez votre problématique..."
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={4}
                />
                <button
                    onClick={(e) => handleSubmit(e, problem)}
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                    Commencer
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}