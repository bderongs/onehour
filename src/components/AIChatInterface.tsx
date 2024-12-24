import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { analyzeWithOpenAI } from '../services/openai';
import { ProblemSummary } from './ProblemSummary';
import { ChatConfig } from '../types/chat';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    summary?: any;
}

interface AIChatInterfaceProps {
    config: ChatConfig;
    messages?: Message[];
    onMessagesUpdate?: (messages: Message[]) => void;
}

export function AIChatInterface({ config, messages: externalMessages, onMessagesUpdate }: AIChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(externalMessages || [config.initialMessage]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [problemSummary, setProblemSummary] = useState<any>({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Add ref for scrolling
    const chatContainerRef = React.useRef<HTMLDivElement>(null);
    const summaryContainerRef = React.useRef<HTMLDivElement>(null);
    const componentRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Initial analysis of the problem
    useEffect(() => {
        const analyzeInitialMessage = async () => {
            if (isInitialized || !config.initialMessage) return;
            setIsInitialized(true);
        };

        analyzeInitialMessage();
    }, [config.initialMessage, isInitialized]);

    // Keep focus on textarea after sending message
    useEffect(() => {
        if (!isLoading && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isLoading]);

    // Function to get summary if needed
    const updateSummaryIfNeeded = async (messagesForSummary: Message[]) => {
        if (!config.summaryInstructions || !messagesForSummary.some(m => m.role === 'user')) return;

        console.log('AIChatInterface - Updating summary, messages:', messagesForSummary);

        try {
            const summaryResponse = await analyzeWithOpenAI(
                [
                    { role: 'system', content: config.summaryInstructions },
                    ...messagesForSummary.map((msg): Message => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    { 
                        role: 'user', 
                        content: 'Please analyze the conversation above and provide a JSON summary following the specified format.' 
                    }
                ],
                true // Use summary mode
            );

            if (summaryResponse) {
                try {
                    // Try to extract JSON if it's wrapped in other text
                    const jsonMatch = summaryResponse.match(/\{[\s\S]*\}/);
                    const jsonStr = jsonMatch ? jsonMatch[0] : summaryResponse;
                    
                    console.log('AIChatInterface - Raw summary response:', summaryResponse);
                    console.log('AIChatInterface - Extracted JSON:', jsonStr);
                    
                    const parsedSummary = JSON.parse(jsonStr);
                    console.log('AIChatInterface - Parsed summary:', parsedSummary);
                    
                    // Validate content fields and readyForAssessment
                    const requiredFields = [
                        'challenge',
                        'currentSituation',
                        'desiredOutcome',
                        'constraints',
                        'stakeholders',
                        'previousAttempts',
                        'readyForAssessment'
                    ];
                    const hasAllFields = requiredFields.every(field => {
                        if (field === 'readyForAssessment') {
                            return typeof parsedSummary[field] === 'boolean';
                        }
                        return field in parsedSummary && 
                               typeof parsedSummary[field] === 'string' && 
                               parsedSummary[field].trim() !== '';
                    });
                    
                    if (hasAllFields) {
                        console.log('AIChatInterface - Setting valid summary:', parsedSummary);
                        setProblemSummary(parsedSummary);
                        if (onMessagesUpdate) {
                            // Create a new message that includes the summary
                            const messagesWithSummary = [...messagesForSummary];
                            const lastMessage = messagesWithSummary[messagesWithSummary.length - 1];
                            if (lastMessage && lastMessage.role === 'assistant') {
                                // Append the summary to the last assistant message
                                lastMessage.summary = parsedSummary;
                            }
                            console.log('AIChatInterface - Calling onMessagesUpdate with messages and summary');
                            onMessagesUpdate(messagesWithSummary);
                        }
                    } else {
                        console.error('AIChatInterface - Summary missing required fields or has invalid values:', 
                            requiredFields.filter(field => {
                                if (field === 'readyForAssessment') {
                                    return typeof parsedSummary[field] !== 'boolean';
                                }
                                return !(field in parsedSummary && 
                                       typeof parsedSummary[field] === 'string' && 
                                       parsedSummary[field].trim() !== '');
                            })
                        );
                    }
                } catch (e) {
                    console.error('Failed to parse summary JSON:', e);
                }
            }
        } catch (error) {
            console.error('Error getting summary:', error);
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Scroll to top when component changes
    useEffect(() => {
        if (componentRef.current) {
            window.scrollTo({ top: componentRef.current.offsetTop, behavior: 'smooth' });
        }
    }, []);

    const updateMessages = (newMessages: Message[]) => {
        setMessages(newMessages);
        onMessagesUpdate?.(newMessages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isLoading) return;

        const userMessage = newMessage.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setNewMessage('');
        setIsLoading(true);

        try {
            const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
            const aiResponse = await analyzeWithOpenAI(
                [
                    { role: 'system', content: config.systemPrompt },
                    ...updatedMessages.map((msg): Message => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ],
                false // regular chat response
            );

            if (aiResponse) {
                const newMessages: Message[] = [...updatedMessages, { role: 'assistant', content: aiResponse }];
                updateMessages(newMessages);

                // Update summary after the response
                await updateSummaryIfNeeded(newMessages);
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I apologize, but I'm having trouble connecting. Please try again."
            }]);
        }
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
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

    // Handle initial AI response when external messages are provided
    useEffect(() => {
        const getInitialResponse = async () => {
            if (!externalMessages || externalMessages.length === 0 || isInitialized) return;
            
            // Don't respond if the last message is from the assistant
            if (externalMessages[externalMessages.length - 1].role === 'assistant') {
                setIsInitialized(true);
                return;
            }
            
            setIsLoading(true);
            try {
                const aiResponse = await analyzeWithOpenAI(
                    [
                        { role: 'system' as const, content: config.systemPrompt },
                        ...externalMessages.map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    ],
                    false
                );

                if (aiResponse) {
                    const updatedMessages: Message[] = [
                        ...externalMessages,
                        { role: 'assistant', content: aiResponse }
                    ];
                    updateMessages(updatedMessages);
                    await updateSummaryIfNeeded(updatedMessages);
                }
            } catch (error) {
                console.error('Error getting initial AI response:', error);
                const errorMessages: Message[] = [
                    ...externalMessages,
                    { role: 'assistant', content: "Je suis désolé, mais j'ai des difficultés à me connecter. Veuillez réessayer." }
                ];
                updateMessages(errorMessages);
            }
            setIsLoading(false);
            setIsInitialized(true);
        };

        getInitialResponse();
    }, [externalMessages, config.systemPrompt, isInitialized]);

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
                                {formatMessage(message.content)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <div className="relative flex-grow">
                        <textarea
                            ref={textareaRef}
                            value={newMessage}
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

            <div ref={summaryContainerRef} className="lg:w-80">
                <ProblemSummary 
                    summary={problemSummary} 
                    onConnect={config.onConnect}
                    hasUserMessage={messages.some(m => m.role === 'user')}
                />
            </div>
        </div>
    );
}