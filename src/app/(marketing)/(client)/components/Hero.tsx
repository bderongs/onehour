'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AIChatInterface, Message } from '@/components/AIChatInterface';
import { ConsultantConnect } from '@/components/ConsultantConnect';
import { SparksGrid } from '@/components/SparksGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DOCUMENT_TEMPLATES } from '@/data/documentTemplates';
import { createChatConfigs } from '@/data/chatConfigs';
import type { Spark } from '@/types/spark';
import type { DocumentSummary } from '@/types/chat';
import logger from '@/utils/logger';

interface MarketingHeroProps {
    sparks: Spark[];
}

export function Hero({ sparks }: MarketingHeroProps) {
    const [showConnect, setShowConnect] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [shouldReset, setShouldReset] = useState(false);
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(0);
    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const [documentSummary, setDocumentSummary] = useState<DocumentSummary>({
        challenge: '',
        currentSituation: '',
        desiredOutcome: '',
        constraints: '',
        stakeholders: '',
        previousAttempts: '',
        hasEnoughData: false
    });

    // Memoize chat configs to prevent unnecessary recreations
    const chatConfigs = React.useMemo(() => createChatConfigs(), []);

    const handleUseCaseClick = (prefillText: string) => {
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

    return (
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
                <SparksGrid
                    sparks={sparks.filter(spark => !spark.consultant && spark.consultant !== undefined)}
                    expandedCallIndex={expandedCallIndex}
                    setExpandedCallIndex={setExpandedCallIndex}
                    onCallClick={handleUseCaseClick}
                    buttonText="Choisir ce Spark"
                />

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
    );
} 