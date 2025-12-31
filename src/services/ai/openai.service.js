import OpenAI from 'openai';
import { ENV } from '../../config/env.js';
import { AI_CONFIG } from '../../config/ai.config.js';
const getOpenAIClient = () => {
    if (!ENV.OPENAI_KEY) {
        throw new Error('Missing OPENAI_KEY');
    }
    return new OpenAI({
        apiKey: ENV.OPENAI_KEY,
        timeout: 30000,
    });
};
export const openaiGenerate = async (prompt) => {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
        model: AI_CONFIG.MODELS.OPENAI,
        messages: [
            { role: 'system', content: "You are a professional assistant. Be concise and follow the system instructions provided." },
            { role: 'user', content: prompt },
        ],
        temperature: 0.7,
    });
    return completion.choices?.[0]?.message?.content || '';
};
//# sourceMappingURL=openai.service.js.map