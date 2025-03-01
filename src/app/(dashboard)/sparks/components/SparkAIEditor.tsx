/**
 * SparkAIEditor.tsx
 * This component provides an AI-assisted interface for creating and editing sparks,
 * with automatic saving functionality that triggers only when receiving updates from the AI service.
 */
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, ArrowLeft, Sparkles, Save, Edit2, Trash2, Loader2 } from 'lucide-react'
import type { Spark } from '@/types/spark'
import { AIChatInterface, Message } from '@/components/AIChatInterface'
import { DOCUMENT_TEMPLATES } from '@/data/documentTemplates'
import { createChatConfigs } from '@/data/chatConfigs'
import { formatDuration, formatPrice } from '@/utils/format'
import { generateSparkCreatePrompt, generateSparkEditPrompt } from '@/services/promptGenerators'
import { editSparkWithAI } from '@/services/openai'
import { createSparkAction, updateSparkAction, deleteSparkAction } from '../actions'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
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

    const handleMessagesUpdate = async (newMessages: Message[]) => {
        const lastUserMessage = [...newMessages].reverse().find(m => m.role === 'user')
        if (!lastUserMessage) return

        // Show loading state
        setMessages(prev => [...newMessages, { role: 'assistant', content: '⋯', isLoading: true }])

        try {
            const systemPrompt = mode === 'create' 
                ? generateSparkCreatePrompt(spark as Spark)
                : generateSparkEditPrompt(spark as Spark)

            const aiMessages: { role: 'user' | 'assistant' | 'system'; content: string; }[] = [
                { role: 'system', content: systemPrompt },
                ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
            ]

            const response = await editSparkWithAI(aiMessages)

            // Create updated messages
            const updatedMessages: Message[] = [
                ...newMessages,
                { role: 'assistant', content: response.reply, summary: response.document }
            ]

            // Update messages state FIRST to ensure the reply appears immediately
            setMessages(updatedMessages)
            
            // Process the document updates AFTER updating messages
            const documentUpdates = response.document as Partial<Spark>
            
            // Only update spark and trigger auto-save if there are document updates
            if (Object.keys(documentUpdates).length > 0) {
                // Create the updated spark state by only applying defined fields
                const updatedSpark = {
                    ...spark,
                    ...Object.fromEntries(
                        Object.entries(documentUpdates)
                            .filter(([_, value]) => value !== undefined)
                    )
                }
                
                // Update spark state and trigger auto-save in the next tick
                // This ensures the UI updates with the message first
                setTimeout(() => {
                    setSpark(updatedSpark)
                    
                    // Trigger auto-save only when we receive updates from AI
                    logger.info('AI provided document updates, triggering auto-save')
                    onSparkChange(updatedSpark)
                }, 0)
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
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
    const [savedSparkId, setSavedSparkId] = useState<string | null>(null)
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    const [sparkSlug, setSparkSlug] = useState<string | undefined>(initialSparkSlug)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

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
            
            // Show saving state for at least 1 second
            const minSavingTimer = setTimeout(() => {}, 1000)
            
            // Log auto-save attempt
            logger.info('Auto-saving after AI update', { 
                mode,
                sparkSlug,
                savedSparkId
            })
            
            let result: Spark
            let isFirstSave = false
            
            if (mode === 'create') {
                const sparkToSave = {
                    ...sparkData,
                    slug: sparkSlug || ''
                }
                
                if (savedSparkId) {
                    // Update existing spark
                    const originalSlug = sparkSlug
                    if (!originalSlug) {
                        throw new Error('Missing slug for update operation')
                    }
                    result = await updateSparkAction(originalSlug, sparkToSave)
                } else {
                    // First time saving
                    isFirstSave = true
                    result = await createSparkAction(sparkToSave)
                    setSavedSparkId(result.id)
                    
                    if (result.slug) {
                        logger.info(`Spark created with ID: ${result.id} and slug: ${result.slug}`)
                        setSparkSlug(result.slug)
                    }
                }
            } else if (mode === 'edit' && sparkSlug) {
                // For edit mode, use the existing slug
                const sparkToSave = {
                    ...sparkData,
                    slug: sparkData.slug || ''
                }
                
                result = await updateSparkAction(sparkSlug, sparkToSave)
            } else {
                throw new Error('Invalid mode or missing sparkSlug for edit mode')
            }
            
            setLastSavedAt(new Date())
            
            // Wait for the minimum saving timer to complete
            await new Promise(resolve => {
                clearTimeout(minSavingTimer)
                resolve(null)
            })
            
            setAutoSaveStatus('saved')
            
            // Reset status after a delay but keep lastSavedAt
            setTimeout(() => {
                setAutoSaveStatus('idle')
            }, 3000)
            
            // Redirect to ai-edit/[sparkSlug] after first save in create mode
            if (isFirstSave && result.slug) {
                logger.info(`Redirecting to ai-edit/${result.slug} after first auto-save`)
                setTimeout(() => {
                    router.refresh()
                    router.push(`/sparks/ai-edit/${result.slug}`)
                }, 500) // Small delay to ensure state is updated
            }
            
        } catch (error) {
            logger.error(`Error auto-saving spark:`, error)
            setAutoSaveStatus('error')
        }
    }, [user, mode, savedSparkId, sparkSlug, router])

    // Handle spark changes from the AI editor - simplified to just call autoSave directly
    const handleSparkChange = useCallback((updatedSpark: Omit<Spark, 'id'>) => {
        // Auto-save immediately when we get updates from AI
        autoSave(updatedSpark)
    }, [autoSave])

    const { spark, messages, handleMessagesUpdate, chatConfig } = useSparkAI(mode, initialSpark, handleSparkChange)

    const handleBack = () => {
        if (savedSparkId) {
            router.refresh()
        }
        router.back()
    }

    // Handle edit button click - navigate to manual edit page
    const handleEditClick = () => {
        logger.info('Edit button clicked, navigating to manual edit page')
        if (sparkSlug) {
            router.push(`/sparks/edit/${sparkSlug}`)
        } else {
            logger.error('Cannot navigate to edit page: Missing spark slug')
        }
    }

    // Handle delete button click - show confirmation modal
    const handleDeleteClick = () => {
        logger.info('Delete button clicked, showing confirmation modal')
        setIsDeleteModalOpen(true)
    }

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!sparkSlug) {
            logger.error('Cannot delete spark: Missing spark slug')
            setIsDeleteModalOpen(false)
            return
        }

        setIsDeleting(true)
        try {
            logger.info(`Deleting spark with slug: ${sparkSlug}`)
            await deleteSparkAction(sparkSlug)
            
            // Close modal and redirect to sparks management page
            setIsDeleteModalOpen(false)
            router.refresh()
            router.push('/sparks/manage')
        } catch (error) {
            logger.error('Error deleting spark:', error)
            setError('Impossible de supprimer le spark. Veuillez réessayer plus tard.')
            setIsDeleting(false)
        }
    }

    // Handle cancel delete
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false)
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
                                    hideSummary={true}
                                    isSparkConfig={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="lg:w-1/2">
                        {/* Section header with autosave status */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Aperçu du Spark</h2>
                            {/* Improved autosave status indicator with persistent message and action buttons */}
                            <div className="flex items-center gap-3">
                                {/* Status messages with consistent width for alignment */}
                                <div className="w-44 flex justify-start items-center">
                                    {/* Always render icons but conditionally show them */}
                                    <Loader2 className={`h-5 w-5 mr-1.5 ${autoSaveStatus === 'saved' ? 'text-green-600' : 'text-gray-500'} ${autoSaveStatus === 'saving' ? 'animate-spin visible' : 'invisible'} absolute`} />
                                    <Save className={`h-5 w-5 mr-1.5 ${autoSaveStatus === 'saved' ? 'text-green-600' : 'text-gray-500'} ${autoSaveStatus === 'saved' || (autoSaveStatus === 'idle' && lastSavedAt) ? 'visible' : 'invisible'} absolute`} />
                                    <div className="w-5 h-5 mr-1.5 flex-shrink-0"></div> {/* Placeholder to maintain spacing */}
                                    
                                    {autoSaveStatus === 'saving' && (
                                        <span className="text-green-600 text-sm">Enregistrement...</span>
                                    )}
                                    {(autoSaveStatus === 'saved' || (autoSaveStatus === 'idle' && lastSavedAt)) && (
                                        <span className={`text-sm ${autoSaveStatus === 'saved' ? 'text-green-600' : 'text-gray-500'}`}>
                                            Enregistré {lastSavedAt ? `à ${lastSavedAt.toLocaleTimeString()}` : ''}
                                        </span>
                                    )}
                                    {autoSaveStatus === 'error' && (
                                        <span className="text-red-600 text-sm">Erreur d'enregistrement</span>
                                    )}
                                </div>
                                
                                {/* Action buttons (only show if we have a saved spark) */}
                                <div className="flex items-center">
                                    <button
                                        onClick={handleEditClick}
                                        className={`text-gray-600 hover:text-gray-900 transition-colors ${lastSavedAt ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                        title="Modifier manuellement"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className={`text-red-600 hover:text-red-700 transition-colors ml-3 ${lastSavedAt ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                        title="Supprimer"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

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

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteModalOpen}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer ce spark ? Cette action est irréversible."
                confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
                cancelLabel="Annuler"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />
        </div>
    )
} 