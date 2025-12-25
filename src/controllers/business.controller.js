import { BusinessService } from '../services/business.service.js';
import { successResponse, errorResponse } from "../utils/response.js";
export const getBusinessDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const data = await BusinessService.getDashboard(userId);
        successResponse(res, data);
    }
    catch (error) {
        errorResponse(res, "Failed to get business dashboard", 500);
    }
};
export const getBusinessAnalytics = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const analytics = await BusinessService.getAnalytics(userId);
        successResponse(res, analytics);
    }
    catch (error) {
        errorResponse(res, "Failed to get business analytics", 500);
    }
};
export const getBusinessCalendar = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const calendar = await BusinessService.getCalendar(userId);
        successResponse(res, calendar);
    }
    catch (error) {
        errorResponse(res, "Failed to get business calendar", 500);
    }
};
export const getBusinessContent = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const content = await BusinessService.getContent(userId);
        successResponse(res, content);
    }
    catch (error) {
        errorResponse(res, "Failed to get business content", 500);
    }
};
export const getBusinessCustomers = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const customers = await BusinessService.getCustomers(userId);
        res.json({ success: true, data: customers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get business customers" });
    }
};
export const getBusinessGoals = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const goals = await BusinessService.getGoals(userId);
        res.json({ success: true, data: goals });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get business goals" });
    }
};
export const getBusinessMarketing = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const marketing = await BusinessService.getMarketing(userId);
        res.json({ success: true, data: marketing });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get business marketing" });
    }
};
export const getBusinessReports = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const reports = await BusinessService.getReports(userId);
        res.json({ success: true, data: reports });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get business reports" });
    }
};
export const getBusinessSales = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const sales = await BusinessService.getSales(userId);
        res.json({ success: true, data: sales });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get business sales" });
    }
};
export const getBusinessSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const settings = await BusinessService.getSettings(userId);
        res.json({ success: true, data: settings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get business settings" });
    }
};
export const updateBusinessSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const settings = req.body;
        const result = await BusinessService.updateSettings(userId, settings);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update business settings" });
    }
};
//# sourceMappingURL=business.controller.js.map