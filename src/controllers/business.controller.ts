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