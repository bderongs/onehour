import React, { useState } from 'react';
import { CheckCircle, MessageSquare, Calendar, Zap, Shield, Award, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { ConsultantConnect } from '../components/ConsultantConnect';
import { LightFooter } from '../components/LightFooter';

export function ConsultantProfilePage() {
    const navigate = useNavigate();
    const [problem, setProblem] = useState('');
    const [showChat, setShowChat] = useState(true); // Ensure AIChatInterface is shown initially
    const [showConnect, setShowConnect] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    React.useEffect(() => {
        window.scrollTo(0, 0);
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

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

    const getNextWorkingDay = (date: Date) => {
        const day = date.getDay();
        const diff = day === 5 ? 3 : day === 6 ? 2 : 1; // If Friday, add 3 days; if Saturday, add 2 days; otherwise, add 1 day
        date.setDate(date.getDate() + diff);
        return date;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    const availabilities = [
        getNextWorkingDay(new Date()),
        getNextWorkingDay(new Date(new Date().setDate(new Date().getDate() + 1))),
        getNextWorkingDay(new Date(new Date().setDate(new Date().getDate() + 2)))
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
            name: "Pascal Dubois",
            role: "CTO",
            company: "TechCorp",
            review: "Service exceptionnel ! J'ai pu résoudre mon problème en une heure seulement. Miguel était très compétent et a parfaitement compris nos besoins.",
            rating: 5,
            initials: "PL",
            image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5"
        },
        {
            name: "Marie Jarry",
            role: "Directrice Innovation",
            company: "ScienceLab",
            review: "Miguel est très professionnel et à l'écoute. Je recommande vivement. La qualité des conseils a dépassé mes attentes.",
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

    const scrollToSection = (sectionId: string) => {
        // Only scroll if explicitly triggered by a user action, not on page load
        if (window.location.hash !== `#${sectionId}`) {  // Add this check
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Remove any hash from URL on page load
    React.useEffect(() => {
        if (window.location.hash) {
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex flex-col">
            {/* <HeaderSimple /> */}
            <main className="flex-grow">
                {/* Consultant Summary Section */}
                <div className="consultant-summary-section py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Parent div representing the white summary box */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-lg">
                            {/* Wrapped existing grid content */}
                            <div className="grid md:grid-cols-3 gap-12 items-start">
                                <div className="md:col-span-1 mt-4 space-y-6">
                                    <img
                                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                                        alt="Arnaud Lacaze"
                                        className="rounded-full w-full max-w-[300px] mx-auto aspect-square object-cover object-top"
                                    />
                                    <div className="grid grid-cols-2 gap-4 max-w-[300px] mx-auto">
                                        <div className="text-center p-3 bg-white/80 rounded-lg">
                                            <div className="font-bold text-blue-600">15+</div>
                                            <div className="text-sm text-gray-600">Années d'exp.</div>
                                        </div>
                                        <div className="text-center p-3 bg-white/80 rounded-lg">
                                            <div className="font-bold text-blue-600">20+</div>
                                            <div className="text-sm text-gray-600">Clients</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 mt-10">
                                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                        Arnaud Lacaze
                                    </h2>
                                    <p className="text-xl text-blue-600 mb-4">
                                        Expert en Transformation Digitale & Innovation
                                    </p>
                                    <div className="prose prose-lg text-gray-600 mb-6">
                                        <p>
                                            Avec plus de 15 ans d'expérience dans la transformation digitale et l'innovation,
                                            j'accompagne les entreprises dans leur évolution technologique et organisationnelle.
                                            Ancien directeur de l'innovation chez Bouygues Telecom et consultant senior chez Accenture,
                                            j'ai piloté de nombreux projets de transformation à grande échelle.
                                        </p>
                                        <p className="mt-4 font-semibold">
                                            Spécialisé dans :
                                        </p>
                                        <ul className="grid md:grid-cols-2 gap-2 mt-2">
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
                                </div>
                            </div>
                        </div>
                        {/* Section for Arnaud's next 3 availabilities */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-lg mt-12">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                                Prochaines Disponibilités
                            </h3>
                            <ul className="flex justify-between">
                                <div className="flex space-x-4">
                                    {availabilities.map((date, index) => (
                                        <li key={index} className="flex items-center p-4 bg-blue-50 rounded-lg">
                                            <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                                            <span className="text-gray-900 font-medium">{formatDate(date)}</span>
                                        </li>
                                    ))}
                                </div>
                                <li className="flex items-center p-4 bg-blue-600 text-white rounded-lg cursor-pointer">
                                    <span className="font-medium">Prendre RDV</span>
                                </li>
                            </ul>
                        </div>
                        {/* Separate white box for request bloc */}
                        <div id="request-bloc" className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-lg mt-12">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                                Me soumettre une nouvelle demande
                            </h3>
                            <div id="ai-chat-interface" className={`${showChat ? 'block' : 'hidden'}`}>
                                <AIChatInterface
                                    initialProblem={problem}
                                    onConnect={handleConnect}
                                    messages={messages}
                                    onMessagesUpdate={handleMessagesUpdate}
                                />
                            </div>
                            <div id="consultant-connect" className={`${showConnect ? 'block' : 'hidden'}`}>
                                <ConsultantConnect
                                    onBack={handleBack}
                                />
                            </div>
                        </div>
                        {/* Separate white box for client references */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-lg mt-12">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                                Références Clients
                            </h3>
                            <ul className="space-y-4">
                                {clientReviews.map((review, index) => (
                                    <li key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
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
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* How it Works Section */}
                <div id="how-it-works" className="how-it-works-section py-12">
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
            </main>
            <LightFooter />
        </div>
    );
}