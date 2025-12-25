import { Router } from "express";
import { getProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getMyStats } from "../controllers/stats.controller.js";
import { getWeeklyUsage } from "../controllers/analytics.controller.js";
const router = Router();
router.get("/me", protect, getProfile);
router.get("/stats", protect, getMyStats);
router.get("/analytics/weekly", protect, getWeeklyUsage);
export default router;
//# sourceMappingURL=user.routes.js.map