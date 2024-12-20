import React from 'react';
import { AIChatInterface } from '../components/AIChatInterface';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatConfig } from '../types/chat';

export function ChatPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialProblem = location.state?.problem || '';

    const handleConnect = () => {
        navigate('/connect');
    };

    const chatConfig: ChatConfig = {
        initialMessage: {
            role: 'assistant',
            content: initialProblem || "Bonjour ! Comment puis-je vous aider ?"
        },
        systemPrompt: `You are a helpful assistant.
            Guide the conversation to understand the user's needs.
            Keep responses focused and clear.`,
        title: "Assistant",
        subtitle: "Je suis là pour vous aider",
        onConnect: handleConnect
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <AIChatInterface
                    config={chatConfig}
                />
            </div>
        </div>
    );
} 