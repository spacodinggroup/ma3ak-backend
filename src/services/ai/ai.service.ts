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

    let currentProvider = provider ?? AI_CONFIG.DEFAULT_PROVIDER;
    let response = "";

    // Helper to attempt generation
    const tryGenerate = async (prov: string) => {
        if (prov === "GROK") return grokGenerate(finalPromt);
        return openaiGenerate(finalPromt);
    };

    try {
        response = await tryGenerate(currentProvider);
    } catch (error) {
        console.warn(`Provider ${currentProvider} failed:`, error);
        response = ""; // Ensure empty so we trigger fallback if applicable
    }

    // Fallback Logic: If failed/empty AND we started with OPENAI (default), try GROK
    if ((!response || response.trim() === "") && currentProvider === "OPENAI") {
        console.info("Switching to fallback provider: GROK");
        try {
            currentProvider = "GROK";
            response = await tryGenerate(currentProvider);
        } catch (fallbackError) {
            console.error("Fallback provider GROK failed:", fallbackError);
            response = "";
        }
    }

    // If response is still empty, the controller handles the fallback message.

    await prisma.aiLog.create({
        data: {
            prompt: finalPromt,
            response: response || "FAILED",
            provider: currentProvider,
            userId: user.id,
        },
    });

    await incrementUserRequests(user.id);

    return {
        reply: response,
    };
};