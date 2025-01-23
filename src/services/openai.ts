import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { Spark } from '../types/spark';

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
        const completion = await openai.chat.completions.create({
            messages,
            model: 'gpt-4',
            temperature: 0.7,
            function_call: { name: 'edit_spark' },
            functions: [
                {
                    name: 'edit_spark',
                    description: 'Edit a Spark based on user request',
                    parameters: {
                        type: 'object',
                        properties: {
                            reply: {
                                type: 'string',
                                description: 'The conversational response to the user explaining the changes'
                            },
                            document: {
                                type: 'object',
                                description: 'The updated Spark fields',
                                properties: {
                                    title: { type: 'string', description: 'Title of the Spark' },
                                    description: { type: 'string', description: 'Short description of the Spark' },
                                    duration: { type: 'string', description: 'Duration of the Spark (e.g., "01:00:00")' },
                                    price: { type: 'string', description: 'Price of the Spark' },
                                    benefits: { 
                                        type: 'array', 
                                        items: { type: 'string' },
                                        description: 'List of benefits'
                                    },
                                    highlight: { 
                                        type: 'string', 
                                        description: 'Highlight tag for the Spark (maximum 2 words)',
                                        pattern: '^(?:\\S+\\s?){1,2}$'
                                    },
                                    detailedDescription: { type: 'string', description: 'Detailed description of the Spark' },
                                    methodology: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'List of methodology steps'
                                    },
                                    targetAudience: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'List of target audience profiles'
                                    },
                                    prerequisites: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'List of prerequisites'
                                    },
                                    deliverables: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'List of deliverables'
                                    },
                                    expertProfile: {
                                        type: 'object',
                                        description: 'Expert profile information',
                                        properties: {
                                            expertise: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                description: 'List of expertise areas'
                                            },
                                            experience: {
                                                type: 'string',
                                                description: 'Experience description'
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
                                        description: 'List of FAQ items'
                                    },
                                    testimonials: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                text: { type: 'string' },
                                                author: { type: 'string' },
                                                company: { type: 'string' },
                                                role: { type: 'string' }
                                            },
                                            required: ['text', 'author']
                                        },
                                        description: 'List of testimonials'
                                    },
                                    nextSteps: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        description: 'List of next steps'
                                    }
                                }
                            }
                        },
                        required: ['reply', 'document']
                    }
                }
            ]
        });

        const functionCall = completion.choices[0].message.function_call;
        if (!functionCall || !functionCall.arguments) {
            throw new Error('No function call in response');
        }

        // Parse the response and ensure it matches our type
        const response: SparkEditResponse = JSON.parse(functionCall.arguments);
        
        console.log('AI Edit Response:', response);
        
        return response;
    } catch (error) {
        console.error('OpenAI API Error:', error);
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
        const formattedMessages: ChatCompletionMessageParam[] = messages;

        const completion = await openai.chat.completions.create({
            messages: formattedMessages,
            model: 'gpt-4',
            temperature: isSummaryMode ? 0 : 0.7, // Use temperature 0 for more consistent JSON
        });

        let response = completion.choices[0].message.content || '';

        // Log the AI response to the console
        console.log('AI Response:', response);

        return response;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return isSummaryMode ? 
            JSON.stringify({}) : 
            "I apologize, but I'm having trouble connecting. Please try again.";
    }
}