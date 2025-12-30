import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { generateExam, submitExam } from "../controllers/exam.controller.js";

const router = Router();

router.post("/generate", protect, generateExam);
router.post("/submit", protect, submitExam);

export default router;
