import { DocumentTemplate } from '../types/chat';
import { Spark } from '../types/spark';
import { DOCUMENT_TEMPLATES } from '../data/documentTemplates';
import { CHAT_CONFIGS } from '../data/chatConfigs';

// Helper function to format a field value for display
function formatFieldValue(value: any): string {
    if (!value) return 'Non défini';
    
    if (Array.isArray(value)) {
        return value.map(item => {
            if (typeof item === 'object') {
                if ('text' in item && 'author' in item) { // Testimonial
                    return `${item.text} - ${item.author}${item.role ? ` (${item.role})` : ''}${item.company ? ` @ ${item.company}` : ''}`;
                }
                if ('question' in item && 'answer' in item) { // FAQ
                    return `Q: ${item.question}\nR: ${item.answer}`;
                }
            }
            return item.toString();
        }).join('\n- ');
    }
    
    if (typeof value === 'object' && value !== null) {
        if ('expertise' in value && 'experience' in value) { // ExpertProfile
            return `Expertise: ${value.expertise.join(', ')}\nExpérience: ${value.experience}`;
        }
        return JSON.stringify(value, null, 2);
    }
    
    return value.toString();
}


// Helper function to get editable fields from a Spark
function getEditableFields(): (keyof Spark)[] {
    return [
        'title',
        'description',
        'duration',
        'price',
        'benefits',
        'highlight',
        'detailedDescription',
        'methodology',
        'targetAudience',
        'prerequisites',
        'deliverables',
        'expertProfile',
        'faq',
        'testimonials',
        'nextSteps'
    ];
}

/**
 * Generates a system prompt for the AI based on the document template and role description.
 * The prompt includes the role description and a list of fields to understand.
 */
export function generateSystemPrompt(template: DocumentTemplate, roleDescription: string, currentSpark?: Spark): string {
    const fieldDescriptions = template.fields
        .map(field => `- ${field.label}: ${field.description}`)
        .join('\n');

    let prompt = `${roleDescription}

Voici les champs à remplir :
${fieldDescriptions}`;

    // Always include current spark content, even if it's empty
    const editableFields = getEditableFields();
    const currentContent = editableFields
        .map(field => `${template.fields.find(f => f.key === field)?.label}: ${formatFieldValue(currentSpark?.[field])}`)
        .join('\n');

    prompt += `

Voici le contenu actuel du Spark :

${currentContent}

Aidez le consultant à améliorer ce contenu en :
1. Rendant les descriptions plus impactantes et orientées bénéfices clients
2. Structurant mieux la méthodologie pour la rendre plus claire
3. Affinant le ciblage et les prérequis
4. Enrichissant les livrables et les prochaines étapes
5. Gardant une cohérence globale dans la proposition`;

    prompt += `

Instructions importantes :
1. Écoutez attentivement la demande du consultant
2. Ne modifiez que les champs concernés par la demande
3. Ne retournez pas les champs non modifiés
4. Assurez-vous que les modifications restent cohérentes avec l'ensemble du Spark
5. Respectez le format et la structure des données existantes
6. Le champ "highlight" (tag) ne doit JAMAIS dépasser 2 mots. Si l'utilisateur demande plus de 2 mots, expliquez-lui la limitation et suggérez une version courte en 2 mots maximum.
7. Le titre ne doit JAMAIS contenir d'indication de durée ou de prix. Ces informations doivent être dans leurs champs respectifs uniquement.
8. La durée doit être EXACTEMENT une des valeurs suivantes : 15, 30, 45, 60, 90 ou 120 minutes. Aucune autre durée n'est acceptée.
9. La méthodologie doit être une liste de 2 à 4 étapes maximum. Propose une méthodologie en 3 étapes, sauf demande de l'utilisateur pour une étape supplémentaire.`;

    return prompt;
}

/**
 * Generates instructions for the AI to create a JSON summary based on the document template.
 * The instructions include the exact format the JSON should follow, using the template's fields.
 */
export function generateSummaryInstructions(template: DocumentTemplate, currentSpark?: Spark): string {
    const jsonFormat = template.fields.reduce((acc, field) => {
        acc[field.key] = field.description || field.label;
        return acc;
    }, {} as Record<string, string>);
    jsonFormat.hasEnoughData = "boolean indiquant si nous avons suffisamment d'informations";

    let instructions = `Analysez la conversation et créez un résumé JSON des informations, dans la langue de la conversation.
Le JSON doit suivre exactement ce format:
${JSON.stringify(jsonFormat, null, 4)}`;

    if (currentSpark) {
        const editableFields = getEditableFields();
        const currentValues = editableFields.reduce((acc, field) => {
            const value = currentSpark[field];
            if (value !== undefined) {
                acc[field] = value;
            }
            return acc;
        }, {} as Record<string, any>);

        instructions += `

Utilisez le contenu actuel du Spark comme base et intégrez les améliorations discutées dans la conversation.
Ne remplacez les valeurs existantes que si de meilleures alternatives ont été proposées et validées dans la conversation.

Contenu actuel :
${JSON.stringify(currentValues, null, 4)}`;
    }

    return instructions;
}

/**
 * Generates a prompt specifically for editing a Spark based on user input.
 * This prompt is focused on making precise updates to the Spark content.
 */
export function generateSparkEditPrompt(spark: Spark): string {
    return generateSystemPrompt(DOCUMENT_TEMPLATES.spark_content_assistant, CHAT_CONFIGS.spark_content_editor.roleDescription, spark);
}

export function generateSparkCreatePrompt(spark?: Spark): string {
    return generateSystemPrompt(DOCUMENT_TEMPLATES.spark_content_assistant, CHAT_CONFIGS.spark_content_creator.roleDescription, spark);
} 