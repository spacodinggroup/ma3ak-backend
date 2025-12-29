import { Request, Response } from "express";
import { BusinessService } from '../services/business.service.js';
import { AuthenticatedRequest } from '../types/request.js';
import { successResponse, errorResponse } from "../utils/response.js";

export const getBusinessDashboard = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const data = await BusinessService.getDashboard(userId);
        successResponse(res, data);
    } catch (error) {
        errorResponse(res, "Failed to get business dashboard", 500);
    }
};

export const getBusinessAnalytics = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const analytics = await BusinessService.getAnalytics(userId);
        successResponse(res, analytics);
    } catch (error) {
        errorResponse(res, "Failed to get business analytics", 500);
    }
};

export const getBusinessCalendar = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const calendar = await BusinessService.getCalendar(userId);
        successResponse(res, calendar);
    } catch (error) {
        errorResponse(res, "Failed to get business calendar", 500);
    }
};

export const getBusinessContent = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const content = await BusinessService.getContent(userId);
        successResponse(res, content);
    } catch (error) {
        errorResponse(res, "Failed to get business content", 500);
    }
};

export const getBusinessCustomers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const customers = await BusinessService.getCustomers(userId);
        successResponse(res, customers);
    } catch (error) {
        errorResponse(res, "Failed to get business customers", 500);
    }
};

export const getBusinessGoals = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const goals = await BusinessService.getGoals(userId);
        successResponse(res, goals);
    } catch (error) {
        errorResponse(res, "Failed to get business goals", 500);
    }
};

export const getBusinessMarketing = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const marketing = await BusinessService.getMarketing(userId);
        successResponse(res, marketing);
    } catch (error) {
        errorResponse(res, "Failed to get business marketing", 500);
    }
};

export const getBusinessReports = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const reports = await BusinessService.getReports(userId);
        successResponse(res, reports);
    } catch (error) {
        errorResponse(res, "Failed to get business reports", 500);
    }
};

export const getBusinessSales = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const sales = await BusinessService.getSales(userId);
        successResponse(res, sales);
    } catch (error) {
        errorResponse(res, "Failed to get business sales", 500);
    }
};

export const getBusinessSettings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = await BusinessService.getSettings(userId);
        successResponse(res, settings);
    } catch (error) {
        errorResponse(res, "Failed to get business settings", 500);
    }
};

export const updateBusinessSettings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = req.body;
        const result = await BusinessService.updateSettings(userId, settings);
        successResponse(res, result);
    } catch (error) {
        errorResponse(res, "Failed to update business settings", 500);
    }
};

export const sendBusinessMessage = async (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();

    try {
        // 1. Validate User Authorization
        const userId = req.user?.id;
        if (!userId) {
            console.warn('[Business Chat] Unauthorized access attempt');
            return res.status(401).json({ error: "Unauthorized" });
        }

        // 2. Validate Request Payload
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.warn(`[Business Chat] Invalid messages array from user ${userId}`);
            return res.status(400).json({ error: "Invalid messages array" });
        }

        // 3. Validate Message Content Length (prevent payload abuse)
        const MAX_MESSAGE_LENGTH = 10000; // 10k characters
        const lastMessage = messages[messages.length - 1];

        if (!lastMessage || typeof lastMessage.content !== 'string') {
            console.warn(`[Business Chat] Invalid message format from user ${userId}`);
            return res.status(400).json({ error: "Invalid message format" });
        }

        if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
            console.warn(`[Business Chat] Message too long (${lastMessage.content.length} chars) from user ${userId}`);
            return res.status(400).json({ error: "Message too long. Maximum 10,000 characters." });
        }

        // 4. Call Business Service with AI Integration
        let result;
        try {
            console.info(`[Business Chat] Processing request for user ${userId}`);
            result = await BusinessService.sendMessage(userId, lastMessage.content);
        } catch (serviceError: any) {
            console.error('[Business Chat] Service error:', {
                userId,
                error: serviceError.message || serviceError,
                stack: serviceError.stack
            });

            if (serviceError.message?.includes('Prisma') || serviceError.message?.includes('database')) {
                console.error('[Business Chat] Database error detected');
            } else if (serviceError.message?.includes('network') || serviceError.message?.includes('ECONNREFUSED')) {
                console.error('[Business Chat] Network error detected');
            }

            const duration = Date.now() - startTime;
            console.warn(`[Business Chat] Returning fallback message after ${duration}ms`);
            return res.status(200).json({
                reply: "Sorry, the AI could not generate a response. Please try again."
            });
        }

        // 5. Validate and Normalize Response
        if (!result || typeof result.reply !== 'string' || result.reply.trim() === '') {
            console.warn(`[Business Chat] Invalid or empty response from service for user ${userId}`);
            const duration = Date.now() - startTime;
            console.warn(`[Business Chat] Returning fallback message after ${duration}ms`);
            return res.status(200).json({
                reply: "Sorry, the AI could not generate a response. Please try again."
            });
        }

        // 6. Success - Log and Return
        const duration = Date.now() - startTime;
        console.info(`[Business Chat] Success for user ${userId} in ${duration}ms`);

        return res.status(200).json({ reply: result.reply });

    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error('[Business Chat] Unexpected error:', {
            error: error.message || error,
            stack: error.stack,
            duration: `${duration}ms`
        });

        return res.status(200).json({
            reply: "Sorry, the AI could not generate a response. Please try again."
        });
    }
};