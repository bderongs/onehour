import React, { useState, useEffect } from 'react';
import { Bot, Users, Package2, Plus, Clock, Briefcase, Target, CheckCircle, MessageSquare, Calendar, Zap, ArrowRightCircle, Shield, Award, Star, Quote, Sparkles, ArrowRight, BadgeCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIChatInterface, Message } from '../components/AIChatInterface';
import { ConsultantConnect } from '../components/ConsultantConnect';
import { UseCaseForm } from '../components/UseCaseForm';
import { motion } from 'framer-motion';
import { ExpertCall } from '../types/expertCall';
import { SparksGrid } from '../components/SparksGrid';
import { expertCalls } from '../data/expertCalls';

interface UseCase {
    icon: React.ReactNode;
    title: string;
    description: string;
    prefillText: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export function LandingClients() {
    const navigate = useNavigate();
    const [problem, setProblem] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [showConnect, setShowConnect] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [scrollY, setScrollY] = useState(0);
    const [shouldReset, setShouldReset] = useState(false);
    const [problemSummary, setProblemSummary] = useState({
        challenge: '',
        currentSituation: '',
        desiredOutcome: '',
        constraints: '',
        stakeholders: '',
        previousAttempts: '',
        readyForAssessment: false
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(null);
    const [isChatExpanded, setIsChatExpanded] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (shouldReset) {
            setShouldReset(false);
        }
    }, [shouldReset]);

    useEffect(() => {
        // Always set the first Spark (index 0) to be expanded on load
        if (expandedCallIndex === null) {
            setExpandedCallIndex(0);
        }
    }, []);

    const useCases: UseCase[] = [
        {
            icon: <Package2 className="h-6 w-6" />,
            title: "Choisir un logiciel",
            description: "Sélectionnez les meilleurs logiciels pour votre activité.",
            prefillText: "Je cherche à choisir un logiciel pour mon entreprise. J'ai besoin d'aide pour comparer les solutions du marché et identifier celle qui correspond le mieux à mes besoins spécifiques."
        },
        {
            icon: <Bot className="h-6 w-6" />,
            title: "IA & Entreprise",
            description: "Automatisez vos processus avec l'IA et économisez des heures de travail manuel.",
            prefillText: "Je souhaite comprendre comment l'intelligence artificielle pourrait être utile dans mon entreprise. J'aimerais identifier les opportunités concrètes d'application et les bénéfices potentiels."
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Recrutement",
            description: "Sélectionnez les meilleurs candidats avec un expert du domaine.",
            prefillText: "Je dois recruter dans un domaine que je ne maîtrise pas et j'ai besoin d'un expert pour m'aider à évaluer les compétences des candidats lors des entretiens."
        },
        {
            icon: <Plus className="h-6 w-6" />,
            title: "Autre sujet",
            description: "J'ai une autre problématique.",
            prefillText: ""
        }
    ];

    const handleUseCaseClick = (prefillText: string) => {
        setProblem(prefillText);
        if (prefillText.trim()) {
            const initialMessages: Message[] = [{
                role: 'user',
                content: prefillText.trim()
            }];
            setMessages(initialMessages);
            setShowForm(false);
            setShowConnect(false);
            setIsChatExpanded(true);
        }
    };

    const handleSubmit = (e: React.FormEvent, message: string) => {
        e.preventDefault();
        if (message.trim()) {
            const initialMessages: Message[] = [{
                role: 'user',
                content: message.trim()
            }];
            setMessages(initialMessages);
            setShowForm(false);
            setShowConnect(false);
            setIsChatExpanded(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e, problem);
        }
    };

    const handleConnect = () => {
        console.log('LandingClients - handleConnect called, current summary:', problemSummary);
        setShowConnect(true);
    };

    const handleBack = (shouldReset?: boolean) => {
        if (shouldReset) {
            // Reset to initial state
            setShowForm(true);
            setShowConnect(false);
            setMessages([]);
            setShouldReset(true);
            setProblemSummary({
                challenge: '',
                currentSituation: '',
                desiredOutcome: '',
                constraints: '',
                stakeholders: '',
                previousAttempts: '',
                readyForAssessment: false
            });
            setProblem('');
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
                console.log('LandingClients - Found summary in message:', msg.summary);
                setProblemSummary(msg.summary);
                break;
            }
        }
    };

    const chatConfig = {
        initialMessage: {
            role: 'assistant' as const,
            content: "Bonjour ! Je suis l'assistant virtuel de Sparkier. Mon rôle est de vous aider à clarifier votre besoin avant de vous mettre en relation avec l'expert le plus pertinent. Plus je comprends précisément votre situation, plus nous pourrons vous proposer des solutions adaptées. Pouvez-vous me parler de votre projet ?"
        },
        systemPrompt: `You are Sparkier Consulting's AI assistant.
            Your primary role is to help clarify the client's needs before matching them with the most relevant expert.
            Guide the conversation to gather comprehensive information that will help identify the best consultant.
            
            When a user presents their initial problem:
            1) Acknowledge their need
            2) Ask specific follow-up questions about unclear aspects. Only one question at a time.
            3) Keep responses short and focused
            4) Ask one question at a time

            Focus on gathering details about:
            1) Current situation specifics
            2) Desired outcomes and success criteria
            3) Previous attempts or solutions tried
            4) Constraints (budget, timeline, technical limitations)
            5) Key stakeholders involved
            6) Decision-making process

            Do not suggest specific solutions - that's the expert's role.
            When you have gathered sufficient information, explain that you'll help match them with the most relevant expert. No need to suggest a meeting as this is taken care of in the next step.`,
        title: "Assistant Sparkier",
        subtitle: "Je vous aide à trouver l'expert idéal",
        onConnect: handleConnect,
        submitMessage: "En soumettant ce formulaire, vous serez contacté par l'un de nos consultants experts dans les prochaines 24 heures.",
        confirmationMessage: "Nous avons bien reçu votre demande. L'un de nos consultants experts vous contactera dans les prochaines 24 heures pour approfondir votre projet et vous proposer les solutions les plus adaptées.",
        summaryInstructions: `Analyze the conversation and create a JSON summary with the following structure.
        IMPORTANT: The summary must be in the same language as the conversation (French if the conversation is in French).
        IMPORTANT: Do not return any other output than the JSON with all fields filled.
        IMPORTANT: The readyForAssessment field must be a boolean (true/false), not a string.
        IMPORTANT: All fields must be filled with non-empty strings, except readyForAssessment which must be a boolean.
        
        {
            "challenge": "Brief description of the main challenge or project",
            "currentSituation": "Current state and context",
            "desiredOutcome": "Desired outcomes and success criteria",
            "constraints": "Budget, timeline, and technical constraints",
            "stakeholders": "Key stakeholders involved",
            "previousAttempts": "Previous solutions or attempts",
            "readyForAssessment": false
        }`
    };

    return (
        <div className="min-h-screen">
            {/* Rest of the component remains the same */}
            {/* ... existing code ... */}
        </div>
    );
} 