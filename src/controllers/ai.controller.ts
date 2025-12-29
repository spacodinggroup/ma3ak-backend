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

        // 3️⃣ CONTROLLER ENFORCEMENT
        // If reply is invalid → force fallback message
        if (!result || typeof result.reply !== 'string' || result.reply.trim() === '') {
            return res.json({ reply: "Sorry, the AI could not generate a response. Please try again." });
        }

        return res.json(result);
    } catch (err) {
        // Catch ALL errors and return a safe fallback message
        console.error("AI Generation Error:", err);
        return res.json({ reply: "Sorry, the AI could not generate a response. Please try again." });
    }
};