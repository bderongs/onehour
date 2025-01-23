import { DocumentTemplate } from '../types/chat';
import { Spark } from '../types/spark';

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

Posez des questions pertinentes pour comprendre :
${fieldDescriptions}`;

    if (currentSpark) {
        const editableFields = getEditableFields();
        const currentContent = editableFields
            .map(field => `${template.fields.find(f => f.key === field)?.label}: ${formatFieldValue(currentSpark[field])}`)
            .join('\n');

        prompt += `

Voici le contenu actuel du Spark que nous allons améliorer :

${currentContent}

Aidez le consultant à améliorer ce contenu en :
1. Rendant les descriptions plus impactantes et orientées bénéfices clients
2. Structurant mieux la méthodologie pour la rendre plus claire
3. Affinant le ciblage et les prérequis
4. Enrichissant les livrables et les prochaines étapes
5. Gardant une cohérence globale dans la proposition

Commencez par analyser le contenu actuel et suggérer des améliorations.`;
    }

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
    return `Vous êtes un assistant spécialisé dans l'édition de Sparks.
Votre rôle est d'aider les consultants à améliorer leur Spark en fonction de leurs demandes.

Voici le contenu actuel du Spark :
${Object.entries(spark)
    .filter(([key]) => key !== 'id' && key !== 'url' && key !== 'consultant' && key !== 'prefillText')
    .map(([key, value]) => `${key}: ${formatFieldValue(value)}`)
    .join('\n')}

Instructions importantes :
1. Écoutez attentivement la demande de modification du consultant
2. Ne modifiez que les champs concernés par la demande
3. Conservez les valeurs existantes pour tous les autres champs
4. Assurez-vous que les modifications restent cohérentes avec l'ensemble du Spark
5. Respectez le format et la structure des données existantes

Votre réponse doit suivre ce format exact :
{
    "reply": "Votre réponse conversationnelle expliquant les modifications apportées",
    "document": {
        // Le Spark mis à jour avec uniquement les champs modifiés
    }
}`;
}

export function generateSparkCreatePrompt(): string {
    return `Je suis un assistant spécialisé dans la création de Sparks. Je vais vous aider à créer un nouveau Spark en vous posant des questions pertinentes et en structurant vos réponses.

Un Spark est une offre de consultation courte et ciblée qui aide à résoudre un problème spécifique. Voici les éléments clés d'un Spark :

- Titre : Un titre clair et accrocheur qui décrit l'offre
- Description : Un résumé concis de ce que le Spark propose
- Description détaillée : Une explication approfondie de l'offre
- Durée : Le temps nécessaire pour réaliser le Spark (en minutes)
- Prix : Le coût du Spark (en euros)
- Méthodologie : Les étapes pour réaliser le Spark
- Public cible : À qui s'adresse ce Spark
- Prérequis : Ce qui est nécessaire avant de commencer
- Livrables : Ce que le client obtient
- Prochaines étapes : Ce qui peut être fait après le Spark

Comment puis-je vous aider à créer votre Spark aujourd'hui ?`;
} 