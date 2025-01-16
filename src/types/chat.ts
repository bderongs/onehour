import { Message } from '../components/AIChatInterface';

export type ChatUseCase = 'consultant_qualification' | 'automation_assessment' | 'spark_finder';

export interface ChatConfig {
    initialMessage: Message;
    title: string;
    subtitle: string;
    roleDescription: string;
    systemPrompt: string;
    summaryInstructions: string;
    submitMessage: string;
    confirmationMessage: string;
    onConnect: () => void;
}

export interface DocumentTemplate {
    id: string;
    name: string;
    fields: DocumentField[];
    placeholderMessage?: string;
    continueConversationMessage?: string;
    documentCompleteMessage?: string;
}

export interface DocumentField {
    key: string;
    label: string;
    description?: string;
    required: boolean;
    type: 'text' | 'list' | 'boolean';
    validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
    };
}

export interface SparkFinderSummary {
    challenge: string;
    context: string;
    urgency: string;
    domain: string;
    expectations: string;
    hasEnoughData: boolean;
}

export interface ConsultantQualificationSummary {
    challenge: string;
    currentSituation: string;
    desiredOutcome: string;
    constraints: string;
    stakeholders: string;
    previousAttempts: string;
    hasEnoughData: boolean;
}

export interface AutomationAssessmentSummary {
    processes: string[];
    currentTools: string;
    volume: string;
    constraints: string;
    expectedBenefits: string;
    complexity: string;
    hasEnoughData: boolean;
}

export type DocumentSummary = SparkFinderSummary | ConsultantQualificationSummary | AutomationAssessmentSummary; 