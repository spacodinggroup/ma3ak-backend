import { Router } from "express";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import {
    getBusinessDashboard,
    getBusinessAnalytics,
    getBusinessCalendar,
    getBusinessContent,
    getBusinessCustomers,
    getBusinessGoals,
    getBusinessMarketing,
    getBusinessReports,
    getBusinessSales,
    getBusinessSettings,
    updateBusinessSettings,
    sendBusinessMessage,
} from "../controllers/business.controller.js";

const router = Router();

router.get("/dashboard", protect, requireRole("BUSINESS"), getBusinessDashboard);
router.get("/analytics", protect, requireRole("BUSINESS"), getBusinessAnalytics);
router.get("/calendar", protect, requireRole("BUSINESS"), getBusinessCalendar);
router.get("/content", protect, requireRole("BUSINESS"), getBusinessContent);
router.get("/customers", protect, requireRole("BUSINESS"), getBusinessCustomers);
router.get("/goals", protect, requireRole("BUSINESS"), getBusinessGoals);
router.get("/marketing", protect, requireRole("BUSINESS"), getBusinessMarketing);
router.get("/reports", protect, requireRole("BUSINESS"), getBusinessReports);
router.get("/sales", protect, requireRole("BUSINESS"), getBusinessSales);
router.get("/settings", protect, requireRole("BUSINESS"), getBusinessSettings);
router.put("/settings", protect, requireRole("BUSINESS"), updateBusinessSettings);
router.post("/chat", protect, requireRole("BUSINESS"), sendBusinessMessage);

export default router;