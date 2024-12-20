import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

function ensureString(response: any): string {
    if (typeof response === 'string') return response;
    if (typeof response === 'object') {
        try {
            const values = Object.values(response).filter(val => val !== undefined && val !== null);
            return values.join('. ');
        } catch {
            return String(response);
        }
    }
    return String(response);
}

export async function analyzeWithOpenAI(
    messages: { role: 'user' | 'assistant' | 'system', content: string }[], 
    summaryInstructions?: string | boolean
) {
    try {
        const systemMessage: ChatCompletionMessageParam = typeof summaryInstructions === 'string' ? {
            role: 'system',
            content: summaryInstructions
        } : summaryInstructions ? {
            role: 'system',
            content: `Analyze the conversation and create a JSON summary with the following structure:
{
    "challenge": "Brief description of main problem",
    "currentSituation": "Current state description",
    "desiredOutcome": "Goal description",
    "constraints": "Constraints",
    "additionalInfo": "Additional information",
    "hasSufficientInfo": Boolean: if there is enough information to select a relevant expert and send the query, return true, else return false. The query must at least include a challenge, current situation and desired outcome, as well as some budget and time constraint information.
}
IMPORTANT: Response must be valid JSON only, no additional text. Only include fields where information is known.`
        } : {
            role: 'system',
            content: `You are a business consultant.
            Your job is to clarify problems and get all the necessary information to pass it on to a senior consultant.
            When a user presents their initial problem, ask specific follow-up questions about unclear aspects.
            Don't ask for a general description if one is already provided.
            Keep responses short and focused. Don't ask more than one question at a time.

Focus on gathering missing details about:
1) Current situation specifics
2) Desired outcomes
3) Previous attempts to solve
4) Constraints (budget, timeline, etc)

Do not suggest solutions to the problem mentionned.
When all relevant informations have been obtained, politely close the conversation.

IMPORTANT: Always respond in plain text format only. Never return JSON, markdown, or other structured data in your response.`
        };

        const formattedMessages: ChatCompletionMessageParam[] = [
            systemMessage,
            ...messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        const completion = await openai.chat.completions.create({
            messages: formattedMessages,
            model: 'gpt-4o',
            temperature: typeof summaryInstructions === 'string' ? 0 : 0.7, // Use temperature 0 for more consistent JSON
        });

        let response = completion.choices[0].message.content || '';

        // Log the AI response to the console
        console.log('AI Response:', response);

        if (typeof summaryInstructions === 'string') {
            try {
                // Try to extract JSON if it's wrapped in other text
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : response;

                // Parse and validate the JSON
                const parsed = JSON.parse(jsonStr);

                // Only include fields that have content
                const formatted: any = {};
                const keys = ['challenge', 'currentSituation', 'desiredOutcome', 'constraints', 'additionalInfo', 'hasSufficientInfo'];
                keys.forEach(key => {
                    if (parsed[key]) {
                        formatted[key] = ensureString(parsed[key]);
                    }
                });

                return JSON.stringify(formatted);
            } catch (e) {
                console.error('Invalid JSON in summary response:', e);
                return JSON.stringify({});
            }
        } else {
            return ensureString(response);
        }
    } catch (error) {
        console.error('OpenAI API Error:', error);
        if (typeof summaryInstructions === 'string') {
            return JSON.stringify({});
        }
        return "I apologize, but I'm having trouble connecting. Please try again.";
    }
}