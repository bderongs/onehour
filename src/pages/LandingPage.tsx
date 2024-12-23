import React, { useState, useEffect } from 'react';
import { Bot, Users, Package2, Plus, Clock, Briefcase, Target, CheckCircle, MessageSquare, Calendar, Zap, ArrowRightCircle, Shield, Award, Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { ConsultantConnect } from '../components/ConsultantConnect';
import { UseCaseForm } from '../components/UseCaseForm';

interface UseCase {
    icon: React.ReactNode;
    title: string;
    description: string;
    prefillText: string;
}

export function LandingPage() {
    const navigate = useNavigate();
    const [problem, setProblem] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [showConnect, setShowConnect] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);

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
        setShowConnect(true);
        setShowChat(false);
    };

    const handleBack = () => {
        setShowConnect(false);
        setShowChat(true);
    };

    const handleMessagesUpdate = (newMessages: Message[]) => {
        setMessages(newMessages);
    };

    // Update chat config
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
        }

        Example in French:
        {
            "challenge": "Transformation digitale du service client",
            "currentSituation": "Processus manuel, temps de réponse long",
            "desiredOutcome": "Automatisation partielle, réduction des délais",
            "constraints": "Budget 50k€, déploiement sous 3 mois",
            "stakeholders": "Équipe support client, DSI",
            "previousAttempts": "Aucune tentative précédente",
            "readyForAssessment": true
        }

        Rules for readyForAssessment:
        - Set to true only when we have gathered sufficient information about:
          * Challenge (clear description)
          * Current situation
          * Desired outcome
          * At least some constraints
        - Set to false if any of these key elements are missing
        - Must be a boolean value, not a string

        If information is not available for a field, use a default value:
        - For previousAttempts: "Aucune tentative précédente"
        - For stakeholders: "À déterminer"
        - For constraints: "À définir"
        But continue gathering this information in the conversation.`
    };

    const whyChoose = [
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Efficace",
            description: "Une heure de conseil, une solution."
        },
        {
            icon: <Briefcase className="h-6 w-6" />,
            title: "Professionnel",
            description: "Des experts qualifiés à votre service."
        },
        {
            icon: <Target className="h-6 w-6" />,
            title: "Simple",
            description: "Un tarif unique, sans surprise."
        },
        {
            icon: <CheckCircle className="h-6 w-6" />,
            title: "Innovant",
            description: "Concentrez-vous sur l'échange, notre IA prend les notes."
        }
    ];

    const howItWorks = [
        {
            icon: <MessageSquare className="h-6 w-6" />,
            title: "Décrivez",
            description: "Expliquez votre problème en détail."
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            title: "Planifiez",
            description: "Choisissez un créneau pour votre session."
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Connectez",
            description: "Discutez avec un expert en direct."
        },
        {
            icon: <CheckCircle className="h-6 w-6" />,
            title: "Résolvez",
            description: "Obtenez des solutions concrètes."
        }
    ];

    const clientReviews = [
        {
            name: "Pascal Larue",
            role: "CTO",
            company: "TechCorp",
            review: "Service exceptionnel ! J'ai pu résoudre mon problème en une heure seulement. L'expert était très compétent et a parfaitement compris nos besoins.",
            rating: 5,
            initials: "PL"
        },
        {
            name: "Marie Curie",
            role: "Directrice Innovation",
            company: "ScienceLab",
            review: "Les experts sont très professionnels et à l'écoute. Je recommande vivement. La qualité des conseils a dépassé mes attentes.",
            rating: 4,
            initials: "MC"
        },
        {
            name: "Albert Einstein",
            role: "CEO",
            company: "FutureTech",
            review: "Une solution rapide et efficace. Très satisfait du service. L'accompagnement était personnalisé et pertinent.",
            rating: 5,
            initials: "AE"
        }
    ];

    const expertiseHighlights = [
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Experts Sélectionnés",
            description: "Nos consultants sont rigoureusement sélectionnés pour leur expertise pointue et leur expérience confirmée dans leur domaine."
        },
        {
            icon: <Award className="h-6 w-6" />,
            title: "Expertise Validée",
            description: "Minimum 10 ans d'expérience professionnelle, certifications reconnues et track record vérifié."
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Engagement Temps",
            description: "Nos experts s'engagent à fournir des conseils actionnables dans le temps imparti d'une heure."
        },
        {
            icon: <Star className="h-6 w-6" />,
            title: "Excellence Garantie",
            description: "Satisfaction client suivie et maintien d'une note minimale de 4.8/5 pour nos consultants."
        }
    ];

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="hero-section relative overflow-hidden">
                    <div className="absolute inset-0" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
                        <div className="text-center relative z-10">
                            <h1 className="mt-20 text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                                Le concentré de conseil expert
                            </h1>
                            <p className="text-xl md:text-2xl mb-12 text-gray-600">
                                Décrivez votre problème et programmez une session de micro-consulting avec l'un de nos experts.
                            </p>
                            <div className="max-w-7xl mx-auto">
                                {showForm && (
                                    <div className="max-w-4xl mx-auto">
                                        <UseCaseForm
                                            useCases={useCases}
                                            problem={problem}
                                            setProblem={setProblem}
                                            handleSubmit={handleSubmit}
                                            handleUseCaseClick={handleUseCaseClick}
                                            handleKeyDown={handleKeyDown}
                                        />
                                    </div>
                                )}
                                {showChat && !showConnect && (
                                    <AIChatInterface
                                        messages={messages}
                                        onMessagesUpdate={handleMessagesUpdate}
                                        config={chatConfig}
                                    />
                                )}
                                <div className={`${showConnect ? 'block' : 'hidden'}`}>
                                    <ConsultantConnect
                                        onBack={handleBack}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Section */}
                <div id="why-choose" className="why-choose-section py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Pourquoi OneHourAdvice ?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Obtenez les conseils dont vous avez besoin, quand vous en avez besoin.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {whyChoose.map((reason, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg"
                                >
                                    <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                                        {React.cloneElement(reason.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{reason.title}</h3>
                                    <p className="text-gray-600">{reason.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Experts Section */}
                <div id="experts" className="experts-section py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Des Experts de Confiance
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                            Nous sélectionnons moins de 5% des candidats consultants pour garantir
                            une expertise exceptionnelle et des conseils de haute qualité.
                            </p>                        
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {expertiseHighlights.map((highlight, index) => (
                                <div
                                    key={index}
                                    className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-lg"
                                >
                                    <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                                        {React.cloneElement(highlight.icon as React.ReactElement, {
                                            className: "h-6 w-6 text-blue-600"
                                        })}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-blue-900">
                                        {highlight.title}
                                    </h3>
                                    <p className="text-gray-700">
                                        {highlight.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-10/50 to-purple-10/50 border border-blue-100 backdrop-blur-sm">
                                <div className="text-4xl font-bold text-blue-700 mb-2">10+</div>
                                <div className="text-blue-900 font-medium">Années d'expérience minimum</div>
                            </div>
                            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-10/50 to-purple-10/50 border border-blue-100 backdrop-blur-sm">
                                <div className="text-4xl font-bold text-blue-700 mb-2">4.8/5</div>
                                <div className="text-blue-900 font-medium">Note moyenne des consultants</div>
                            </div>
                            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-10/50 to-purple-10/50 border border-blue-100 backdrop-blur-sm">
                                <div className="text-4xl font-bold text-blue-700 mb-2">95%</div>
                                <div className="text-blue-900 font-medium">Taux de satisfaction client</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How it Works Section */}
                <div id="how-it-works" className="how-it-works-section py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Comment ça Marche ?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Un processus simple en quatre étapes pour obtenir les conseils dont vous avez besoin.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {howItWorks.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-lg text-center"
                                >
                                    <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                                        {React.cloneElement(step.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}