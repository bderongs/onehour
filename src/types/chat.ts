import { Message } from '../components/AIChatInterface';

export type ChatUseCase = 'consultant_qualification' | 'automation_assessment' | 'spark_finder';

export interface ChatConfig {
    initialMessage: Message;
    title: string;
    subtitle: string;
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

export interface DocumentSummary {
    [key: string]: string | boolean | string[];
    hasEnoughData: boolean;
} 