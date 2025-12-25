import { FounderService } from '../services/founder.service.js';
export const getFounderDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const data = await FounderService.getDashboard(userId);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder dashboard" });
    }
};
export const getFounderMetrics = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const metrics = await FounderService.getMetrics(userId);
        res.json({ success: true, data: metrics });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder metrics" });
    }
};
export const getFounderMilestones = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const milestones = await FounderService.getMilestones(userId);
        res.json({ success: true, data: milestones });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder milestones" });
    }
};
export const getFounderOKRs = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const okrs = await FounderService.getOKRs(userId);
        res.json({ success: true, data: okrs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder OKRs" });
    }
};
export const getFounderPitch = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const pitch = await FounderService.getPitch(userId);
        res.json({ success: true, data: pitch });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder pitch" });
    }
};
export const getFounderRoadmap = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const roadmap = await FounderService.getRoadmap(userId);
        res.json({ success: true, data: roadmap });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder roadmap" });
    }
};
export const getFounderSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const settings = await FounderService.getSettings(userId);
        res.json({ success: true, data: settings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder settings" });
    }
};
export const updateFounderSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const settings = req.body;
        const result = await FounderService.updateSettings(userId, settings);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update founder settings" });
    }
};
export const getFounderTeam = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const team = await FounderService.getTeam(userId);
        res.json({ success: true, data: team });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder team" });
    }
};
export const getFounderTech = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const tech = await FounderService.getTech(userId);
        res.json({ success: true, data: tech });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder tech" });
    }
};
export const getFounderValidate = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const validation = await FounderService.getValidate(userId);
        res.json({ success: true, data: validation });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get founder validation" });
    }
};
//# sourceMappingURL=founder.controller.js.map