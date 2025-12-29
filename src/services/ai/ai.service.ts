import { prisma } from "../../prisma/client.js";
import { buildPrompt } from "./prompts.js";
import { openaiGenerate } from "./openai.service.js";
import { grokGenerate } from "./grok.service.js";
import { AI_CONFIG } from "../../config/ai.config.js";
import { incrementUserRequests } from "../user.service.js";

export const aiService = async ({
    user,
    tool,
    prompt,
    provider,
}: {
    user: any;
    tool: string;
    prompt: string;
    provider?: "OPENAI" | "GROK";
}) => {
    const finalPromt = buildPrompt(user.role, tool, prompt);

    const selectedProvider = provider ?? AI_CONFIG.DEFAULT_PROVIDER;

    let response = "";
    const MAX_RETRIES = 2;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            if (selectedProvider === "GROK") {
                response = await grokGenerate(finalPromt);
            } else {
                response = await openaiGenerate(finalPromt);
            }

            if (response && response.trim().length > 0) {
                break; // Success
            }
        } catch (error) {
            console.error(`AI Generation Attempt ${attempt} failed:`, error);
            if (attempt === MAX_RETRIES) {
                // Return empty string to let controller handle fallback if all retries fail
                response = "";
            }
        }
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
        reply: response,
    };
};