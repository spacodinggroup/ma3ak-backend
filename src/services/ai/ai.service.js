import { prisma } from "../../prisma/client.js";
import { buildPrompt } from "./prompts.js";
import { openaiGenerate } from "./openai.service.js";
import { grokGenerate } from "./grok.service.js";
import { AI_CONFIG } from "../../config/ai.config.js";
import { incrementUserRequests } from "../user.service.js";
export const aiService = async ({ user, tool, prompt, provider, }) => {
    const finalPromt = buildPrompt(user.role, tool, prompt);
    const selectedProvider = provider ?? AI_CONFIG.DEFAULT_PROVIDER;
    let response = "";
    if (selectedProvider === "GROK") {
        response = await grokGenerate(finalPromt);
    }
    else {
        response = await openaiGenerate(finalPromt);
    }
    await prisma.aiLog.create({
        data: {
            prompt: finalPromt,
            response,
            provider: selectedProvider,
            userId: user.id,
        },
    });
    await incrementUserRequests(user.id);
    return {
        provider: selectedProvider,
        response,
    };
};
//# sourceMappingURL=ai.service.js.map