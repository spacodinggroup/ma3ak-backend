import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getStudentDashboard,
    getStudentSubjects,
    generateStudyPlan,
    getStudentCourses,
    sendStudentMessage,
    getStudentNotes,
    getStudentPlan,
    getStudentExams,
    getStudentPractice,
    getStudentProgress,
    getStudentSettings,
    updateStudentSettings,
    getStudentTimer,
    uploadStudentNote,
    saveStudentSubjects,
    completeStudyPlanItem,
    saveExam,
    getChatSessions,
} from "../controllers/student.controller.js";

const router = Router();

router.get("/dashboard", protect, getStudentDashboard);
router.get("/subjects", protect, getStudentSubjects);
router.post("/subjects", protect, saveStudentSubjects);
router.post("/generate-plan", protect, generateStudyPlan);
router.get("/courses", protect, getStudentCourses);
router.post("/chat", protect, sendStudentMessage);
router.get("/chat/sessions", protect, getChatSessions);
router.get("/notes", protect, getStudentNotes);
router.get("/plan", protect, getStudentPlan);
router.put("/plan/:itemId/complete", protect, completeStudyPlanItem);
router.get("/exams", protect, getStudentExams);
router.post("/exams", protect, saveExam);
router.get("/practice", protect, getStudentPractice);
router.get("/progress", protect, getStudentProgress);
router.get("/settings", protect, getStudentSettings);
router.put("/settings", protect, updateStudentSettings);
router.get("/timer", protect, getStudentTimer);
router.post("/notes/upload", protect, uploadStudentNote);

export default router;