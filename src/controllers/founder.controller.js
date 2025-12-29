import { FounderService } from '../services/founder.service.js';
import { successResponse, errorResponse } from "../utils/response.js";
export const getFounderDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const data = await FounderService.getDashboard(userId);
        successResponse(res, data);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder dashboard", 500);
    }
};
export const getFounderMetrics = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const metrics = await FounderService.getMetrics(userId);
        successResponse(res, metrics);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder metrics", 500);
    }
};
export const getFounderMilestones = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const milestones = await FounderService.getMilestones(userId);
        successResponse(res, milestones);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder milestones", 500);
    }
};
export const getFounderOKRs = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const okrs = await FounderService.getOKRs(userId);
        successResponse(res, okrs);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder OKRs", 500);
    }
};
export const getFounderPitch = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const pitch = await FounderService.getPitch(userId);
        successResponse(res, pitch);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder pitch", 500);
    }
};
export const getFounderRoadmap = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const roadmap = await FounderService.getRoadmap(userId);
        successResponse(res, roadmap);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder roadmap", 500);
    }
};
export const getFounderSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = await FounderService.getSettings(userId);
        successResponse(res, settings);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder settings", 500);
    }
};
export const updateFounderSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = req.body;
        const result = await FounderService.updateSettings(userId, settings);
        successResponse(res, result);
    }
    catch (error) {
        errorResponse(res, "Failed to update founder settings", 500);
    }
};
export const getFounderTeam = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const team = await FounderService.getTeam(userId);
        successResponse(res, team);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder team", 500);
    }
};
export const getFounderTech = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const tech = await FounderService.getTech(userId);
        successResponse(res, tech);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder tech", 500);
    }
};
export const getFounderValidate = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const validation = await FounderService.getValidate(userId);
        successResponse(res, validation);
    }
    catch (error) {
        errorResponse(res, "Failed to get founder validation", 500);
    }
};
export const sendFounderMessage = async (req, res) => {
    const startTime = Date.now();
    try {
        // 1. Validate User Authorization
        const userId = req.user?.id;
        if (!userId) {
            console.warn('[Founder Chat] Unauthorized access attempt');
            return res.status(401).json({ error: "Unauthorized" });
        }
        // 2. Validate Request Payload
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.warn(`[Founder Chat] Invalid messages array from user ${userId}`);
            return res.status(400).json({ error: "Invalid messages array" });
        }
        // 3. Validate Message Content Length (prevent payload abuse)
        const MAX_MESSAGE_LENGTH = 10000; // 10k characters
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || typeof lastMessage.content !== 'string') {
            console.warn(`[Founder Chat] Invalid message format from user ${userId}`);
            return res.status(400).json({ error: "Invalid message format" });
        }
        if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
            console.warn(`[Founder Chat] Message too long (${lastMessage.content.length} chars) from user ${userId}`);
            return res.status(400).json({ error: "Message too long. Maximum 10,000 characters." });
        }
        // 4. Call Founder Service with AI Integration
        let result;
        try {
            console.info(`[Founder Chat] Processing request for user ${userId}`);
            result = await FounderService.sendMessage(userId, lastMessage.content);
        }
        catch (serviceError) {
            console.error('[Founder Chat] Service error:', {
                userId,
                error: serviceError.message || serviceError,
                stack: serviceError.stack
            });
            if (serviceError.message?.includes('Prisma') || serviceError.message?.includes('database')) {
                console.error('[Founder Chat] Database error detected');
            }
            else if (serviceError.message?.includes('network') || serviceError.message?.includes('ECONNREFUSED')) {
                console.error('[Founder Chat] Network error detected');
            }
            const duration = Date.now() - startTime;
            console.warn(`[Founder Chat] Returning fallback message after ${duration}ms`);
            return res.status(200).json({
                reply: "Sorry, the AI could not generate a response. Please try again."
            });
        }
        // 5. Validate and Normalize Response
        if (!result || typeof result.reply !== 'string' || result.reply.trim() === '') {
            console.warn(`[Founder Chat] Invalid or empty response from service for user ${userId}`);
            const duration = Date.now() - startTime;
            console.warn(`[Founder Chat] Returning fallback message after ${duration}ms`);
            return res.status(200).json({
                reply: "Sorry, the AI could not generate a response. Please try again."
            });
        }
        // 6. Success - Log and Return
        const duration = Date.now() - startTime;
        console.info(`[Founder Chat] Success for user ${userId} in ${duration}ms`);
        return res.status(200).json({ reply: result.reply });
    }
    catch (error) {
        const duration = Date.now() - startTime;
        console.error('[Founder Chat] Unexpected error:', {
            error: error.message || error,
            stack: error.stack,
            duration: `${duration}ms`
        });
        return res.status(200).json({
            reply: "Sorry, the AI could not generate a response. Please try again."
        });
    }
};
//# sourceMappingURL=founder.controller.js.map