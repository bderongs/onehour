import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

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