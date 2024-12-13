import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { analyzeWithOpenAI } from '../services/openai';
import { ProblemSummary } from './ProblemSummary';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AIChatInterfaceProps {
    initialProblem: string;
    onConnect: () => void;
    messages?: Message[];
    onMessagesUpdate?: (messages: Message[]) => void;
}

interface ProblemDetails {
    challenge?: string;
    currentSituation?: string;
    desiredOutcome?: string;
    constraints?: string;
    additionalInfo?: string;
}

export function AIChatInterface({ initialProblem, onConnect, messages: externalMessages, onMessagesUpdate }: AIChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(externalMessages || []);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [problemSummary, setProblemSummary] = useState<ProblemDetails>({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Add ref for scrolling
    const chatContainerRef = React.useRef<HTMLDivElement>(null);
    const summaryContainerRef = React.useRef<HTMLDivElement>(null);
    const componentRef = React.useRef<HTMLDivElement>(null);

    // Initial analysis of the problem
    useEffect(() => {
        const analyzeInitialProblem = async () => {
            if (isInitialized || !initialProblem) return;

            setIsLoading(true);
            setIsInitialized(true);

            try {
                // Add the initial problem to messages
                const initialMessages: Message[] = [{ role: 'user', content: initialProblem }];
                setMessages(initialMessages);

                const aiResponse = await analyzeWithOpenAI([
                    {
                        role: 'user',
                        content: initialProblem
                    }
                ], false);

                if (aiResponse) {
                    const updatedMessages: Message[] = [...initialMessages, { role: 'assistant', content: aiResponse }];
                    setMessages(updatedMessages);

                    // Get initial summary
                    const summaryResponse = await analyzeWithOpenAI(
                        updatedMessages.map((msg): Message => ({
                            role: msg.role,
                            content: msg.content
                        })),
                        true // Get summary response
                    );

                    if (summaryResponse) {
                        try {
                            const parsedSummary = JSON.parse(summaryResponse);
                            setProblemSummary(parsedSummary);
                        } catch (e) {
                            console.error('Failed to parse summary JSON:', e);
                            setProblemSummary({
                                challenge: initialProblem,
                                currentSituation: "",
                                desiredOutcome: "",
                                constraints: "",
                                additionalInfo: ""
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error analyzing initial problem:', error);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "I apologize, but I'm having trouble connecting. Please try again."
                }]);
            }
            setIsLoading(false);
        };

        analyzeInitialProblem();
    }, [initialProblem, isInitialized]);

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

    useEffect(() => {
        if (initialProblem && messages.length === 0) {
            setMessages([{ role: 'user', content: initialProblem }]);
        }
    }, [initialProblem]);

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
                updatedMessages.map((msg): Message => ({
                    role: msg.role,
                    content: msg.content
                })),
                false // regular chat response
            );

            if (aiResponse) {
                const newMessages: Message[] = [...updatedMessages, { role: 'assistant', content: aiResponse }];
                setMessages(newMessages);

                // Update summary after each interaction
                const summaryResponse = await analyzeWithOpenAI(
                    newMessages.map((msg): Message => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    true // summary response
                );

                if (summaryResponse) {
                    try {
                        const parsedSummary = JSON.parse(summaryResponse);
                        setProblemSummary(parsedSummary);
                    } catch (e) {
                        console.error('Failed to parse summary JSON:', e);
                    }
                }
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

    return (
        <div ref={componentRef} className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
            <div className="flex-1 bg-white rounded-lg shadow-lg p-4 flex flex-col">
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
                                    ? 'bg-gray-100 text-gray-800 text-left'
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
                <ProblemSummary summary={problemSummary} onConnect={onConnect} />
            </div>
        </div>
    );
}