import React, { useState, useEffect, useMemo } from 'react';
import { Bot, Users, Briefcase, MessageSquare, Calendar, Zap, Shield, Sparkles, ArrowRight, FileText} from 'lucide-react';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { ConsultantConnect } from '../components/ConsultantConnect';
import { motion } from 'framer-motion';
import { SparksGrid } from '../components/SparksGrid';
import { getSparks } from '../services/sparks';
import type { Spark } from '../types/spark';
import { DOCUMENT_TEMPLATES } from '../data/documentTemplates';
import { createChatConfigs } from '../data/chatConfigs';
import type { DocumentSummary } from '../types/chat';
import { signUpClientWithEmail, type ClientSignUpData } from '../services/auth';
import { Notification } from '../components/Notification';
import '../styles/highlight.css';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function LandingClients() {
    const [problem, setProblem] = useState('');
    const [showConnect, setShowConnect] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [shouldReset, setShouldReset] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ClientSignUpData>({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        companyRole: '',
        industry: ''
    });
    const [documentSummary, setDocumentSummary] = useState<DocumentSummary>({
        challenge: '',
        currentSituation: '',
        desiredOutcome: '',
        constraints: '',
        stakeholders: '',
        previousAttempts: '',
        hasEnoughData: false
    });
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(null);
    const [isChatExpanded, setIsChatExpanded] = useState(false);

    // Memoize chat configs to prevent unnecessary recreations
    const chatConfigs = useMemo(() => createChatConfigs(), []);

    useEffect(() => {
        const fetchSparks = async () => {
            try {
                const fetchedSparks = await getSparks();
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

    useEffect(() => {
        if (shouldReset) {
            setShouldReset(false);
        }
    }, [shouldReset]);

    useEffect(() => {
        // Always set the first Spark (index 0) to be expanded on load
        if (expandedCallIndex === null) {
            setExpandedCallIndex(0);
        }
    }, []);

    const handleUseCaseClick = (prefillText: string) => {
        setProblem(prefillText);
        if (prefillText.trim()) {
            const initialMessages: Message[] = [{
                role: 'user',
                content: prefillText.trim()
            }];
            setMessages(initialMessages);
            setShowConnect(false);
            setIsChatExpanded(true);
        }
    };

    const handleSubmit = (e: React.FormEvent, message: string) => {
        e.preventDefault();
        if (message.trim()) {
            const initialMessages: Message[] = [{
                role: 'user',
                content: message.trim()
            }];
            setMessages(initialMessages);
            setShowConnect(false);
            setIsChatExpanded(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e, problem);
        }
    };

    const handleConnect = () => {
        // Scroll to the sign-up form with smooth behavior
        const element = document.getElementById('signup-form');
        if (element) {
            const headerOffset = 120;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleBack = (shouldReset?: boolean) => {
        if (shouldReset) {
            // Reset to initial state
            setShowConnect(false);
            setMessages([]);
            setShouldReset(true);
            setDocumentSummary({
                challenge: '',
                currentSituation: '',
                desiredOutcome: '',
                constraints: '',
                stakeholders: '',
                previousAttempts: '',
                hasEnoughData: false
            });
            setProblem('');
            setIsChatExpanded(false);
            setExpandedCallIndex(0);
        } else {
            // Just go back to chat interface while preserving all state
            setShowConnect(false);
        }
    };

    const handleMessagesUpdate = (newMessages: Message[]) => {
        setMessages(newMessages);
        for (let i = newMessages.length - 1; i >= 0; i--) {
            const msg = newMessages[i];
            if (msg.role === 'assistant' && msg.summary) {
                // Check if the summary is a DocumentSummary by checking for hasEnoughData property
                if ('hasEnoughData' in msg.summary) {
                    setDocumentSummary(msg.summary as DocumentSummary);
                }
                break;
            }
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signUpClientWithEmail(formData);
            setFormData({
                firstName: '',
                lastName: '',
                company: '',
                email: '',
                companyRole: '',
                industry: ''
            });
            setNotification({
                type: 'success',
                message: 'Inscription réussie ! Veuillez vérifier votre email pour finaliser votre inscription.'
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setNotification({
                type: 'error',
                message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
            });
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                        Boostez votre activité avec les <span className="highlight">Sparks</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto">
                        Les Sparks allient <span className="highlight">IA</span> et <span className="highlight">experts métiers</span> pour mettre l'expertise du monde entier au service de votre réussite.
                    </p>

                    {/* Use Case Form Section */}
                    <div className="mb-12 sm:mb-16">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading sparks...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600">{error}</p>
                            </div>
                        ) : (
                            <SparksGrid
                                sparks={sparks.filter(spark => !spark.consultant && spark.consultant !== undefined)}
                                expandedCallIndex={expandedCallIndex}
                                setExpandedCallIndex={setExpandedCallIndex}
                                onCallClick={handleUseCaseClick}
                                buttonText="Choisir ce Spark"
                            />
                        )}

                        <div className="mt-6 text-center flex flex-col items-center gap-4">
                            <div className="w-full max-w-6xl">
                                <motion.div
                                    className="bg-white rounded-xl shadow-md overflow-hidden text-sm"
                                    animate={{ height: isChatExpanded ? 'auto' : 'auto' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex items-center gap-2 text-left">
                                            <Sparkles className="h-4 w-4 text-blue-600" />
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Rechercher un Spark
                                            </h2>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 text-left">
                                            Notre assistant IA vous aide à trouver le Spark qu'il vous faut
                                        </p>
                                    </div>

                                    {!isChatExpanded ? (
                                        <div
                                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsChatExpanded(true)}
                                        >
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Décrivez votre problématique..."
                                                    className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200 
                                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                            transition-all cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setIsChatExpanded(true);
                                                    }}
                                                    readOnly
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <motion.div
                                            className="p-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="relative">
                                                {/* Chat Interface - Always rendered but conditionally visible */}
                                                <div className={`${!showConnect ? 'block' : 'hidden'}`}>
                                                    <AIChatInterface
                                                        messages={messages}
                                                        onMessagesUpdate={handleMessagesUpdate}
                                                        template={DOCUMENT_TEMPLATES.spark_finder}
                                                        systemPrompt={chatConfigs.spark_finder.systemPrompt}
                                                        summaryInstructions={chatConfigs.spark_finder.summaryInstructions}
                                                        onConnect={handleConnect}
                                                        shouldReset={shouldReset}
                                                    />
                                                </div>

                                                {/* Consultant Connect - Always rendered but conditionally visible */}
                                                <div className={`${showConnect ? 'block' : 'hidden'}`}>
                                                    <ConsultantConnect
                                                        onBack={handleBack}
                                                        documentSummary={documentSummary}
                                                        template={DOCUMENT_TEMPLATES.consultant_qualification}
                                                        confirmationMessage={chatConfigs.consultant_qualification.confirmationMessage}
                                                        submitMessage={chatConfigs.consultant_qualification.submitMessage}
                                                        messages={messages}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
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
                            Le <span className="highlight">Spark</span>: un concentré de conseil
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
                                className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-md text-center"
                            >
                                <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
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
                            Comment ça <span className="highlight">marche</span> ?
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
                            Pourquoi <span className="highlight">Sparkier</span> ?
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

                {/* CTA Section with Sign Up Form */}
                <motion.div
                    id="signup-form"
                    className="max-w-2xl mx-auto px-3 sm:px-0"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Prêt à <span className="highlight">commencer</span> ?
                        </h2>
                        <p className="text-gray-600">
                            Créez votre compte et trouvez l'expert qu'il vous faut
                        </p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Votre prénom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Votre nom"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Entreprise
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nom de votre entreprise"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email professionnel
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="vous@entreprise.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fonction
                                </label>
                                <input
                                    type="text"
                                    name="companyRole"
                                    value={formData.companyRole}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Votre fonction dans l'entreprise"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Secteur d'activité
                                </label>
                                <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleFormChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Sélectionnez votre secteur</option>
                                    <option value="tech">Technologies</option>
                                    <option value="finance">Finance</option>
                                    <option value="retail">Commerce & Distribution</option>
                                    <option value="manufacturing">Industrie</option>
                                    <option value="services">Services</option>
                                    <option value="healthcare">Santé</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
                            >
                                Créer mon compte
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-gray-500 text-center">
                            En créant votre compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                        </p>
                    </form>
                </motion.div>

                {/* Connect Form */}
                {showConnect && (
                    <div className="max-w-4xl mx-auto px-4 mb-8">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <ConsultantConnect 
                                onBack={handleBack}
                                documentSummary={documentSummary}
                                template={DOCUMENT_TEMPLATES.spark_finder}
                                confirmationMessage={chatConfigs.spark_finder.confirmationMessage}
                                submitMessage={chatConfigs.spark_finder.submitMessage}
                                messages={messages}
                            />
                        </div>
                    </div>
                )}
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
                html {
                    scroll-padding-top: 80px; /* Add padding for fixed header */
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