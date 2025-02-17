import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { Spark } from '../types/spark';
import logger from '../utils/logger';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

// Type for the Spark edit response
type SparkEditResponse = {
    reply: string;
    document: Partial<Spark>;
};

/**
 * Specialized function for editing Sparks using OpenAI's function calling
 * This ensures we always get a properly formatted response
 */
export async function editSparkWithAI(
    messages: { role: 'user' | 'assistant' | 'system', content: string }[]
): Promise<SparkEditResponse> {
    try {
        logger.info('Sending editSparkWithAI request to OpenAI:', {
            messageCount: messages.length,
            model: 'gpt-4',
            functionCall: 'edit_spark',
            messages: messages.map(m => ({
                role: m.role,
                content: m.content,
            }))
        });

        const completion = await openai.chat.completions.create({
            messages,
            model: 'gpt-4',
            temperature: 0.7,
            function_call: { name: 'edit_spark' },
            functions: [
                {
                    name: 'edit_spark',
                    description: 'Modifier un Spark selon la demande de l\'utilisateur',
                    parameters: {
                        type: 'object',
                        properties: {
                            reply: {
                                type: 'string',
                                description: 'La réponse conversationnelle à l\'utilisateur'
                            },
                            document: {
                                type: 'object',
                                description: 'Les champs mis à jour du Spark',
                                properties: {
                                    title: { 
                                        type: 'string', 
                                        description: 'Titre du Spark',
                                        pattern: '^(?!.*(?:\\d+\\s*(?:min|minute|heure|h|hr)s?|\\d+\\s*(?:€|euro|eur)s?|gratuit|offert)).*$'
                                    },
                                    description: { type: 'string', description: 'Description courte du Spark' },
                                    duration: { 
                                        type: 'string', 
                                        description: 'Durée du Spark en minutes. Doit être une des valeurs suivantes : 15, 30, 45, 60, 90, ou 120',
                                        enum: ['15', '30', '45', '60', '90', '120']
                                    },
                                    price: { type: 'string', description: 'Prix du Spark' },
                                    benefits: { 
                                        type: 'array', 
                                        items: { type: 'string' },
                                        description: 'Liste des bénéfices'
                                    },
                                    detailedDescription: { type: 'string', description: 'Description détaillée du Spark' },
                                    methodology: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'Liste des étapes de la méthodologie'
                                    },
                                    targetAudience: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'Liste des profils cibles'
                                    },
                                    prerequisites: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'Liste des prérequis'
                                    },
                                    deliverables: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'Liste des livrables'
                                    },
                                    expertProfile: {
                                        type: 'object',
                                        description: 'Informations sur le profil expert',
                                        properties: {
                                            expertise: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                description: 'Liste des domaines d\'expertise'
                                            },
                                            experience: {
                                                type: 'string',
                                                description: 'Description de l\'expérience'
                                            }
                                        },
                                        required: ['expertise', 'experience']
                                    },
                                    faq: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                question: { type: 'string' },
                                                answer: { type: 'string' }
                                            },
                                            required: ['question', 'answer']
                                        },
                                        description: 'Liste des questions fréquentes'
                                    },
                                    nextSteps: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'Liste des prochaines étapes'
                                    }
                                }
                            }
                        },
                        required: ['reply', 'document']
                    }
                }
            ]
        });

        logger.info('Received editSparkWithAI response from OpenAI:', {
            status: 'success',
            functionCall: completion.choices[0].message.function_call?.name,
            functionArguments: completion.choices[0].message.function_call?.arguments,
            assistantMessage: completion.choices[0].message.content,
            usage: completion.usage
        });

        const functionCall = completion.choices[0].message.function_call;
        if (!functionCall || !functionCall.arguments) {
            logger.error('No function call in OpenAI response');
            throw new Error('No function call in response');
        }

        // Parse the response and ensure it matches our type
        const response: SparkEditResponse = JSON.parse(functionCall.arguments);
        
        // Additional validation for title
        if (response.document.title) {
            const durationPattern = /\b(\d+\s*(min|minute|heure|h|hr)s?\b)|(\b(une|deux|trois|quatre)\s*(min|minute|heure|h|hr)s?\b)/i;
            const pricePattern = /\b(\d+\s*(€|euro|eur)s?\b)|(\b(gratuit|offert)\b)/i;
            
            if (durationPattern.test(response.document.title) || pricePattern.test(response.document.title)) {
                logger.warn('Title contained duration or price information, removing title from update', {
                    invalidTitle: response.document.title
                });
                delete response.document.title;
                response.reply = `${response.reply}\n\nNote : Le titre proposé contenait des indications de durée ou de prix, il n'a donc pas été mis à jour. Ces informations doivent être dans leurs champs respectifs.`;
            }
        }
        
        return response;
    } catch (error) {
        logger.error('OpenAI API Error in editSparkWithAI:', {
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            stack: error instanceof Error ? error.stack : undefined
        });
        return {
            reply: "Je suis désolé, mais j'ai des difficultés à me connecter. Veuillez réessayer.",
            document: {}
        };
    }
}

// Keep the original function for other use cases
export async function analyzeWithOpenAI(
    messages: { role: 'user' | 'assistant' | 'system', content: string }[], 
    isSummaryMode: boolean = false
) {
    try {
        logger.info('Sending analyzeWithOpenAI request to OpenAI:', {
            messageCount: messages.length,
            model: 'gpt-4',
            temperature: isSummaryMode ? 0 : 0.7,
            isSummaryMode,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content,
            }))
        });

        const formattedMessages: ChatCompletionMessageParam[] = messages;

        const completion = await openai.chat.completions.create({
            messages: formattedMessages,
            model: 'gpt-4',
            temperature: isSummaryMode ? 0 : 0.7,
        });

        let response = completion.choices[0].message.content || '';

        logger.info('Received analyzeWithOpenAI response from OpenAI:', {
            status: 'success',
            responseLength: response.length,
            isSummaryMode,
            response: response,
            usage: completion.usage
        });

        return response;
    } catch (error) {
        logger.error('OpenAI API Error in analyzeWithOpenAI:', {
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            stack: error instanceof Error ? error.stack : undefined,
            isSummaryMode
        });
        return isSummaryMode ? 
            JSON.stringify({}) : 
            "I apologize, but I'm having trouble connecting. Please try again.";
    }
}