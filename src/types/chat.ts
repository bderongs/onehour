import { Message } from '../components/AIChatInterface';

export type ChatUseCase = 'consultant_qualification' | 'automation_assessment';

export interface ChatConfig {
    initialMessage: Message;
    systemPrompt: string;
    title: string;
    subtitle: string;
    onConnect: () => void;
    summaryInstructions?: string;
    submitMessage: string;
}

export const CHAT_CONFIGS: Record<ChatUseCase, ChatConfig> = {
    consultant_qualification: {
        initialMessage: {
            role: 'assistant',
            content: "Bonjour ! Je suis l'assistant virtuel d'Arnaud. Mon rôle est de vous aider à clarifier votre brief avant votre échange avec lui. Plus je comprends précisément votre besoin, plus Arnaud pourra préparer des solutions pertinentes. Pouvez-vous me parler de votre projet ?"
        },
        systemPrompt: `You are Arnaud's AI assistant.
            Your primary role is to help clarify the client's brief before their interaction with Arnaud.
            Guide the conversation to gather comprehensive information that will help Arnaud prepare relevant solutions.
            
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

            Do not suggest solutions - that's Arnaud's role.
            When you have gathered sufficient information, explain that you'll pass this detailed brief to Arnaud. No need to suggest a meeting as this is taken care of in the next step.`,
        title: "Assistant virtuel d'Arnaud",
        subtitle: "Je vous aide à préparer votre brief pour Arnaud",
        onConnect: () => {
            console.log("Connecting to consultant...");
        },
        summaryInstructions: `Analyze the conversation and create a JSON summary with the following structure.
        IMPORTANT: The summary must be in the same language as the conversation (French if the conversation is in French).
        IMPORTANT: Do not return any other output than the JSON with all fields filled.
        IMPORTANT: The readyForAssessment field must be a boolean (true/false), not a string.
        
        {
            "challenge": "Brief description of the main challenge or project",
            "currentSituation": "Current state and context",
            "desiredOutcome": "Desired outcomes and success criteria",
            "constraints": "Budget, timeline, and technical constraints",
            "stakeholders": "Key stakeholders involved",
            "previousAttempts": "Previous solutions or attempts",
            "readyForAssessment": true or false (boolean, not string). Set to true only when we have:
                - Clear challenge description
                - Current situation details
                - Desired outcome
                - Some constraints (budget/timeline)
        }

        Example in French:
        {
            "challenge": "Transformation digitale du service client",
            "currentSituation": "Processus manuel, temps de réponse long",
            "desiredOutcome": "Automatisation partielle, réduction des délais",
            "constraints": "Budget 50k€, déploiement sous 3 mois",
            "stakeholders": "Équipe support client, DSI",
            "previousAttempts": "Test d'un chatbot basique en 2022",
            "readyForAssessment": true
        }
        
        IMPORTANT: Make sure readyForAssessment is a boolean value (true/false), not a string ("true"/"false").`
    },
    automation_assessment: {
        initialMessage: {
            role: 'assistant',
            content: "Bonjour ! Je suis là pour vous aider à évaluer vos besoins en automatisation. Pouvez-vous me parler des processus que vous souhaitez optimiser ?"
        },
        systemPrompt: `You are an automation expert.
            Your job is to understand the user's automation needs and assess the complexity and feasibility.
            Ask specific questions about:
            1) Current manual processes
            2) Volume and frequency of tasks
            3) Tools and systems currently in use
            4) Integration requirements
            5) Expected ROI and timeline

            Keep responses focused on gathering information.
            Don't provide specific technical solutions yet.
            When you have enough information, suggest scheduling a technical assessment.`,
        title: "Assistant Automatisation",
        subtitle: "Je vous aide à identifier vos opportunités d'automatisation",
        onConnect: () => {
            console.log("Scheduling automation assessment...");
        },
        summaryInstructions: `Analyze the conversation and create a JSON summary with the following structure:
        {
            "processes": "List of processes to automate",
            "currentTools": "Current tools and systems",
            "volume": "Task volume and frequency",
            "constraints": "Technical or business constraints",
            "expectedBenefits": "Expected benefits and ROI",
            "complexity": "Estimated complexity (LOW, MEDIUM, HIGH)",
            "readyForAssessment": Boolean
        }`
    }
}; 