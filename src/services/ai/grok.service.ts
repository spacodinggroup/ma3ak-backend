import axios from 'axios';
import { ENV } from '../../config/env.js';
import { AI_CONFIG } from '../../config/ai.config.js';

export const grokGenerate = async ( prompt: string ): Promise<string> => {
    const res = await axios.post('https://api.x.ai/v1/chat/completions', 
        {
            model: AI_CONFIG.MODELS.GROK,
            messages: [
                { role: 'system', content: "You are a helpful AI assistant." },
                { role: 'user', content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${ENV.GROK_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
    );
    return res.data.choices[0].message?.content || '';
};