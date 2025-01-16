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

// Dynamic type that creates a summary type based on a DocumentTemplate's fields
type DocumentSummaryFromTemplate<T extends DocumentTemplate> = {
    [K in T['fields'][number]['key']]: T['fields'][number]['type'] extends 'list' 
        ? string[] 
        : T['fields'][number]['type'] extends 'boolean'
            ? boolean
            : string;
} & {
    hasEnoughData: boolean;
};

// The DocumentSummary type is now a union of all possible template field combinations
export type DocumentSummary = {
    [K: string]: string | string[] | boolean;
    hasEnoughData: boolean;
}; 