import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getFounderDashboard,
    getFounderMetrics,
    getFounderMilestones,
    getFounderOKRs,
    getFounderPitch,
    getFounderRoadmap,
    getFounderSettings,
    updateFounderSettings,
    getFounderTeam,
    getFounderTech,
    getFounderValidate,
} from "../controllers/founder.controller.js";

const router = Router();

router.get("/dashboard", protect, getFounderDashboard);
router.get("/metrics", protect, getFounderMetrics);
router.get("/milestones", protect, getFounderMilestones);
router.get("/okrs", protect, getFounderOKRs);
router.get("/pitch", protect, getFounderPitch);
router.get("/roadmap", protect, getFounderRoadmap);
router.get("/settings", protect, getFounderSettings);
router.put("/settings", protect, updateFounderSettings);
router.get("/team", protect, getFounderTeam);
router.get("/tech", protect, getFounderTech);
router.get("/validate", protect, getFounderValidate);

export default router;