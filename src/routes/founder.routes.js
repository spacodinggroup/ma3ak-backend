import { Router } from "express";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { getFounderDashboard, getFounderMetrics, getFounderMilestones, getFounderOKRs, getFounderPitch, getFounderRoadmap, getFounderSettings, updateFounderSettings, getFounderTeam, getFounderTech, getFounderValidate, sendFounderMessage, } from "../controllers/founder.controller.js";
const router = Router();
router.get("/dashboard", protect, requireRole("FOUNDER"), getFounderDashboard);
router.get("/metrics", protect, requireRole("FOUNDER"), getFounderMetrics);
router.get("/milestones", protect, requireRole("FOUNDER"), getFounderMilestones);
router.get("/okrs", protect, requireRole("FOUNDER"), getFounderOKRs);
router.get("/pitch", protect, requireRole("FOUNDER"), getFounderPitch);
router.get("/roadmap", protect, requireRole("FOUNDER"), getFounderRoadmap);
router.get("/settings", protect, requireRole("FOUNDER"), getFounderSettings);
router.put("/settings", protect, requireRole("FOUNDER"), updateFounderSettings);
router.get("/team", protect, requireRole("FOUNDER"), getFounderTeam);
router.get("/tech", protect, requireRole("FOUNDER"), getFounderTech);
router.get("/validate", protect, requireRole("FOUNDER"), getFounderValidate);
router.post("/chat", protect, requireRole("FOUNDER"), sendFounderMessage);
export default router;
//# sourceMappingURL=founder.routes.js.map