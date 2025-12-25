import { Request, Response } from "express";
import { FounderService } from '../services/founder.service.js';
import { AuthenticatedRequest } from '../types/request.js';
import { successResponse, errorResponse } from "../utils/response.js";

export const getFounderDashboard = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const data = await FounderService.getDashboard(userId);
        successResponse(res, data);
    } catch (error) {
        errorResponse(res, "Failed to get founder dashboard");
    }
};

export const getFounderMetrics = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const metrics = await FounderService.getMetrics(userId);
        successResponse(res, metrics);
    } catch (error) {
        errorResponse(res, "Failed to get founder metrics");
    }
};

export const getFounderMilestones = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const milestones = await FounderService.getMilestones(userId);
        successResponse(res, milestones);
    } catch (error) {
        errorResponse(res, "Failed to get founder milestones");
    }
};

export const getFounderOKRs = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const okrs = await FounderService.getOKRs(userId);
        successResponse(res, okrs);
    } catch (error) {
        errorResponse(res, "Failed to get founder OKRs");
    }
};

export const getFounderPitch = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const pitch = await FounderService.getPitch(userId);
        successResponse(res, pitch);
    } catch (error) {
        errorResponse(res, "Failed to get founder pitch");
    }
};

export const getFounderRoadmap = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const roadmap = await FounderService.getRoadmap(userId);
        successResponse(res, roadmap);
    } catch (error) {
        errorResponse(res, "Failed to get founder roadmap");
    }
};

export const getFounderSettings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = await FounderService.getSettings(userId);
        successResponse(res, settings);
    } catch (error) {
        errorResponse(res, "Failed to get founder settings");
    }
};

export const updateFounderSettings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = req.body;
        const result = await FounderService.updateSettings(userId, settings);
        successResponse(res, result);
    } catch (error) {
        errorResponse(res, "Failed to update founder settings");
    }
};

export const getFounderTeam = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const team = await FounderService.getTeam(userId);
        successResponse(res, team);
    } catch (error) {
        errorResponse(res, "Failed to get founder team");
    }
};

export const getFounderTech = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const tech = await FounderService.getTech(userId);
        successResponse(res, tech);
    } catch (error) {
        errorResponse(res, "Failed to get founder tech");
    }
};

export const getFounderValidate = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const validation = await FounderService.getValidate(userId);
        successResponse(res, validation);
    } catch (error) {
        errorResponse(res, "Failed to get founder validation");
    }
};