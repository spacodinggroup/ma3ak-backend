import { StudentService } from '../services/student.service.js';
import { successResponse, errorResponse } from "../utils/response.js";
export const getStudentDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const data = await StudentService.getDashboard(userId);
        successResponse(res, data);
    }
    catch (error) {
        errorResponse(res, "Failed to get student dashboard");
    }
};
export const getStudentSubjects = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const subjects = await StudentService.getSubjects(userId);
        res.json({ success: true, data: subjects });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get student subjects" });
    }
};
export const generateStudyPlan = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { subjects, hoursPerDay, examDate } = req.body;
        const plan = await StudentService.generateStudyPlan(userId, { subjects, hoursPerDay, examDate });
        res.json({ success: true, data: plan });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to generate study plan" });
    }
};
export const getStudentCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const courses = await StudentService.getCourses(userId);
        res.json({ success: true, data: courses });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get student courses" });
    }
};
export const sendStudentMessage = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { message } = req.body;
        const response = await StudentService.sendMessage(userId, message);
        res.json({ success: true, data: response });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
};
export const getStudentNotes = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const notes = await StudentService.getNotes(userId);
        res.json({ success: true, data: notes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get student notes" });
    }
};
export const getStudentPlan = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const plan = await StudentService.getPlan(userId);
        res.json({ success: true, data: plan });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get student plan" });
    }
};
export const getStudentExams = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const exams = await StudentService.getExams(userId);
        res.json({ success: true, data: exams });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get student exams" });
    }
};
export const getStudentPractice = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const practice = await StudentService.getPractice(userId);
        res.json({ success: true, data: practice });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get student practice" });
    }
};
export const getStudentProgress = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const progress = await StudentService.getProgress(userId);
        res.json({ success: true, data: progress });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get student progress" });
    }
};
export const getStudentSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const settings = await StudentService.getSettings(userId);
        res.json({ success: true, data: settings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get student settings" });
    }
};
export const updateStudentSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const settings = req.body;
        const result = await StudentService.updateSettings(userId, settings);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update student settings" });
    }
};
export const getStudentTimer = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const timer = await StudentService.getTimer(userId);
        res.json({ success: true, data: timer });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get student timer" });
    }
};
export const uploadStudentNote = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Assuming file is handled by multer middleware
        const result = await StudentService.uploadNote(userId, req.file || req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to upload note" });
    }
};
//# sourceMappingURL=student.controller.js.map