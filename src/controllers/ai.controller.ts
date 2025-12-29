import { aiService } from "../services/ai/ai.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const generateAI = async (req: any, res: any) => {
    try {
        const { tool, prompt, provider } = req.body;

        if (!tool || !prompt) {
            return res.json({ reply: "Missing AI data" });
        }

        const result = await aiService({
            user: req.user,
            tool,
            prompt,
            provider,
        });

        // Ensure result has reply, fallback if something weird happens
        if (!result || typeof result.reply !== 'string') {
            return res.json({ reply: "Sorry, I couldn't generate a response right now." });
        }

        return res.json(result);
    } catch (err) {
        // Catch ALL errors and return a safe fallback message
        console.error("AI Generation Error:", err);
        return res.json({ reply: "Sorry, I couldn't generate a response right now." });
    }
};