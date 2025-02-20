'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Bot, Users, Briefcase, MessageSquare, Calendar, Zap, Shield, Sparkles, ArrowRight, FileText } from 'lucide-react'
import { AIChatInterface } from '@/components/AIChatInterface'
import { ConsultantConnect } from '@/components/ConsultantConnect'
import { motion } from 'framer-motion'
import { SparksGrid } from '@/components/SparksGrid'
import { getSparks } from '@/services/sparks'
import type { Spark } from '@/types/spark'
import { DOCUMENT_TEMPLATES } from '@/data/documentTemplates'
import { createChatConfigs } from '@/data/chatConfigs'
import type { DocumentSummary } from '@/types/chat'
import '@/styles/highlight.css'
import { ClientSignUpForm } from '@/components/ClientSignUpForm'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { Message } from '@/types/chat'

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
}

export default function LandingClients() {
    const [showConnect, setShowConnect] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [shouldReset, setShouldReset] = useState(false)
    const [sparks, setSparks] = useState<Spark[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [documentSummary, setDocumentSummary] = useState<DocumentSummary>({
        challenge: '',
        currentSituation: '',
        desiredOutcome: '',
        constraints: '',
        stakeholders: '',
        previousAttempts: '',
        hasEnoughData: false
    })
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(null)
    const [isChatExpanded, setIsChatExpanded] = useState(false)

    // Memoize chat configs to prevent unnecessary recreations
    const chatConfigs = useMemo(() => createChatConfigs(), [])

    useEffect(() => {
        const fetchSparks = async () => {
            try {
                const fetchedSparks = await getSparks()
                setSparks(fetchedSparks)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching sparks:', err)
                setError('Impossible de charger les sparks. Veuillez réessayer plus tard.')
                setLoading(false)
            }
        }

        fetchSparks()
    }, [])

    useEffect(() => {
        if (shouldReset) {
            setShouldReset(false)
        }
    }, [shouldReset])

  useEffect(() => {
        // Always set the first Spark (index 0) to be expanded on load
        if (expandedCallIndex === null) {
            setExpandedCallIndex(0)
        }
  }, [])

    const handleUseCaseClick = (prefillText: string) => {
        if (prefillText.trim()) {
            const initialMessages: Message[] = [{
                role: 'user',
                content: prefillText.trim()
            }]
            setMessages(initialMessages)
            setShowConnect(false)
            setIsChatExpanded(true)
        }
    }

    const handleConnect = () => {
        // Scroll to the sign-up form with smooth behavior
        const element = document.getElementById('signup-form')
        if (element) {
            const headerOffset = 120
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    const handleBack = (shouldReset?: boolean) => {
        if (shouldReset) {
            // Reset to initial state
            setShowConnect(false)
            setMessages([])
            setShouldReset(true)
            setDocumentSummary({
                challenge: '',
                currentSituation: '',
                desiredOutcome: '',
                constraints: '',
                stakeholders: '',
                previousAttempts: '',
                hasEnoughData: false
            })
            setIsChatExpanded(false)
            setExpandedCallIndex(0)
        } else {
            // Just go back to chat interface while preserving all state
            setShowConnect(false)
        }
    }

    const handleMessagesUpdate = (newMessages: Message[]) => {
        setMessages(newMessages)
        for (let i = newMessages.length - 1; i >= 0; i--) {
            const msg = newMessages[i]
            if (msg.role === 'assistant' && msg.summary) {
                // Check if the summary is a DocumentSummary by checking for hasEnoughData property
                if ('hasEnoughData' in msg.summary) {
                    setDocumentSummary(msg.summary as DocumentSummary)
                }
                break
            }
        }
    }

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
            description: "Travaillez en direct avec le consultant pour obtenir des réponses concrètes."
        },
        {
            icon: <FileText className="h-6 w-6" />,
            title: "Recevez votre Rapport",
            description: "Recevez un rapport détaillé prêt à partager avec vos équipes."
        }
    ]

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
    ]

    const about_content = [
        {
            title: "Sparkier encadre la prestation",
            description: "Sparkier va au-delà de la mise en relation, et structure les prestations proposées par nos consultants pour en garantir la pertinence et la qualité. Nos experts ne peuvent proposer que 10 Sparks chacun au maximum, ce qui les force à ne proposer des prestations sur lesquelles ils sont réellement experts.",
            icon: <Shield className="h-6 w-6" />
        },
        {
            title: "Sparkier vous épargne la gestion de la relation commerciale",
            description: "Pas de temps masqué. Sélectionnez un Spark, détaillez votre contexte et réservez la session. La mission commence et s'arrête avec votre rendez-vous.",
            icon: <Calendar className="h-6 w-6" />
        }
    ]

    if (loading) {
        return <LoadingSpinner message="Chargement..." />
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
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
                                <LoadingSpinner message="Chargement des Sparks..." />
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
                                    {showConnect ? (
                                        <ConsultantConnect
                                            onBack={handleBack}
                                            documentSummary={documentSummary}
                                            template={DOCUMENT_TEMPLATES[0]}
                                            confirmationMessage="Confirmation de la demande"
                                            submitMessage="Envoyer la demande"
                                            messages={messages}
                                        />
                                    ) : (
                                        <AIChatInterface
                                            messages={messages}
                                            onMessagesUpdate={handleMessagesUpdate}
                                            onConnect={() => setShowConnect(true)}
                                            chatConfig={chatConfigs.default}
                                            documentTemplate={DOCUMENT_TEMPLATES[0]}
                                            shouldReset={shouldReset}
                                        />
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* How it Works Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-12">Comment ça marche ?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {howItWorks.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    className="bg-white p-6 rounded-xl shadow-md"
                                    {...fadeInUp}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100 text-blue-600 mx-auto">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-12">Pourquoi choisir Sparkier ?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    className="bg-white p-6 rounded-xl shadow-md"
                                    {...fadeInUp}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100 text-blue-600 mx-auto">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-12">Pourquoi nous faire confiance ?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {about_content.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    className="bg-white p-6 rounded-xl shadow-md"
                                    {...fadeInUp}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100 text-blue-600 mx-auto">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sign Up Form */}
                    <div id="signup-form" className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Commencez maintenant !
                            </h2>
                            <p className="text-gray-600">
                                Créez votre compte et trouvez l'expert qu'il vous faut
                            </p>
                        </div>

                        <ClientSignUpForm 
                            className="bg-white p-8 rounded-xl shadow-md"
                            onSuccess={handleConnect}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    )
} 