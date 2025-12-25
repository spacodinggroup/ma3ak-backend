import { aiService } from "../services/ai/ai.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const generateAI = async (req: any, res: any) => {
    try {
        const { tool, prompt, provider } = req.body;

        if (!tool || !prompt) {
            return errorResponse(res, "Missing AI data", 400);
        }

        const result = await aiService({
            user: req.user,
            tool,
            prompt,
            provider,
        });
        successResponse(res, result);
    } catch (err) {
        errorResponse(res, "AI generation failed", 500);
    }
};