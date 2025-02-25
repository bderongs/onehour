'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, ArrowLeft, Sparkles } from 'lucide-react'
import type { Spark } from '@/types/spark'
import { AIChatInterface, Message } from '@/components/AIChatInterface'
import { DOCUMENT_TEMPLATES } from '@/data/documentTemplates'
import { createChatConfigs } from '@/data/chatConfigs'
import { formatDuration, formatPrice } from '@/utils/format'
import { generateSparkCreatePrompt, generateSparkEditPrompt } from '@/services/promptGenerators'
import { editSparkWithAI } from '@/services/openai'
import { createSpark, updateSpark } from '@/services/sparks'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import logger from '@/utils/logger'

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
}

// Preview section component
const SparkPreviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.section className="bg-white rounded-xl shadow-md p-4 sm:p-6" variants={fadeInUp}>
        <h2 className="text-lg lg:text-xl font-semibold mb-4">{title}</h2>
        {children}
    </motion.section>
)

// Custom hook for AI interaction
const useSparkAI = (mode: 'create' | 'edit', initialSpark: Omit<Spark, 'id'>) => {
    const [spark, setSpark] = useState<Omit<Spark, 'id'>>(initialSpark)
    
    // Memoize chat configs to prevent unnecessary recreations
    const chatConfigs = useMemo(() => createChatConfigs(), [])
    const chatConfig = useMemo(
        () => mode === 'create' ? chatConfigs.spark_content_creator : chatConfigs.spark_content_editor,
        [mode, chatConfigs]
    )
    
    const [messages, setMessages] = useState<Message[]>([chatConfig.initialMessage])

    // Update spark when initialSpark changes
    useEffect(() => {
        setSpark(initialSpark)
    }, [initialSpark])

    // Update spark when userId changes
    useEffect(() => {
        if (initialSpark.consultant) {
            setSpark(prev => ({ ...prev, consultant: initialSpark.consultant }))
        }
    }, [initialSpark.consultant])

    const handleMessagesUpdate = async (newMessages: Message[]) => {
        const lastUserMessage = [...newMessages].reverse().find(m => m.role === 'user')
        if (!lastUserMessage) return

        setMessages(newMessages)
        setMessages(prev => [...prev, { role: 'assistant', content: '⋯', isLoading: true }])

        try {
            const systemPrompt = mode === 'create' 
                ? generateSparkCreatePrompt(spark as Spark)
                : generateSparkEditPrompt(spark as Spark)

            const aiMessages: { role: 'user' | 'assistant' | 'system'; content: string; }[] = [
                { role: 'system', content: systemPrompt },
                ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
            ]

            const response = await editSparkWithAI(aiMessages)

            // Create updated messages before updating the spark state
            const updatedMessages: Message[] = [
                ...newMessages,
                { role: 'assistant', content: response.reply, summary: response.document }
            ]

            // Process the document updates
            const documentUpdates = response.document as Partial<Spark>

            // Create the updated spark state by only applying defined fields
            const updatedSpark = {
                ...spark,
                ...Object.fromEntries(
                    Object.entries(documentUpdates)
                        .filter(([_, value]) => value !== undefined)
                )
            }

            // Update state
            setMessages(updatedMessages)
            setSpark(updatedSpark)
        } catch (error) {
            logger.error('Error getting AI response:', error)
            setMessages([
                ...newMessages,
                { role: 'assistant', content: "Je suis désolé, mais j'ai des difficultés à me connecter. Veuillez réessayer." }
            ])
        }
    }

    return { spark, messages, handleMessagesUpdate, chatConfig }
}

interface SparkAIEditorProps {
    mode: 'create' | 'edit'
    initialSpark: Omit<Spark, 'id'>
    sparkUrl?: string
    pageTitle: string
}

export default function SparkAIEditor({ mode, initialSpark, sparkUrl, pageTitle }: SparkAIEditorProps) {
    const router = useRouter()
    const { user } = useAuth()
    const userId = user?.id ?? null
    const isAdmin = user?.roles?.includes('admin') ?? false
    
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const { spark, messages, handleMessagesUpdate, chatConfig } = useSparkAI(mode, initialSpark)

    const handleSave = async () => {
        if (!userId) {
            setError('You must be logged in to save a spark')
            return
        }
        
        setIsSaving(true)
        try {
            if (mode === 'create') {
                await createSpark({
                    ...spark,
                    consultant: isAdmin ? null : userId
                })
            } else if (mode === 'edit' && sparkUrl) {
                await updateSpark(sparkUrl, spark)
            }
            router.back()
        } catch (error) {
            logger.error(`Error ${mode === 'create' ? 'creating' : 'updating'} spark:`, error)
            setError(`Impossible de ${mode === 'create' ? 'créer' : 'mettre à jour'} le spark. Veuillez réessayer plus tard.`)
            setIsSaving(false)
        }
    }

    const handleBack = () => {
        router.back()
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => router.push('/admin/sparks')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Retour aux sparks
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Column - Chat Interface */}
                    <div className="lg:w-1/2">
                        <div className="sticky top-8">
                            <div className="flex items-center gap-4 mb-8">
                                <button
                                    onClick={handleBack}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="h-6 w-6" />
                                </button>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {pageTitle}
                                </h1>
                            </div>
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-blue-600" />
                                        <h2 className="text-xl font-semibold text-gray-900">{chatConfig.title}</h2>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{chatConfig.subtitle}</p>
                                </div>
                                <AIChatInterface
                                    template={mode === 'create' ? DOCUMENT_TEMPLATES.spark_content_creator : DOCUMENT_TEMPLATES.spark_content_editor}
                                    messages={messages}
                                    onMessagesUpdate={handleMessagesUpdate}
                                    shouldReset={isSaving}
                                    onConnect={handleSave}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial="initial"
                            animate="animate"
                            className="space-y-6"
                        >
                            <SparkPreviewSection title="Aperçu du Spark">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{spark.title || 'Sans titre'}</h3>
                                        <p className="text-gray-600 mt-2">{spark.description || 'Aucune description'}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {formatDuration(spark.duration)}
                                        </span>
                                        <span>{formatPrice(spark.price)}</span>
                                    </div>
                                </div>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Description détaillée">
                                <div className="prose prose-blue max-w-none">
                                    {spark.detailedDescription || 'Aucune description détaillée'}
                                </div>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Méthodologie">
                                <ul className="space-y-2">
                                    {(spark.methodology || []).length > 0 ? (
                                        (spark.methodology || []).map((step: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <ArrowRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <span>{step}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">Aucune méthodologie définie</li>
                                    )}
                                </ul>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Public cible">
                                <ul className="space-y-2">
                                    {(spark.targetAudience || []).length > 0 ? (
                                        (spark.targetAudience || []).map((audience: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <span>{audience}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">Aucun public cible défini</li>
                                    )}
                                </ul>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Prérequis">
                                <ul className="space-y-2">
                                    {(spark.prerequisites || []).length > 0 ? (
                                        (spark.prerequisites || []).map((prerequisite: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <span>{prerequisite}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">Aucun prérequis défini</li>
                                    )}
                                </ul>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Livrables">
                                <ul className="space-y-2">
                                    {(spark.deliverables || []).length > 0 ? (
                                        (spark.deliverables || []).map((deliverable: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <span>{deliverable}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">Aucun livrable défini</li>
                                    )}
                                </ul>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Prochaines étapes">
                                <ul className="space-y-2">
                                    {(spark.nextSteps || []).length > 0 ? (
                                        (spark.nextSteps || []).map((step: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <span>{step}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">Aucune prochaine étape définie</li>
                                    )}
                                </ul>
                            </SparkPreviewSection>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
} 