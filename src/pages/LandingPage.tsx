import React, { useState } from 'react';
import { ArrowRight, Bot, Users, Package2, Plus, Clock, Briefcase, Target, CheckCircle, MessageSquare, Calendar, Zap, ArrowRightCircle, Shield, Award, Star, Quote } from 'lucide-react';
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
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            {/* Hero Section */}
            <div className="hero-section relative overflow-hidden bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="absolute inset-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center relative z-10">
                        <h1 className="mt-20 text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Le concentré de conseil expert
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-gray-600">
                            Décrivez votre problème et programmez une session de micro-consulting avec l'un de nos experts.
                        </p>
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
            <div id="why-choose" className="why-choose-section py-24">
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

            {/* Experts Section */}
            <div id="experts" className="experts-section py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Des Experts de Confiance
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Une sélection rigoureuse des meilleurs consultants pour votre réussite
                        </p>
                        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-12 border border-blue-100">
                            <Quote className="h-8 w-8 text-blue-500 mb-4 mx-auto opacity-50" />
                            <p className="text-blue-900 text-lg font-medium">
                                "Nous sélectionnons moins de 5% des candidats consultants pour garantir
                                une expertise exceptionnelle et des conseils de haute qualité."
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {expertiseHighlights.map((highlight, index) => (
                            <div
                                key={index}
                                className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
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
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Comment ça Marche ?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Un processus simple en quatre étapes pour obtenir les conseils dont vous avez besoin
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step, index) => (
                            <div
                                key={index}
                                className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center"
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

            {/* Pricing Section */}
            <div id="pricing" className="pricing-section py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Nos Tarifs
                        </h2>
                        <p className="text-xl text-gray-600">
                            Choisissez la formule qui vous convient le mieux. Nos prix sont fixes pour éviter les maux de tête et nous sélectionnons les meilleurs consultants pour vous.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">30 minutes</h3>
                            <p className="text-2xl font-bold text-blue-600">150€</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">1 heure</h3>
                            <p className="text-2xl font-bold text-blue-600">250€</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">2 heures</h3>
                            <p className="text-2xl font-bold text-blue-600">400€</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">Missions longues</h3>
                            <p className="text-2xl font-bold text-blue-600">Sur devis</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}