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
    
    // 1️⃣ UNIVERSAL AI RESPONSE NORMALIZER
    const normalizeAIResponse = (raw: any): string => {
        // Extraction priority (top → bottom)
        
        // 1. raw.reply
        if (raw?.reply && typeof raw.reply === 'string') return raw.reply;
        
        // 2. raw.message
        if (raw?.message && typeof raw.message === 'string') return raw.message;
        
        // 3. raw.data?.reply
        if (raw?.data?.reply && typeof raw.data.reply === 'string') return raw.data.reply;
        
        // 4. raw.data?.message
        if (raw?.data?.message && typeof raw.data.message === 'string') return raw.data.message;
        
        // 5. raw.choices?.[0]?.message?.content
        if (raw?.choices?.[0]?.message?.content && typeof raw.choices[0].message.content === 'string') {
            return raw.choices[0].message.content;
        }
        
        // 6. raw.text
        if (raw?.text && typeof raw.text === 'string') return raw.text;

        // If raw is JSON string → parse & retry
        if (typeof raw === 'string') {
            try {
                const parsed = JSON.parse(raw);
                // Recursively check the parsed object (but prevent infinite loop if parsed is same string)
                if (typeof parsed === 'object' && parsed !== null) {
                    return normalizeAIResponse(parsed);
                }
            } catch (e) {
                // If raw is plain string -> return it (last resort for string input that isn't JSON)
                // BUT the requirement says: "If raw is plain string → return it"
                // So if it fails JSON parse, we treat it as the content itself if it's not empty?
                // Actually the prompt says: "If raw is plain string → return it" (meaning if it's just a string node?)
                // Let's assume if it reached here as a string and failed JSON parse, it IS the response text.
                if (raw.trim().length > 0) return raw;
            }
            // If it was a string that successfully parsed, the recursive call handled it.
            // If it was a string that failed parsing, we returned it above.
        }

        return "";
    };

    // Helper to attempt generation and normalize
    const attemptGenerate = async (prov: string): Promise<string> => {
        let rawResponse: any;
        if (prov === "GROK") {
            rawResponse = await grokGenerate(finalPromt);
        } else {
            rawResponse = await openaiGenerate(finalPromt);
        }
        return normalizeAIResponse(rawResponse);
    };

    let response = "";

    // 2️⃣ PROVIDER FALLBACK (MANDATORY)
    
    // Try OpenAI (or requested provider)
    try {
        response = await attemptGenerate(currentProvider);
    } catch (error) {
        console.warn(`Provider ${currentProvider} failed:`, error);
        response = "";
    }

    // If empty → switch to fallback (Grok) if we haven't tried it yet
    if (!response || response.trim() === "") {
        const fallbackProvider: "OPENAI" | "GROK" = currentProvider === "OPENAI" ? "GROK" : "OPENAI";
        console.info(`Primary provider (${currentProvider}) empty/failed. Switching to fallback: ${fallbackProvider}`);
        try {
            currentProvider = fallbackProvider;
            response = await attemptGenerate(fallbackProvider);
        } catch (fallbackError) {
            console.error(`Fallback provider (${fallbackProvider}) failed:`, fallbackError);
            response = "";
        }
    }

    // If still empty → throw error (to be caught by controller)
    if (!response || response.trim() === "") {
        throw new Error("All AI providers failed to generate a valid response.");
    }

    await prisma.aiLog.create({
        data: {
            prompt: finalPromt,
            response: response,
            provider: currentProvider,
            userId: user.id,
        },
    });

    await incrementUserRequests(user.id);

    return {
        reply: response,
    };
};