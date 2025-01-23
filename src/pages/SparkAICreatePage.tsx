import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, ArrowLeft, Sparkles } from 'lucide-react';
import type { Spark } from '../types/spark';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { DOCUMENT_TEMPLATES } from '../data/documentTemplates';
import { CHAT_CONFIGS } from '../data/chatConfigs';
import { formatDuration, formatPrice } from '../utils/format';
import { generateSparkCreatePrompt } from '../services/promptGenerators';
import { editSparkWithAI } from '../services/openai';
import { createSpark } from '../services/sparks';
import { supabase } from '../lib/supabase';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// Default spark state
const DEFAULT_SPARK: Omit<Spark, 'id'> = {
    title: '',
    description: '',
    detailedDescription: '',
    duration: '60',
    price: '0',
    methodology: [],
    targetAudience: [],
    prerequisites: [],
    deliverables: [],
    nextSteps: [],
    url: '',
    consultant: null,
    highlight: '',
    prefillText: ''
};

// Custom hook for authentication
const useAuthenticatedUser = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/signin');
                    return;
                }
                setUserId(user.id);
            } catch (err) {
                console.error('Error checking auth:', err);
                setError('Authentication failed. Please try again later.');
            }
        };

        checkAuth();
    }, [navigate]);

    return { userId, error };
};

// Custom hook for AI interaction
const useSparkAI = (initialSpark: Omit<Spark, 'id'>) => {
    const [spark, setSpark] = useState<Omit<Spark, 'id'>>(initialSpark);
    const [messages, setMessages] = useState<Message[]>([CHAT_CONFIGS.spark_content_assistant.initialMessage]);

    // Update spark when userId changes
    useEffect(() => {
        if (initialSpark.consultant) {
            setSpark(prev => ({ ...prev, consultant: initialSpark.consultant }));
        }
    }, [initialSpark.consultant]);

    const handleMessagesUpdate = async (newMessages: Message[]) => {
        const lastUserMessage = [...newMessages].reverse().find(m => m.role === 'user');
        if (!lastUserMessage) return;

        setMessages(newMessages);
        setMessages(prev => [...prev, { role: 'assistant', content: '⋯', isLoading: true }]);

        try {
            const createPrompt = generateSparkCreatePrompt();
            const response = await editSparkWithAI([
                { role: 'system', content: createPrompt },
                ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
            ]);

            const updatedMessages: Message[] = [
                ...newMessages,
                { role: 'assistant', content: response.reply, summary: response.document }
            ];
            setMessages(updatedMessages);

            // Exclude id field from the response document and ensure type safety
            const { id: _id, ...documentWithoutId } = response.document as Partial<Spark>;
            const updatedSpark = {
                ...spark,
                ...Object.fromEntries(
                    Object.entries(documentWithoutId).map(([key, value]) => [
                        key,
                        value === "Non défini" ? null : value
                    ])
                )
            };
            setSpark(updatedSpark);
        } catch (error) {
            console.error('Error getting AI response:', error);
            setMessages([
                ...newMessages,
                { role: 'assistant', content: "Je suis désolé, mais j'ai des difficultés à me connecter. Veuillez réessayer." }
            ]);
        }
    };

    return { spark, messages, handleMessagesUpdate };
};

// Preview section components
const SparkPreviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.section className="bg-white rounded-xl shadow-md p-4 sm:p-6" variants={fadeInUp}>
        <h2 className="text-lg lg:text-xl font-semibold mb-4">{title}</h2>
        {children}
    </motion.section>
);

export function SparkAICreatePage() {
    const navigate = useNavigate();
    const { userId, error: authError } = useAuthenticatedUser();
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const { spark, messages, handleMessagesUpdate } = useSparkAI({
        ...DEFAULT_SPARK,
        consultant: userId // This will be null initially and updated when userId is set
    });

    const handleSave = async () => {
        if (!userId) {
            setError('You must be logged in to create a spark');
            return;
        }
        
        setIsSaving(true);
        try {
            await createSpark({
                ...spark,
                consultant: userId // Ensure we have the latest userId when saving
            });
            navigate('/sparks/manage');
        } catch (error) {
            console.error('Error creating spark:', error);
            setError('Failed to create spark. Please try again later.');
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/sparks/manage');
    };

    if (authError) {
        setError(authError);
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Mobile Back Button */}
            <div className="lg:hidden sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 p-4 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Retour</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 lg:py-12">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
                
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Column - Chat Interface */}
                    <div className="lg:w-1/2">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-blue-600" />
                                        <h2 className="text-xl font-semibold text-gray-900">{CHAT_CONFIGS.spark_content_assistant.title}</h2>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{CHAT_CONFIGS.spark_content_assistant.subtitle}</p>
                                </div>
                                <div className="p-4">
                                    <AIChatInterface
                                        template={DOCUMENT_TEMPLATES.spark_content_assistant}
                                        messages={messages}
                                        onMessagesUpdate={handleMessagesUpdate}
                                        hideSummary={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Spark Preview */}
                    <div className="lg:w-1/2">
                        {/* Hero Section */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8"
                            variants={fadeInUp}
                        >
                            <div className="flex flex-col gap-6 lg:gap-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-3 lg:mb-4">
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                            {spark.title || 'Nouveau Spark'}
                                        </h1>
                                        {spark.highlight && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {spark.highlight}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-base lg:text-lg text-gray-600 mb-4 lg:mb-6">
                                        {spark.description || 'Décrivez votre Spark...'}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="h-5 w-5" />
                                            <span>{formatDuration(spark.duration)}</span>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{formatPrice(spark.price)}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content */}
                        <div className="space-y-6 lg:space-y-8">
                            <SparkPreviewSection title="Description détaillée">
                                <p className="text-gray-600 whitespace-pre-line text-sm lg:text-base">
                                    {spark.detailedDescription || 'Ajoutez une description détaillée...'}
                                </p>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Méthodologie">
                                <div className="space-y-3">
                                    {spark.methodology && spark.methodology.length > 0 ? (
                                        spark.methodology.map((step, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-600 text-sm lg:text-base">{step}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Ajoutez les étapes de votre méthodologie...</p>
                                    )}
                                </div>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Pour qui ?">
                                <div className="space-y-3">
                                    {spark.targetAudience && spark.targetAudience.length > 0 ? (
                                        spark.targetAudience.map((audience, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-600 text-sm lg:text-base">{audience}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Définissez votre audience cible...</p>
                                    )}
                                </div>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Prérequis">
                                <div className="space-y-3">
                                    {spark.prerequisites && spark.prerequisites.length > 0 ? (
                                        spark.prerequisites.map((prerequisite, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-600 text-sm lg:text-base">{prerequisite}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Ajoutez les prérequis nécessaires...</p>
                                    )}
                                </div>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Ce que vous obtiendrez">
                                <div className="space-y-3">
                                    {spark.deliverables && spark.deliverables.length > 0 ? (
                                        spark.deliverables.map((deliverable, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-600 text-sm lg:text-base">{deliverable}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Définissez les livrables...</p>
                                    )}
                                </div>
                            </SparkPreviewSection>

                            <SparkPreviewSection title="Prochaines étapes">
                                <div className="space-y-3">
                                    {spark.nextSteps && spark.nextSteps.length > 0 ? (
                                        spark.nextSteps.map((step, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-600 text-sm lg:text-base">{step}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Ajoutez les prochaines étapes...</p>
                                    )}
                                </div>
                            </SparkPreviewSection>

                            {/* Save Button */}
                            <motion.div
                                className="mt-8"
                                variants={fadeInUp}
                            >
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !spark.title}
                                    className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold 
                                            hover:bg-blue-700 transition-colors flex items-center justify-center gap-2
                                            disabled:bg-blue-400 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Création...' : 'Créer le Spark'}
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 