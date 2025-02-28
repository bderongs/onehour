/**
 * SparkAIEditor.tsx
 * This component provides an AI-assisted interface for creating and editing sparks,
 * with automatic saving functionality to preserve changes as they are made.
 */
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, ArrowLeft, Sparkles, Save } from 'lucide-react'
import type { Spark } from '@/types/spark'
import { AIChatInterface, Message } from '@/components/AIChatInterface'
import { DOCUMENT_TEMPLATES } from '@/data/documentTemplates'
import { createChatConfigs } from '@/data/chatConfigs'
import { formatDuration, formatPrice } from '@/utils/format'
import { generateSparkCreatePrompt, generateSparkEditPrompt } from '@/services/promptGenerators'
import { editSparkWithAI } from '@/services/openai'
import { createSparkAction, updateSparkAction } from '../actions'
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
const useSparkAI = (mode: 'create' | 'edit', initialSpark: Omit<Spark, 'id'>, onSparkChange: (spark: Omit<Spark, 'id'>) => void) => {
    const [spark, setSpark] = useState<Omit<Spark, 'id'>>(initialSpark)
    const [previousSparkRef] = useState<{ current: Omit<Spark, 'id'> }>({ current: initialSpark })
    
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
        previousSparkRef.current = initialSpark
    }, [initialSpark, previousSparkRef])

    // Helper function to check if spark has actually changed
    const hasSparkChanged = useCallback((newSpark: Omit<Spark, 'id'>, oldSpark: Omit<Spark, 'id'>) => {
        // Check key fields that would require saving
        const fieldsToCheck = [
            'title',
            'description',
            'detailedDescription',
            'duration',
            'price',
            'methodology',
            'targetAudience',
            'prerequisites',
            'deliverables',
            'nextSteps',
            'benefits',
            'expertProfile',
            'faq'
        ]
        
        return fieldsToCheck.some(field => {
            const oldValue = oldSpark[field as keyof Omit<Spark, 'id'>]
            const newValue = newSpark[field as keyof Omit<Spark, 'id'>]
            
            // Handle arrays
            if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                if (oldValue.length !== newValue.length) return true
                return JSON.stringify(oldValue) !== JSON.stringify(newValue)
            }
            
            // Handle objects
            if (typeof oldValue === 'object' && oldValue !== null && 
                typeof newValue === 'object' && newValue !== null) {
                return JSON.stringify(oldValue) !== JSON.stringify(newValue)
            }
            
            // Handle primitives
            return oldValue !== newValue
        })
    }, [])

    // Notify parent component when spark changes, but only if content actually changed
    useEffect(() => {
        if (hasSparkChanged(spark, previousSparkRef.current)) {
            previousSparkRef.current = { ...spark }
            onSparkChange(spark)
        }
    }, [spark, onSparkChange, hasSparkChanged, previousSparkRef])

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
            
            // Only update if there are actual changes
            if (Object.keys(documentUpdates).length > 0) {
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
            } else {
                // Just update messages if no spark changes
                setMessages(updatedMessages)
            }
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
    sparkSlug?: string
    pageTitle: string
}

export default function SparkAIEditor({ mode, initialSpark, sparkSlug: initialSparkSlug, pageTitle }: SparkAIEditorProps) {
    const router = useRouter()
    const { user } = useAuth()
    
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
    const [savedSparkId, setSavedSparkId] = useState<string | null>(null)
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    const [sparkSlug, setSparkSlug] = useState<string | undefined>(initialSparkSlug)

    // Debounce function for auto-save
    const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
        let timeoutId: NodeJS.Timeout
        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func(...args), delay)
        }
    }

    // Auto-save function
    const autoSave = useCallback(async (sparkData: Omit<Spark, 'id'>) => {
        if (!user) {
            logger.warn('Cannot auto-save: User not logged in')
            return
        }

        // Skip saving if there's no title and we're creating a new spark
        if (mode === 'create' && !savedSparkId && !sparkData.title?.trim()) {
            logger.info('Skipping auto-save: No title provided for new spark')
            return
        }

        try {
            setAutoSaveStatus('saving')
            
            // Log user information for debugging
            logger.info('Auto-save attempt', { 
                userId: user.id, 
                mode,
                sparkSlug,
                savedSparkId,
                hasConsultant: !!sparkData.consultant,
                title: sparkData.title?.substring(0, 30) + (sparkData.title?.length > 30 ? '...' : '')
            })
            
            let result: Spark
            
            if (mode === 'create') {
                // For create mode, we don't generate a temporary slug
                // We'll let the server generate it based on the title
                const sparkToSave = {
                    ...sparkData,
                    // Remove any client-side generated slug to allow server to generate one from title
                    // Use empty string instead of undefined to satisfy type requirements
                    slug: sparkSlug || ''
                }
                
                // Log the data being sent for debugging
                logger.info('Spark data for save', { 
                    mode, 
                    hasSlug: !!sparkSlug,
                    hasSavedId: !!savedSparkId,
                    hasTitle: !!sparkData.title?.trim(),
                    hasDescription: !!sparkData.description?.trim(),
                    hasDetailedDescription: !!sparkData.detailedDescription?.trim()
                })
                
                if (savedSparkId) {
                    // If we already have a saved spark ID, update it using the original slug
                    const originalSlug = sparkSlug
                    if (!originalSlug) {
                        throw new Error('Missing slug for update operation')
                    }
                    result = await updateSparkAction(originalSlug, sparkToSave)
                } else {
                    // First time saving
                    result = await createSparkAction(sparkToSave)
                    setSavedSparkId(result.id)
                    
                    // Store the server-generated slug for future updates
                    if (result.slug) {
                        logger.info(`Spark created with ID: ${result.id} and slug: ${result.slug}`)
                        setSparkSlug(result.slug)
                    }
                }
            } else if (mode === 'edit' && sparkSlug) {
                // For edit mode, use the existing slug
                const sparkToSave = {
                    ...sparkData,
                    // Don't override the slug if it's already set by the server
                    // Use empty string instead of undefined to satisfy type requirements
                    slug: sparkData.slug || ''
                }
                
                // Log the data being sent for debugging
                logger.info('Spark data for edit', { 
                    mode, 
                    sparkSlug
                })
                
                result = await updateSparkAction(sparkSlug, sparkToSave)
            } else {
                throw new Error('Invalid mode or missing sparkSlug for edit mode')
            }
            
            setLastSavedAt(new Date())
            setAutoSaveStatus('saved')
            
            // Reset status after a delay
            setTimeout(() => {
                setAutoSaveStatus('idle')
            }, 3000)
            
        } catch (error) {
            logger.error(`Error auto-saving spark:`, error)
            setAutoSaveStatus('error')
        }
    }, [user, mode, savedSparkId, sparkSlug])
    
    // Create debounced version of autoSave
    const debouncedAutoSave = useMemo(
        () => debounce(autoSave, 2000), // 2 second delay
        [autoSave]
    )

    // Handle spark changes from the AI editor
    const handleSparkChange = useCallback((updatedSpark: Omit<Spark, 'id'>) => {
        // Only trigger auto-save if there's meaningful content
        const hasContent = updatedSpark.description || updatedSpark.detailedDescription
        const hasTitle = updatedSpark.title?.trim()
        
        // Log what triggered the change
        logger.info('Spark change detected', {
            mode,
            hasTitle: !!hasTitle,
            hasContent: !!hasContent,
            hasSavedId: !!savedSparkId,
            title: updatedSpark.title?.substring(0, 30) + (updatedSpark.title?.length > 30 ? '...' : '')
        })
        
        // For new sparks in create mode, require a title
        if (mode === 'create' && !savedSparkId) {
            // Only auto-save if there's a title
            if (hasTitle) {
                logger.info('Auto-saving new spark with title:', hasTitle)
                debouncedAutoSave(updatedSpark)
            } else {
                logger.info('Skipping auto-save: No title for new spark')
            }
        } else if (hasContent || hasTitle) {
            // For existing sparks, auto-save if there's any content
            logger.info('Auto-saving existing spark with content')
            debouncedAutoSave(updatedSpark)
        } else {
            logger.info('Skipping auto-save: No meaningful content changes')
        }
    }, [debouncedAutoSave, mode, savedSparkId])

    const { spark, messages, handleMessagesUpdate, chatConfig } = useSparkAI(mode, initialSpark, handleSparkChange)

    const handleSave = async () => {
        if (!user) {
            setError('You must be logged in to save a spark')
            return
        }
        
        // Validate title before saving
        if (mode === 'create' && !savedSparkId && !spark.title?.trim()) {
            setError('Veuillez ajouter un titre avant de sauvegarder')
            return
        }
        
        setIsSaving(true)
        try {
            // Don't generate a temporary slug, let the server handle it
            const sparkToSave = {
                ...spark,
                // Use existing slug if available, otherwise empty string
                slug: sparkSlug || ''
            }
            
            if (mode === 'create') {
                if (savedSparkId) {
                    // If we already have a saved spark, update it
                    if (!sparkSlug) {
                        throw new Error('Missing slug for update operation')
                    }
                    await updateSparkAction(sparkSlug, sparkToSave)
                } else {
                    // First time manual save
                    const result = await createSparkAction(sparkToSave)
                    setSavedSparkId(result.id)
                    if (result.slug) {
                        setSparkSlug(result.slug)
                    }
                }
            } else if (mode === 'edit' && sparkSlug) {
                await updateSparkAction(sparkSlug, sparkToSave)
            }
            
            // Refresh the router to ensure data is updated when navigating back
            router.refresh()
            router.back()
        } catch (error) {
            logger.error(`Error ${mode === 'create' ? 'creating' : 'updating'} spark:`, error)
            setError(`Impossible de ${mode === 'create' ? 'créer' : 'mettre à jour'} le spark. Veuillez réessayer plus tard.`)
            setIsSaving(false)
        }
    }

    const handleBack = () => {
        // Refresh the router to ensure data is updated when navigating back
        if (savedSparkId) {
            router.refresh()
        }
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
                                
                                {/* Auto-save status indicator */}
                                <div className="ml-auto flex items-center gap-2">
                                    {autoSaveStatus === 'saving' && (
                                        <div className="flex items-center text-amber-600">
                                            <div className="w-4 h-4">
                                                <LoadingSpinner fullScreen={false} message="" />
                                            </div>
                                            <span className="ml-2 text-sm">Enregistrement...</span>
                                        </div>
                                    )}
                                    {autoSaveStatus === 'saved' && (
                                        <div className="flex items-center text-green-600">
                                            <Save className="h-4 w-4" />
                                            <span className="ml-2 text-sm">Enregistré {lastSavedAt ? `à ${lastSavedAt.toLocaleTimeString()}` : ''}</span>
                                        </div>
                                    )}
                                    {autoSaveStatus === 'error' && (
                                        <div className="flex items-center text-red-600">
                                            <span className="ml-2 text-sm">Erreur d'enregistrement</span>
                                        </div>
                                    )}
                                </div>
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
                                    hideSummary={true}
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