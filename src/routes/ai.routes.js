import { Router } from "express";
import { generateAI } from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkLimit } from "../middlewares/rateLimit.middleware.js";
const router = Router();
router.post("/generate", protect, checkLimit, generateAI);
export default router;
//# sourceMappingURL=ai.routes.js.map