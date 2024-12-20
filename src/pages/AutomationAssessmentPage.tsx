import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { CHAT_CONFIGS } from '../types/chat';

export function AutomationAssessmentPage() {
    const [showChat, setShowChat] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);

    const handleChatClose = () => {
        setShowChat(false);
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {showChat && (
                <div className="fixed inset-0 bg-white">
                    <div className="h-full flex flex-col">
                        <div className="border-b border-gray-200">
                            <div className="max-w-6xl mx-auto px-4 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-blue-600" />
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {CHAT_CONFIGS.automation_assessment.title}
                                        </h2>
                                    </div>
                                    <button 
                                        onClick={handleChatClose}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {CHAT_CONFIGS.automation_assessment.subtitle}
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <div className="max-w-6xl mx-auto px-4 py-6">
                                <AIChatInterface
                                    config={CHAT_CONFIGS.automation_assessment}
                                    messages={messages}
                                    onMessagesUpdate={setMessages}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 