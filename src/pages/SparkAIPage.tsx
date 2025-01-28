import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, ArrowLeft, Sparkles } from 'lucide-react';
import type { Spark } from '../types/spark';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { DOCUMENT_TEMPLATES } from '../data/documentTemplates';
import { createChatConfigs } from '../data/chatConfigs';
import { formatDuration, formatPrice } from '../utils/format';
import { generateSparkCreatePrompt, generateSparkEditPrompt } from '../services/promptGenerators';
import { editSparkWithAI } from '../services/openai';
import { createSpark, getSparkByUrl, updateSpark } from '../services/sparks';
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
const useSparkAI = (mode: 'create' | 'edit', initialSpark: Omit<Spark, 'id'>) => {
    const [spark, setSpark] = useState<Omit<Spark, 'id'>>(initialSpark);
    
    // Memoize chat configs to prevent unnecessary recreations
    const chatConfigs = useMemo(() => createChatConfigs(), []);
    const chatConfig = useMemo(
        () => mode === 'create' ? chatConfigs.spark_content_creator : chatConfigs.spark_content_editor,
        [mode, chatConfigs]
    );
    
    const [messages, setMessages] = useState<Message[]>([chatConfig.initialMessage]);

    // Update spark when initialSpark changes
    useEffect(() => {
        setSpark(initialSpark);
    }, [initialSpark]);

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
            const systemPrompt = mode === 'create' 
                ? generateSparkCreatePrompt(spark as Spark)
                : generateSparkEditPrompt(spark as Spark);

            const aiMessages: { role: 'user' | 'assistant' | 'system'; content: string; }[] = [
                { role: 'system', content: systemPrompt },
                ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
            ];

            const response = await editSparkWithAI(aiMessages);

            // Create updated messages before updating the spark state
            const updatedMessages: Message[] = [
                ...newMessages,
                { role: 'assistant', content: response.reply, summary: response.document }
            ];

            // Process the document updates
            const documentUpdates = response.document as Partial<Spark>;

            // Create the updated spark state by only applying defined fields
            const updatedSpark = {
                ...spark,
                ...Object.fromEntries(
                    Object.entries(documentUpdates)
                        .filter(([_, value]) => value !== undefined)
                )
            };

            // Update state
            setMessages(updatedMessages);
            setSpark(updatedSpark);
        } catch (error) {
            console.error('Error getting AI response:', error);
            setMessages([
                ...newMessages,
                { role: 'assistant', content: "Je suis désolé, mais j'ai des difficultés à me connecter. Veuillez réessayer." }
            ]);
        }
    };

    return { spark, messages, handleMessagesUpdate, chatConfig };
};

// Preview section component
const SparkPreviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.section className="bg-white rounded-xl shadow-md p-4 sm:p-6" variants={fadeInUp}>
        <h2 className="text-lg lg:text-xl font-semibold mb-4">{title}</h2>
        {children}
    </motion.section>
);

export function SparkAIPage() {
    const navigate = useNavigate();
    const { sparkUrl } = useParams();
    const mode = sparkUrl ? 'edit' : 'create';
    const { userId, error: authError } = useAuthenticatedUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [initialSpark, setInitialSpark] = useState<Omit<Spark, 'id'>>(DEFAULT_SPARK);

    useEffect(() => {
        const fetchSpark = async () => {
            if (!sparkUrl) {
                setLoading(false);
                return;
            }

            try {
                const fetchedSpark = await getSparkByUrl(sparkUrl);
                if (!fetchedSpark) {
                    navigate('/sparks/manage');
                    return;
                }
                setInitialSpark(fetchedSpark);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching spark:', err);
                setError('Failed to load spark. Please try again later.');
                setLoading(false);
            }
        };

        fetchSpark();
    }, [sparkUrl, navigate]);

    const { spark, messages, handleMessagesUpdate, chatConfig } = useSparkAI(mode, initialSpark);

    const handleSave = async () => {
        if (!userId) {
            setError('You must be logged in to save a spark');
            return;
        }
        
        setIsSaving(true);
        try {
            if (mode === 'create') {
                await createSpark({
                    ...spark,
                    consultant: userId
                });
            } else {
                await updateSpark(sparkUrl!, spark);
            }
            navigate('/sparks/manage');
        } catch (error) {
            console.error('Error saving spark:', error);
            setError(`Failed to ${mode} spark. Please try again later.`);
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/sparks/manage');
    };

    if (authError) {
        setError(authError);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du spark...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => navigate('/sparks/manage')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Retour aux sparks
                    </button>
                </div>
            </div>
        );
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
                                    {mode === 'create' ? 'Créer un Spark avec l\'IA' : 'Modifier le Spark avec l\'IA'}
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
                                <div className="p-4">
                                    <AIChatInterface
                                        template={mode === 'create' ? DOCUMENT_TEMPLATES.spark_content_creator : DOCUMENT_TEMPLATES.spark_content_editor}
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
                            className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8"
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
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
                                    {isSaving ? 
                                        (mode === 'create' ? 'Création...' : 'Enregistrement...') : 
                                        (mode === 'create' ? 'Créer le Spark' : 'Enregistrer les modifications')
                                    }
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