import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { analyzeWithOpenAI } from '../services/openai';
import { ProblemSummary } from './ProblemSummary';

interface Message {
    content: string;
    isAi: boolean;
}

interface AIChatInterfaceProps {
    initialProblem: string;
}

interface ProblemDetails {
    challenge?: string;
    currentSituation?: string;
    desiredOutcome?: string;
    constraints?: string[];
    additionalInfo?: string[];
}

export function AIChatInterface({ initialProblem }: AIChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [problemSummary, setProblemSummary] = useState<ProblemDetails>({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial analysis of the problem
    useEffect(() => {
        const analyzeInitialProblem = async () => {
            if (isInitialized || !initialProblem) return;

            setIsLoading(true);
            setIsInitialized(true);

            try {
                // Add the initial problem to messages
                const initialMessages = [{ content: initialProblem, isAi: false }];
                setMessages(initialMessages);

                const aiResponse = await analyzeWithOpenAI([
                    {
                        role: 'user',
                        content: initialProblem
                    }
                ], false);

                if (aiResponse) {
                    const updatedMessages = [...initialMessages, { content: aiResponse, isAi: true }];
                    setMessages(updatedMessages);

                    // Get initial summary
                    const summaryResponse = await analyzeWithOpenAI(
                        updatedMessages.map(msg => ({
                            role: msg.isAi ? 'assistant' : 'user',
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
                                constraints: [],
                                additionalInfo: []
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error analyzing initial problem:', error);
                setMessages(prev => [...prev, {
                    content: "I apologize, but I'm having trouble connecting. Please try again.",
                    isAi: true
                }]);
            }
            setIsLoading(false);
        };

        analyzeInitialProblem();
    }, [initialProblem, isInitialized]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isLoading) return;

        const userMessage = newMessage.trim();
        setMessages(prev => [...prev, { content: userMessage, isAi: false }]);
        setNewMessage('');
        setIsLoading(true);

        try {
            const updatedMessages = [...messages, { content: userMessage, isAi: false }];
            const aiResponse = await analyzeWithOpenAI(
                updatedMessages.map(msg => ({
                    role: msg.isAi ? 'assistant' : 'user',
                    content: msg.content
                })),
                false // regular chat response
            );

            if (aiResponse) {
                const newMessages = [...updatedMessages, { content: aiResponse, isAi: true }];
                setMessages(newMessages);

                // Update summary after each interaction
                const summaryResponse = await analyzeWithOpenAI(
                    newMessages.map(msg => ({
                        role: msg.isAi ? 'assistant' : 'user',
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
                content: "I apologize, but I'm having trouble connecting. Please try again.",
                isAi: true
            }]);
        }

        setIsLoading(false);
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
        <div className="flex gap-6">
            <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
                <div className="h-96 overflow-y-auto mb-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.isAi ? 'justify-start' : 'justify-end'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${message.isAi
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-blue-600 text-white'
                                    }`}
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

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`p-2 rounded-lg ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                        disabled={isLoading}
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>

            <div className="w-80">
                <ProblemSummary summary={problemSummary} />
            </div>
        </div>
    );
} 