import { Router } from "express";
import { generateAI, generateStudyPlan } from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkLimit } from "../middlewares/rateLimit.middleware.js";
const router = Router();
router.post("/generate", protect, checkLimit, generateAI);
router.post("/study-plan", protect, checkLimit, generateStudyPlan);
export default router;
//# sourceMappingURL=ai.routes.js.map