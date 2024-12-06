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

export async function analyzeWithOpenAI(messages: { role: 'user' | 'assistant' | 'system', content: string }[], isForSummary: boolean = false) {
    try {
        const systemMessage: ChatCompletionMessageParam = isForSummary ? {
            role: 'system',
            content: `Analyze the conversation and create a JSON summary with the following structure:
{
    "challenge": "Brief description of main problem",
    "currentSituation": "Current state description",
    "desiredOutcome": "Goal description",
    "constraints": ["constraint1", "constraint2"],
    "additionalInfo": ["info1", "info2"]
}
IMPORTANT: Response must be valid JSON only, no additional text. Only include fields where information is known.`
        } : {
            role: 'system',
            content: `You are a business consultant analyzing problems. When a user presents their initial problem, analyze it immediately and ask specific follow-up questions about unclear aspects. Don't ask for a general description if one is already provided.

Format your responses with clear structure:
- Use line breaks between different points or questions
- Use bullet points for lists
- Keep paragraphs short and focused
- Add a blank line between sections

Focus on gathering missing details about:
1) Current situation specifics
2) Desired outcomes
3) Previous attempts to solve
4) Constraints (budget, timeline, etc)

Keep responses short and focused. Don't ask more than 2 questions at a time. IMPORTANT: Always respond in plain text format only. Never return JSON or structured data in your response.`
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
            model: 'gpt-4',
            temperature: isForSummary ? 0 : 0.7, // Use temperature 0 for more consistent JSON
        });

        let response = completion.choices[0].message.content || '';

        if (isForSummary) {
            try {
                // Try to extract JSON if it's wrapped in other text
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : response;

                // Parse and validate the JSON
                const parsed = JSON.parse(jsonStr);

                // Only include fields that have content
                const formatted: any = {};
                if (parsed.challenge) formatted.challenge = ensureString(parsed.challenge);
                if (parsed.currentSituation) formatted.currentSituation = ensureString(parsed.currentSituation);
                if (parsed.desiredOutcome) formatted.desiredOutcome = ensureString(parsed.desiredOutcome);
                if (Array.isArray(parsed.constraints) && parsed.constraints.length > 0) {
                    formatted.constraints = parsed.constraints.map(ensureString);
                }
                if (Array.isArray(parsed.additionalInfo) && parsed.additionalInfo.length > 0) {
                    formatted.additionalInfo = parsed.additionalInfo.map(ensureString);
                }

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
        if (isForSummary) {
            return JSON.stringify({});
        }
        return "I apologize, but I'm having trouble connecting. Please try again.";
    }
} 