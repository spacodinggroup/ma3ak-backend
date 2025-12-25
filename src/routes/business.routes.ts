import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
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
} from "../controllers/business.controller.js";

const router = Router();

router.get("/dashboard", protect, getBusinessDashboard);
router.get("/analytics", protect, getBusinessAnalytics);
router.get("/calendar", protect, getBusinessCalendar);
router.get("/content", protect, getBusinessContent);
router.get("/customers", protect, getBusinessCustomers);
router.get("/goals", protect, getBusinessGoals);
router.get("/marketing", protect, getBusinessMarketing);
router.get("/reports", protect, getBusinessReports);
router.get("/sales", protect, getBusinessSales);
router.get("/settings", protect, getBusinessSettings);
router.put("/settings", protect, updateBusinessSettings);

export default router;