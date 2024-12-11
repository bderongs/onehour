import React, { useState } from 'react';
import { ArrowRight, Bot, Users, Package2, Plus, Clock, Briefcase, Target, CheckCircle, MessageSquare, Calendar, Zap, ArrowRightCircle, Star, Quote } from 'lucide-react';
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
    const [showForm, setShowForm] = useState(true); // Ensure UseCaseForm is shown initially
    const [messages, setMessages] = useState<Message[]>([]);

    const useCases: UseCase[] = [
        {
            icon: <Package2 className="h-6 w-6" />,
            title: "Choisir un Logiciel",
            description: "Quels logiciels pour mon entreprise ?",
            prefillText: "Je cherche à choisir un logiciel pour mon entreprise. J'ai besoin d'aide pour comparer les solutions du marché et identifier celle qui correspond le mieux à mes besoins spécifiques."
        },
        {
            icon: <Bot className="h-6 w-6" />,
            title: "IA & Entreprise",
            description: "Comment l'IA peut m'aider ?",
            prefillText: "Je souhaite comprendre comment l'intelligence artificielle pourrait être utile dans mon entreprise. J'aimerais identifier les opportunités concrètes d'application et les bénéfices potentiels."
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Recrutement",
            description: "Évaluer des candidats",
            prefillText: "Je dois recruter des profils techniques et j'ai besoin d'un expert pour m'aider à évaluer les compétences des candidats lors des entretiens."
        },
        {
            icon: <Plus className="h-6 w-6" />,
            title: "Autre Sujet",
            description: "J'ai une autre problématique",
            prefillText: ""
        }
    ];

    const handleUseCaseClick = (prefillText: string) => {
        setProblem(prefillText);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowChat(true);
        setShowForm(false); // Hide UseCaseForm when chat is shown
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleConnect = () => {
        setShowConnect(true);
        setShowChat(false); // Hide AIChatInterface when ConsultantConnect is shown
    };

    const handleBack = () => {
        setShowConnect(false);
        setShowChat(true); // Show AIChatInterface when going back from ConsultantConnect
    };

    const handleMessagesUpdate = (newMessages: Message[]) => {
        setMessages(newMessages);
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
            description: "Concentrez-vous sur l'échange, notre IA prend les notes"
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
            initials: "JD"
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

    return (
        <div className="bg-gradient-to-b from-white to-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Le concentré de conseil expert
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-gray-600">
                            Décrivez votre problème et programmez une session de micro-consulting pour le résoudre.
                        </p>

                        {/* Pricing Section */}
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Tarification Transparente
                            </h2>
                            <p className="text-2xl text-gray-700">
                                Une session de conseil = <span className="font-semibold text-blue-600">150€</span>
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto">
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
                            <div className={`${showChat ? 'block' : 'hidden'}`}>
                                <AIChatInterface
                                    initialProblem={problem}
                                    onConnect={handleConnect}
                                    messages={messages}
                                    onMessagesUpdate={handleMessagesUpdate}
                                />
                            </div>
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
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Pourquoi OneHourAdvice ?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Obtenez les conseils dont vous avez besoin, quand vous en avez besoin
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyChoose.map((reason, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
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

            {/* How it Works Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Comment ça Marche ?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Un processus simple en quatre étapes pour obtenir les conseils dont vous avez besoin
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
                        {howItWorks.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="text-center">
                                    <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                                        {React.cloneElement(step.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                                {index < howItWorks.length - 1 && (
                                    <ArrowRightCircle className="h-8 w-8 text-blue-600 hidden md:block" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Client Reviews Section - Temporarily hidden
            <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Ils Nous Font Confiance
                        </h2>
                        <p className="text-xl text-gray-600">
                            Plus de 100 entreprises conseillées avec succès
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {clientReviews.map((review, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all relative"
                            >
                                <Quote className="absolute top-4 right-4 h-8 w-8 text-blue-100" />
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg mr-4">
                                        {review.initials}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
                                        <p className="text-sm text-gray-600">{review.role}</p>
                                        <p className="text-sm font-medium text-blue-600">{review.company}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-6 italic">"{review.review}"</p>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${
                                                i < review.rating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            */}
        </div>
    );
}