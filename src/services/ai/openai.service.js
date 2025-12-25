import OpenAI from 'openai';
import { ENV } from '../../config/env.js';
import { AI_CONFIG } from '../../config/ai.config.js';
const openai = new OpenAI({
    apiKey: ENV.OPENAI_KEY,
});
export const openaiGenerate = async (prompt) => {
    const completion = await openai.chat.completions.create({
        model: AI_CONFIG.MODELS.OPENAI,
        messages: [
            { role: 'system', content: "You are a helpful AI assistant." },
            { role: 'user', content: prompt },
        ],
        temperature: 0.7,
    });
    return completion.choices?.[0]?.message?.content || '';
};
//# sourceMappingURL=openai.service.js.map