import React from 'react';
import { AIChatInterface } from '../components/AIChatInterface';
import { useLocation, useNavigate } from 'react-router-dom';

export function ChatPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialProblem = location.state?.problem || '';

    const handleConnect = () => {
        navigate('/connect');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <AIChatInterface
                    initialProblem={initialProblem}
                    onConnect={handleConnect}
                />
            </div>
        </div>
    );
} 