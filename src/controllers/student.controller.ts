import { Request, Response } from "express";
import { StudentService } from '../services/student.service.js';
import { AuthenticatedRequest, FileUploadRequest } from '../types/request.js';
import { successResponse, errorResponse } from "../utils/response.js";

export const getStudentDashboard = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const data = await StudentService.getDashboard(userId);
        successResponse(res, data);
    } catch (error) {
        errorResponse(res, "Failed to get student dashboard");
    }
};

export const getStudentSubjects = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const subjects = await StudentService.getSubjects(userId);
        successResponse(res, subjects);
    } catch (error) {
        errorResponse(res, "Failed to get student subjects", 500);
    }
};

export const generateStudyPlan = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subjects, hoursPerDay, examDate } = req.body;
        const plan = await StudentService.generateStudyPlan(userId, { subjects, hoursPerDay, examDate });
        successResponse(res, plan);
    } catch (error) {
        errorResponse(res, "Failed to generate study plan", 500);
    }
};

export const getStudentCourses = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const courses = await StudentService.getCourses(userId);
        successResponse(res, courses);
    } catch (error) {
        errorResponse(res, "Failed to get student courses", 500);
    }
};

export const sendStudentMessage = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { message } = req.body;
        const response = await StudentService.sendMessage(userId, message);
        successResponse(res, response);
    } catch (error) {
        errorResponse(res, "Failed to send message", 500);
    }
};

export const getStudentNotes = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const notes = await StudentService.getNotes(userId);
        successResponse(res, notes);
    } catch (error) {
        errorResponse(res, "Failed to get student notes", 500);
    }
};

export const getStudentPlan = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const plan = await StudentService.getPlan(userId);
        successResponse(res, plan);
    } catch (error) {
        errorResponse(res, "Failed to get student plan", 500);
    }
};

export const getStudentExams = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const exams = await StudentService.getExams(userId);
        successResponse(res, exams);
    } catch (error) {
        errorResponse(res, "Failed to get student exams", 500);
    }
};

export const getStudentPractice = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const practice = await StudentService.getPractice(userId);
        successResponse(res, practice);
    } catch (error) {
        errorResponse(res, "Failed to get student practice", 500);
    }
};

export const getStudentProgress = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const progress = await StudentService.getProgress(userId);
        successResponse(res, progress);
    } catch (error) {
        errorResponse(res, "Failed to get student progress", 500);
    }
};

export const getStudentSettings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = await StudentService.getSettings(userId);
        successResponse(res, settings);
    } catch (error) {
        errorResponse(res, "Failed to get student settings", 500);
    }
};

export const updateStudentSettings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = req.body;
        const result = await StudentService.updateSettings(userId, settings);
        successResponse(res, result);
    } catch (error) {
        errorResponse(res, "Failed to update student settings", 500);
    }
};

export const getStudentTimer = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const timer = await StudentService.getTimer(userId);
        successResponse(res, timer);
    } catch (error) {
        errorResponse(res, "Failed to get student timer", 500);
    }
};

export const uploadStudentNote = async (req: FileUploadRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        // Assuming file is handled by multer middleware
        const result = await StudentService.uploadNote(userId, req.file || req.body);
        successResponse(res, result);
    } catch (error) {
        errorResponse(res, "Failed to upload note", 500);
    }
};

export const saveStudentSubjects = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subjects } = req.body;
        await StudentService.saveSubjects(userId, subjects);
        successResponse(res, { message: "Subjects saved" });
    } catch (error) {
        errorResponse(res, "Failed to save subjects", 500);
    }
};

export const completeStudyPlanItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { itemId } = req.params;
        if (!itemId) {
            return errorResponse(res, "Item ID required", 400);
        }
        await StudentService.completeItem(userId, itemId);
        successResponse(res, { message: "Item completed" });
    } catch (error) {
        errorResponse(res, "Failed to complete item", 500);
    }
};

export const saveExam = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subject, questions } = req.body;
        const exam = await StudentService.saveExam(userId, subject, questions);
        successResponse(res, exam);
    } catch (error) {
        errorResponse(res, "Failed to save exam", 500);
    }
};

export const getChatSessions = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const sessions = await StudentService.getChatSessions(userId);
        successResponse(res, sessions);
    } catch (error) {
        errorResponse(res, "Failed to get chat sessions", 500);
    }
};