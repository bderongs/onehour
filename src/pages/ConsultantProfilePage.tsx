import React, { useState } from 'react';
import { Clock, Briefcase, Target, CheckCircle, MessageSquare, Calendar, Zap, Shield, Award, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { ConsultantConnect } from '../components/ConsultantConnect';
import { HeaderSimple } from '../components/HeaderSimple';

export function ConsultantProfilePage() {
    const navigate = useNavigate();
    const [problem, setProblem] = useState('');
    const [showChat, setShowChat] = useState(true); // Ensure AIChatInterface is shown initially
    const [showConnect, setShowConnect] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowChat(true);
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <HeaderSimple />
            {/* Consultant Summary Section */}
            <div className="consultant-summary-section py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-lg grid md:grid-cols-3 gap-12 items-start">
                        <div className="md:col-span-1">
                            <img 
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" 
                                alt="Arnaud Lacaze"
                                className="rounded-full w-full max-w-[300px] mx-auto aspect-square object-cover"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                Arnaud Lacaze
                            </h2>
                            <p className="text-xl text-blue-600 mb-4">
                                Expert en Transformation Digitale & Innovation
                            </p>
                            <div className="prose prose-lg text-gray-600 mb-6">
                                <p>
                                    Avec plus de 15 ans d'expérience dans la transformation digitale et l'innovation, 
                                    Arnaud accompagne les entreprises dans leur évolution technologique et organisationnelle. 
                                    Ancien directeur de l'innovation chez Bouygues Telecom et consultant senior chez Accenture, 
                                    il a piloté de nombreux projets de transformation à grande échelle.
                                </p>
                                <p className="mt-4 font-semibold">
                                    Spécialisé dans :
                                </p>
                                <ul className="grid md:grid-cols-2 gap-2 mt-2">
                                    <li>Stratégie digitale</li>
                                    <li>Innovation produit</li>
                                    <li>Transformation organisationnelle</li>
                                    <li>Management de l'innovation</li>
                                    <li>Conduite du changement</li>
                                    <li>Agilité à l'échelle</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="hero-section relative overflow-hidden">
                <div className="absolute inset-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center relative z-10">
                        <h1 className="mt-20 text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                            Le concentré de conseil expert
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-gray-600">
                            Décrivez votre problème et programmez une session de micro-consulting avec l'un de nos experts.
                        </p>
                        <div className="max-w-7xl mx-auto">
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
    );
}