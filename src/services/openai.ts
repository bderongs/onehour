import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

function ensureString(response: any): string {
    if (typeof response === 'string') {
        return response;
    }
    if (typeof response === 'object') {
        try {
            // For nested objects, extract values and join them
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
        const systemMessage = isForSummary ? {
            role: 'system',
            content: `You are a business analyst. Based on the conversation, create a structured summary of the problem. Extract only the facts mentioned and format them as complete sentences. Respond in JSON format with these fields:
- challenge (string): A clear statement of the main problem
- currentSituation (string): A concise description of the current state
- desiredOutcome (string): A clear statement of what success looks like
- constraints (string[]): List of limitations or requirements
- additionalInfo (string[]): List of other relevant details

Important: All fields should contain complete, readable sentences, not structured data or key-value pairs.`
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

Be direct and concise in your analysis and questions. IMPORTANT: Always respond in plain text format only. Never return JSON or structured data in your response.`
        };

        const completion = await openai.chat.completions.create({
            messages: [systemMessage, ...messages],
            model: 'gpt-4',
            temperature: 0.7,
        });

        let response = completion.choices[0].message.content || '';

        if (isForSummary) {
            try {
                // For summary, validate the JSON and ensure all values are strings
                const parsed = JSON.parse(response);
                const formatted = {
                    challenge: ensureString(parsed.challenge),
                    currentSituation: ensureString(parsed.currentSituation),
                    desiredOutcome: ensureString(parsed.desiredOutcome),
                    constraints: Array.isArray(parsed.constraints)
                        ? parsed.constraints.map(ensureString)
                        : [],
                    additionalInfo: Array.isArray(parsed.additionalInfo)
                        ? parsed.additionalInfo.map(ensureString)
                        : []
                };
                return JSON.stringify(formatted);
            } catch (e) {
                console.error('Invalid JSON in summary response:', e);
                return JSON.stringify({
                    challenge: "",
                    currentSituation: "",
                    desiredOutcome: "",
                    constraints: [],
                    additionalInfo: []
                });
            }
        } else {
            // For chat responses, ensure we always return a string
            return ensureString(response);
        }
    } catch (error) {
        console.error('OpenAI API Error:', error);
        if (isForSummary) {
            return JSON.stringify({
                challenge: "",
                currentSituation: "",
                desiredOutcome: "",
                constraints: [],
                additionalInfo: []
            });
        }
        return "I apologize, but I'm having trouble connecting. Please try again.";
    }
} 