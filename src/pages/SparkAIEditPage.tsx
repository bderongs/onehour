import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, ArrowLeft, Sparkles } from 'lucide-react';
import { getSparkByUrl, updateSpark } from '../services/sparks';
import type { Spark } from '../types/spark';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { DOCUMENT_TEMPLATES } from '../data/documentTemplates';
import { CHAT_CONFIGS } from '../data/chatConfigs';
import { formatDuration, formatPrice } from '../utils/format';
import { generateSparkEditPrompt } from '../services/promptGenerators';
import { editSparkWithAI } from '../services/openai';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function SparkAIEditPage() {
    const navigate = useNavigate();
    const { sparkUrl } = useParams();
    const [spark, setSpark] = useState<Spark | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([CHAT_CONFIGS.spark_content_assistant.initialMessage]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSpark = async () => {
            if (!sparkUrl) {
                navigate('/sparks/manage');
                return;
            }

            try {
                const fetchedSpark = await getSparkByUrl(sparkUrl);
                if (!fetchedSpark) {
                    navigate('/sparks/manage');
                    return;
                }
                setSpark(fetchedSpark);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching spark:', err);
                setError('Failed to load spark. Please try again later.');
                setLoading(false);
            }
        };

        fetchSpark();
    }, [sparkUrl, navigate]);

    const handleMessagesUpdate = async (newMessages: Message[]) => {
        // Only proceed if we have a new user message
        const lastUserMessage = [...newMessages].reverse().find(m => m.role === 'user');
        if (!lastUserMessage || !spark) return;

        // Update messages immediately to show the user's message
        setMessages(newMessages);

        // Add loading indicator with animated dots
        setMessages(prev => [...prev, { 
            role: 'assistant' as const, 
            content: '⋯', // This will be rendered as the three dots animation by the AIChatInterface
            isLoading: true // Add this flag to identify loading messages
        }]);

        try {
            // Use the specialized Spark edit prompt
            const editPrompt = generateSparkEditPrompt(spark);

            // Log the interaction details
            console.group('AI Interaction Details');
            console.log('Edit Prompt:', editPrompt);
            console.log('User Message:', lastUserMessage.content);

            // Make a single call to the AI with function calling
            const response = await editSparkWithAI([
                { role: 'system', content: editPrompt },
                ...newMessages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            ]);

            console.log('AI Response:', response);
            console.groupEnd();

            // Remove loading message and update with AI response
            const updatedMessages: Message[] = [
                ...newMessages,
                { 
                    role: 'assistant' as const, 
                    content: response.reply,
                    summary: response.document
                }
            ];
            setMessages(updatedMessages);

            // Update the spark preview with only the modified fields
            const updatedSpark = {
                ...spark,
                ...Object.fromEntries(
                    Object.entries(response.document).map(([key, value]) => [
                        key,
                        value === "Non défini" ? null : value
                    ])
                )
            };
            setSpark(updatedSpark);
        } catch (error) {
            console.error('Error getting AI response:', error);
            // Remove loading message and show error
            const errorMessages: Message[] = [
                ...newMessages,
                { 
                    role: 'assistant' as const, 
                    content: "Je suis désolé, mais j'ai des difficultés à me connecter. Veuillez réessayer." 
                }
            ];
            setMessages(errorMessages);
        }
    };

    const handleSave = async () => {
        if (!spark || !sparkUrl) return;
        setIsSaving(true);
        try {
            await updateSpark(sparkUrl, spark);
            navigate('/sparks/manage');
        } catch (error) {
            console.error('Error updating spark:', error);
            setError('Failed to update spark. Please try again later.');
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/sparks/manage');
    };

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

    if (error || !spark) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Spark introuvable'}</p>
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
                                        systemPrompt="dummy"
                                        shouldReset={false}
                                        onConnect={() => {}}
                                        shouldHandleAICall={false}
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
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{spark.title}</h1>
                                        {spark.highlight && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {spark.highlight}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-base lg:text-lg text-gray-600 mb-4 lg:mb-6">{spark.description}</p>
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
                            {/* Detailed Description */}
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Description détaillée</h2>
                                <p className="text-gray-600 whitespace-pre-line text-sm lg:text-base">
                                    {spark.detailedDescription}
                                </p>
                            </motion.section>

                            {/* Methodology */}
                            {spark.methodology && (
                                <motion.section
                                    className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                    variants={fadeInUp}
                                >
                                    <h2 className="text-lg lg:text-xl font-semibold mb-4">Méthodologie</h2>
                                    <div className="space-y-3">
                                        {spark.methodology.map((step, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-600 text-sm lg:text-base">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Target Audience */}
                            {spark.targetAudience && (
                                <motion.section
                                    className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                    variants={fadeInUp}
                                >
                                    <h2 className="text-lg lg:text-xl font-semibold mb-4">Pour qui ?</h2>
                                    <div className="space-y-3">
                                        {spark.targetAudience.map((audience, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-600 text-sm lg:text-base">{audience}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Prerequisites */}
                            {spark.prerequisites && (
                                <motion.section
                                    className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                    variants={fadeInUp}
                                >
                                    <h2 className="text-lg lg:text-xl font-semibold mb-4">Prérequis</h2>
                                    <div className="space-y-3">
                                        {spark.prerequisites.map((prerequisite, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-600 text-sm lg:text-base">{prerequisite}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Deliverables */}
                            {spark.deliverables && (
                                <motion.section
                                    className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                    variants={fadeInUp}
                                >
                                    <h2 className="text-lg lg:text-xl font-semibold mb-4">Ce que vous obtiendrez</h2>
                                    <div className="space-y-3">
                                        {spark.deliverables.map((deliverable, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-600 text-sm lg:text-base">{deliverable}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Next Steps */}
                            {spark.nextSteps && (
                                <motion.section
                                    className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                    variants={fadeInUp}
                                >
                                    <h2 className="text-lg lg:text-xl font-semibold mb-4">Prochaines étapes</h2>
                                    <div className="space-y-3">
                                        {spark.nextSteps.map((step, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-600 text-sm lg:text-base">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Save Button */}
                            <motion.div
                                className="mt-8"
                                variants={fadeInUp}
                            >
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 