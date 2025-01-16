import { DocumentTemplate } from '../types/chat';

/**
 * Generates a system prompt for the AI based on the document template and role description.
 * The prompt includes the role description and a list of fields to understand.
 */
export function generateSystemPrompt(template: DocumentTemplate, roleDescription: string): string {
    const fieldDescriptions = template.fields
        .map(field => `- ${field.label}: ${field.description}`)
        .join('\n');

    return `${roleDescription}

Posez des questions pertinentes pour comprendre :
${fieldDescriptions}

Posez une question à la fois.
Une fois que vous avez suffisamment d'informations, confirmez que vous avez bien compris le besoin en le résumant.`;
}

/**
 * Generates instructions for the AI to create a JSON summary based on the document template.
 * The instructions include the exact format the JSON should follow, using the template's fields.
 */
export function generateSummaryInstructions(template: DocumentTemplate): string {
    const jsonFormat = template.fields.reduce((acc, field) => {
        acc[field.key] = field.description || field.label;
        return acc;
    }, {} as Record<string, string>);
    jsonFormat.hasEnoughData = "boolean indiquant si nous avons suffisamment d'informations";

    return `Analysez la conversation et créez un résumé JSON des informations.
Le JSON doit suivre exactement ce format:
${JSON.stringify(jsonFormat, null, 4)}`;
} 