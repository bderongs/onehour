import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { analyzeWithOpenAI } from '../services/openai';
import { DocumentSummary } from './DocumentSummary';
import type { DocumentTemplate, DocumentSummary as DocumentSummaryType } from '../types/chat';
import type { Spark } from '../types/spark';
import logger from '../utils/logger';

// Loading animations components
const LoadingDonut = () => (
    <div className="flex items-center gap-2">
        <div className="relative w-4 h-4">
            <div className="absolute top-0 left-0 w-full h-full border-2 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 text-sm">Configuration du Spark...</p>
    </div>
);

const LoadingDots = () => (
    <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
);

export type Message = {
    role: 'user' | 'assistant';
    content: string;
    summary?: DocumentSummaryType | Partial<Spark>;
    isLoading?: boolean;
};

interface AIChatInterfaceProps {
    template: DocumentTemplate;
    messages?: Message[];
    onMessagesUpdate?: (messages: Message[]) => void;
    shouldReset?: boolean;
    onConnect?: () => void;
    systemPrompt?: string;
    summaryInstructions?: string;
    hideSummary?: boolean;
    shouldHandleAICall?: boolean;
    isSparkConfig?: boolean;
}

export function AIChatInterface({ 
    template, 
    messages: initialMessages = [], 
    onMessagesUpdate, 
    shouldReset = false,
    onConnect,
    systemPrompt,
    summaryInstructions,
    hideSummary = false,
    shouldHandleAICall = true,
    isSparkConfig = false
}: AIChatInterfaceProps) {
    logger.debug('AIChatInterface props:', {
        templateId: template?.id,
        hasMessages: initialMessages.length > 0,
        hasSystemPrompt: !!systemPrompt,
        hasSummaryInstructions: !!summaryInstructions,
        summaryInstructions: summaryInstructions?.substring(0, 100) + '...'
    });

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [documentSummary, setDocumentSummary] = useState<DocumentSummaryType>({ hasEnoughData: false });
    const [isInitialized, setIsInitialized] = useState(false);

    // Add ref for scrolling
    const chatContainerRef = React.useRef<HTMLDivElement>(null);
    const summaryContainerRef = React.useRef<HTMLDivElement>(null);
    const componentRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Reset state when shouldReset changes
    useEffect(() => {
        if (shouldReset) {
            setMessages(initialMessages);
            setInputValue('');
            setDocumentSummary({ hasEnoughData: false });
            setIsInitialized(false);
        }
    }, [shouldReset, initialMessages]);

    // Initialize messages when component mounts
    useEffect(() => {
        if (initialMessages && initialMessages.length > 0) {
            setMessages(initialMessages);
        } else if (messages.length === 0 && !isInitialized) {
            setMessages([{ 
                role: 'assistant', 
                content: template.placeholderMessage || "Bonjour ! Comment puis-je vous aider ?"
            }]);
        }
    }, [initialMessages, isInitialized, messages.length, template.placeholderMessage]);

    // Handle initial AI response when external messages are provided
    useEffect(() => {
        const getInitialResponse = async () => {
            if (!initialMessages || initialMessages.length === 0 || isInitialized || !systemPrompt || !shouldHandleAICall) {
                setIsInitialized(true);
                return;
            }
            
            // Don't respond if the last message is from the assistant
            if (initialMessages[initialMessages.length - 1].role === 'assistant') {
                setIsInitialized(true);
                return;
            }
            
            setIsLoading(true);
            try {
                const aiResponse = await analyzeWithOpenAI(
                    [
                        { role: 'system' as const, content: systemPrompt },
                        ...initialMessages.map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    ],
                    false
                );

                if (aiResponse) {
                    const updatedMessages: Message[] = [
                        ...initialMessages,
                        { role: 'assistant', content: aiResponse }
                    ];
                    updateMessages(updatedMessages);
                    // Lancer la mise à jour du résumé de manière indépendante
                    updateSummaryIfNeeded(updatedMessages).catch(error => {
                        console.error('Error updating initial summary:', error);
                    });
                }
            } catch (error) {
                console.error('Error getting initial AI response:', error);
                const errorMessages: Message[] = [
                    ...initialMessages,
                    { role: 'assistant', content: "Je suis désolé, mais j'ai des difficultés à me connecter. Veuillez réessayer." }
                ];
                updateMessages(errorMessages);
            }
            setIsLoading(false);
            setIsInitialized(true);
        };

        getInitialResponse();
    }, [initialMessages, systemPrompt, isInitialized, shouldHandleAICall]);

    // Keep focus on textarea after sending message
    useEffect(() => {
        if (!isLoading && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isLoading]);

    // Function to get summary if needed
    const updateSummaryIfNeeded = async (messagesForSummary: Message[]) => {
        if (!shouldHandleAICall || !summaryInstructions || !messagesForSummary.some(m => m.role === 'user')) {
            logger.debug('Skipping summary generation:', {
                reason: !shouldHandleAICall ? 'shouldHandleAICall is false' : 
                        !summaryInstructions ? 'No summary instructions' : 
                        'No user messages'
            });
            return;
        }

        logger.debug('Starting summary generation with instructions:', summaryInstructions);
        logger.debug('Messages for summary:', messagesForSummary);

        setIsSummaryLoading(true);

        try {
            const summaryResponse = await analyzeWithOpenAI(
                [
                    { role: 'system', content: summaryInstructions },
                    ...messagesForSummary.map((msg): Message => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    { 
                        role: 'user', 
                        content: 'Please analyze the conversation above and provide a JSON summary following the specified format.' 
                    }
                ],
                true
            );

            logger.debug('Raw summary response:', summaryResponse);

            if (summaryResponse) {
                let jsonStr: string;
                try {
                    const jsonMatch = summaryResponse.match(/\{[\s\S]*\}/);
                    logger.debug('JSON match result:', jsonMatch);
                    
                    jsonStr = jsonMatch ? jsonMatch[0] : summaryResponse;
                    logger.debug('JSON string to parse:', jsonStr);
                    
                    const parsedSummary = JSON.parse(jsonStr);
                    logger.debug('Parsed summary:', parsedSummary);
                    
                    setDocumentSummary(parsedSummary);
                    if (onMessagesUpdate) {
                        const messagesWithSummary = [...messagesForSummary];
                        const lastMessage = messagesWithSummary[messagesWithSummary.length - 1];
                        if (lastMessage && lastMessage.role === 'assistant') {
                            lastMessage.summary = parsedSummary;
                        }
                        onMessagesUpdate(messagesWithSummary);
                    }
                } catch (e) {
                    console.error('Failed to parse summary JSON:', e);
                    console.error('Failed JSON string:', jsonStr!);
                }
            }
        } catch (error) {
            console.error('Error getting summary:', error);
        } finally {
            setIsSummaryLoading(false);
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const updateMessages = (newMessages: Message[]) => {
        setMessages(newMessages);
        onMessagesUpdate?.(newMessages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        logger.debug('handleSubmit called');
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: inputValue.trim()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        
        // Réinitialiser la hauteur du champ de saisie
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        if (onMessagesUpdate) {
            onMessagesUpdate(updatedMessages);
        }

        // Only make AI call if shouldHandleAICall is true
        if (shouldHandleAICall && systemPrompt) {
            logger.debug('Making AI call with system prompt:', systemPrompt);
            try {
                setIsLoading(true);
                const aiResponse = await analyzeWithOpenAI(
                    [
                        { role: 'system', content: systemPrompt },
                        ...updatedMessages.map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    ],
                    false
                );

                if (aiResponse) {
                    const assistantMessage: Message = {
                        role: 'assistant',
                        content: aiResponse
                    };
                    const newMessages = [...updatedMessages, assistantMessage];
                    setMessages(newMessages);
                    if (onMessagesUpdate) {
                        onMessagesUpdate(newMessages);
                    }
                    // Lancer la mise à jour du résumé de manière indépendante
                    updateSummaryIfNeeded(newMessages).catch(error => {
                        console.error('Error updating summary:', error);
                    });
                }
            } catch (error) {
                console.error('Error getting AI response:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        
        // Ajuster la hauteur avec une hauteur minimale
        const textarea = e.target;
        const minHeight = 50; // hauteur minimale en pixels
        
        // Réinitialiser la hauteur pour obtenir la hauteur du contenu
        textarea.style.height = 'auto';
        
        // Définir la nouvelle hauteur en respectant la hauteur minimale
        const newHeight = Math.max(textarea.scrollHeight, minHeight);
        textarea.style.height = `${newHeight}px`;
    };

    const formatMessage = (content: any): React.ReactNode => {
        const ensureString = (value: any): string => {
            if (typeof value === 'string') return value;
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value || '');
        };

        const stringContent = ensureString(content);
        return stringContent.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                {i !== stringContent.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <div ref={componentRef} className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
            <div className="flex-1 rounded-lg p-4 flex flex-col">
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto mb-4 space-y-4"
                    style={{ maxHeight: '600px' }}
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${message.role === 'assistant'
                                    ? 'bg-indigo-100 text-gray-800 text-left'
                                    : 'bg-blue-600 text-white text-left'
                                    }`}
                                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                            >
                                {message.isLoading ? (
                                    isSparkConfig ? <LoadingDonut /> : <LoadingDots />
                                ) : (
                                    formatMessage(message.content)
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && !messages.some(m => m.isLoading) && (
                        <div className="flex justify-start">
                            <div className={`${isSparkConfig ? 'bg-indigo-100' : 'bg-gray-100'} text-gray-800 p-3 rounded-lg`}>
                                {isSparkConfig ? <LoadingDonut /> : <LoadingDots />}
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <div className="relative flex-grow">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 pr-10"
                            placeholder="Tapez votre message..."
                            disabled={isLoading}
                            rows={2}
                            style={{ overflow: 'hidden' }}
                        />
                        <button
                            type="submit"
                            className={`absolute right-2 bottom-4 p-2 rounded-full ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                            disabled={isLoading}
                        >
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>

            {!hideSummary && (
                <div ref={summaryContainerRef} className="lg:w-80">
                    <DocumentSummary 
                        template={template}
                        summary={documentSummary}
                        onConnect={onConnect}
                        hasUserMessage={messages.some(m => m.role === 'user')}
                        isLoading={isSummaryLoading}
                    />
                </div>
            )}
        </div>
    );
}