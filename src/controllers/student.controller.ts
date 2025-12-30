import { Request, Response } from "express";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

import { StudentService } from '../services/student.service.js';
import { AuthenticatedRequest, FileUploadRequest } from '../types/request.js';
import { successResponse, errorResponse } from "../utils/response.js";
import { aiService } from '../services/ai/ai.service.js';

export const getStudentDashboard = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const data = await StudentService.getDashboard(userId);
        return successResponse(res, data);
    } catch (error) {
        return errorResponse(res, "Failed to get student dashboard");
    }
};

export const getStudentSubjects = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const subjects = await StudentService.getSubjects(userId);
        return successResponse(res, subjects);
    } catch (error) {
        return errorResponse(res, "Failed to get student subjects", 500);
    }
};

export const generateStudyPlan = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }

        const { subjects, hoursPerDay = 4, examDate } = req.body;

        // 1. Validate Request
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return errorResponse(res, "Subjects must be a non-empty array", 400);
        }

        // 2. Build Strong AI Prompt
        const buildStudyPlanPrompt = (subs: string[]) => `
You are an expert academic planner. Create a realistic daily study plan for a student.
Subjects to cover: ${subs.join(", ")}
Available hours per day: ${hoursPerDay}
Target Exam Date: ${examDate || 'Next month'}

STRICT RULES:
- Return ONLY valid JSON.
- No meta-talk or introduction.
- The output MUST be a JSON object with a "studyPlan" key.
- Each item must have: "subject", "date" (e.g., "Day 1"), and "tasks" (array of strings).

Format Example:
{
  "studyPlan": [
    {
      "subject": "Math",
      "date": "Day 1",
      "tasks": ["Algebra Review", "Practice Equations"]
    }
  ]
}
`.trim();

        const prompt = buildStudyPlanPrompt(subjects);

        // 3. AI Generation with Retry Logic
        let studyPlan: any[] = [];
        let attempts = 0;
        const maxAttempts = 2;

        while (attempts < maxAttempts && studyPlan.length === 0) {
            attempts++;
            try {
                const result = await aiService({
                    user: (req as AuthenticatedRequest).user,
                    tool: 'study-plan',
                    prompt
                });

                const aiResponse = result.reply || '';

                // Parse JSON safely
                try {
                    const parsed = JSON.parse(aiResponse);
                    studyPlan = parsed.studyPlan || [];
                } catch (e) {
                    // Try to extract JSON if AI included text
                    const jsonMatch = aiResponse.match(/\{[^]*\}/);
                    if (jsonMatch) {
                        const extracted = JSON.parse(jsonMatch[0]);
                        studyPlan = extracted.studyPlan || [];
                    }
                }
            } catch (err) {
                console.warn(`[Study Plan] AI attempt ${attempts} failed:`, err);
            }
        }

        // 4. Fallback if AI truly fails
        if (studyPlan.length === 0) {
            console.info("[Study Plan] AI failed all attempts. Using fallback.");
            studyPlan = subjects.map((sub, index) => ({
                subject: sub,
                date: `Day ${index + 1}`,
                tasks: [`Introduction to ${sub}`, `Core concepts of ${sub}`, `Practice problems`]
            }));
        }

        // 5. Final Response
        return res.status(200).json({
            success: true,
            studyPlan
        });

    } catch (error) {
        console.error('[Study Plan] Controller error:', error);
        return errorResponse(res, "Failed to generate study plan", 500);
    }
};

export const getStudentCourses = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const courses = await StudentService.getCourses(userId);
        return successResponse(res, courses);
    } catch (error) {
        return errorResponse(res, "Failed to get student courses", 500);
    }
};

export const sendStudentMessage = async (req: Request, res: Response): Promise<Response> => {
    const startTime = Date.now();

    try {
        // 1. Validate User Authorization
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            console.warn('[Student Chat] Unauthorized access attempt');
            return res.status(401).json({ error: "Unauthorized" });
        }

        // 2. Validate Request Payload
        const { message, messages } = req.body;

        // Check if messages array exists and is valid
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.warn(`[Student Chat] Invalid messages array from user ${userId}`);
            return res.status(400).json({ error: "Invalid messages array" });
        }

        // 3. Validate Message Content Length (prevent payload abuse)
        const MAX_MESSAGE_LENGTH = 10000; // 10k characters
        const lastMessage = messages[messages.length - 1];

        if (!lastMessage || typeof lastMessage.content !== 'string') {
            console.warn(`[Student Chat] Invalid message format from user ${userId}`);
            return res.status(400).json({ error: "Invalid message format" });
        }

        if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
            console.warn(`[Student Chat] Message too long (${lastMessage.content.length} chars) from user ${userId}`);
            return res.status(400).json({ error: "Message too long. Maximum 10,000 characters." });
        }

        // 4. Call Student Service with AI Integration
        let result;
        try {
            console.info(`[Student Chat] Processing request for user ${userId}`);
            result = await StudentService.sendMessage(userId, lastMessage.content);
        } catch (serviceError: any) {
            // Log the full error for debugging
            console.error('[Student Chat] Service error:', {
                userId,
                error: serviceError.message || serviceError,
                stack: serviceError.stack
            });

            // Check if it's a specific type of error
            if (serviceError.message?.includes('Prisma') || serviceError.message?.includes('database')) {
                console.error('[Student Chat] Database error detected');
            } else if (serviceError.message?.includes('network') || serviceError.message?.includes('ECONNREFUSED')) {
                console.error('[Student Chat] Network error detected');
            }

            // Return safe fallback message
            const duration = Date.now() - startTime;
            console.warn(`[Student Chat] Returning fallback message after ${duration}ms`);
            return res.status(200).json({
                reply: "Sorry, the AI could not generate a response. Please try again."
            });
        }

        // 5. Validate and Normalize Response
        if (!result || typeof result.reply !== 'string' || result.reply.trim() === '') {
            console.warn(`[Student Chat] Invalid or empty response from service for user ${userId}`);
            const duration = Date.now() - startTime;
            console.warn(`[Student Chat] Returning fallback message after ${duration}ms`);
            return res.status(200).json({
                reply: "Sorry, the AI could not generate a response. Please try again."
            });
        }

        // 6. Success - Log and Return
        const duration = Date.now() - startTime;
        console.info(`[Student Chat] Success for user ${userId} in ${duration}ms`);

        return res.status(200).json({ reply: result.reply });

    } catch (error: any) {
        // Final catch-all: Should never reach here, but just in case
        const duration = Date.now() - startTime;
        console.error('[Student Chat] Unexpected error:', {
            error: error.message || error,
            stack: error.stack,
            duration: `${duration}ms`
        });

        // Always return safe fallback, never expose internal errors
        return res.status(200).json({
            reply: "Sorry, the AI could not generate a response. Please try again."
        });
    }
};

export const getStudentNotes = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const notes = await StudentService.getNotes(userId);
        return successResponse(res, notes);
    } catch (error) {
        return errorResponse(res, "Failed to get student notes", 500);
    }
};

export const getStudentPlan = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const plan = await StudentService.getPlan(userId);
        return successResponse(res, plan);
    } catch (error) {
        return errorResponse(res, "Failed to get student plan", 500);
    }
};

export const getStudentExams = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const exams = await StudentService.getExams(userId);
        return successResponse(res, exams);
    } catch (error) {
        return errorResponse(res, "Failed to get student exams", 500);
    }
};

export const getStudentPractice = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const practice = await StudentService.getPractice(userId);
        return successResponse(res, practice);
    } catch (error) {
        return errorResponse(res, "Failed to get student practice", 500);
    }
};

export const getStudentProgress = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const progress = await StudentService.getProgress(userId);
        return successResponse(res, progress);
    } catch (error) {
        return errorResponse(res, "Failed to get student progress", 500);
    }
};

export const getStudentSettings = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = await StudentService.getSettings(userId);
        return successResponse(res, settings);
    } catch (error) {
        return errorResponse(res, "Failed to get student settings", 500);
    }
};

export const updateStudentSettings = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = req.body;
        const result = await StudentService.updateSettings(userId, settings);
        return successResponse(res, result);
    } catch (error) {
        return errorResponse(res, "Failed to update student settings", 500);
    }
};

export const getStudentTimer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const timer = await StudentService.getTimer(userId);
        return successResponse(res, timer);
    } catch (error) {
        return errorResponse(res, "Failed to get student timer", 500);
    }
};

export const uploadNoteController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Assuming file is handled by multer middleware
        const result = await StudentService.uploadNote(userId, (req as FileUploadRequest).file || req.body);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to upload note" });
    }
};

export const processPDFNotes = async (req: Request, res: Response): Promise<Response> => {
    try {
        // 1. Validate User
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // 2. Validate File
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // 3. Extract Text from PDF
        let pdfText = '';
        try {
            // Safe pdf-parse call for ESM/CommonJS compatibility
            const pdfParser = typeof pdf === 'function' ? pdf : (pdf as any).default;
            const data = await pdfParser(req.file.buffer);
            pdfText = data.text || '';
        } catch (pdfError: any) {
            console.error('[PDF Notes] PDF parse error:', pdfError);
            return res.status(500).json({
                success: false,
                message: "Failed to parse PDF content."
            });
        }

        // 4. Validate Extracted Text
        if (!pdfText.trim()) {
            return res.status(400).json({
                success: false,
                message: "The PDF contains no readable text."
            });
        }

        // 5. Build AI Prompt
        const prompt = `
Generate clear, simple, and educational bullet points from the provided text.
STRICT RULES:
- Return ONLY a JSON object with a "notes" key containing an array of strings.
- Each bullet point must be a clean educational note.
- NO meta-phrases, NO introductions, NO conclusions (e.g., dont say "Here are your notes").
- If the text is too long, prioritize the most important concepts.

Text:
${pdfText.substring(0, 10000)}
`.trim();

        // 6. Call AI Service (AI Service handles OpenAI -> Grok fallback automatically)
        try {
            const result = await aiService({
                user: (req as AuthenticatedRequest).user,
                tool: 'pdf-notes',
                prompt
            });

            const aiResponse = result.reply || '';

            // 7. Parse and Validate AI Response
            let notes: string[] = [];
            try {
                // Try to find JSON in the response
                const jsonMatch = aiResponse.match(/\{[^]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
                const parsed = JSON.parse(jsonStr);
                notes = parsed.notes || [];
            } catch (pError) {
                // Fallback: Split by lines if JSON parsing fails
                notes = aiResponse.split('\n')
                    .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
                    .filter(line => line.length > 5);
            }

            if (notes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Could not extract clear notes from the content. Please try a different PDF."
                });
            }

            return res.status(200).json({
                success: true,
                notes
            });

        } catch (aiError: any) {
            console.error('[PDF Notes] AI Error:', aiError.message);
            return res.status(500).json({
                success: false,
                message: "AI processing failed. Please try again later."
            });
        }

    } catch (error: any) {
        console.error('[PDF Notes] Global Error:', error);
        return res.status(500).json({
            success: false,
            message: "An unexpected server error occurred."
        });
    }
};

export const saveStudentSubjects = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subjects } = req.body;
        await StudentService.saveSubjects(userId, subjects);
        return successResponse(res, { message: "Subjects saved" });
    } catch (error) {
        return errorResponse(res, "Failed to save subjects", 500);
    }
};

export const completeStudyPlanItem = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { itemId } = req.params;
        if (!itemId) {
            return errorResponse(res, "Item ID required", 400);
        }
        await StudentService.completeItem(userId, itemId);
        return successResponse(res, { message: "Item completed" });
    } catch (error) {
        return errorResponse(res, "Failed to complete item", 500);
    }
};

export const saveExam = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subject, questions } = req.body;
        const exam = await StudentService.saveExam(userId, subject, questions);
        return successResponse(res, exam);
    } catch (error) {
        return errorResponse(res, "Failed to save exam", 500);
    }
};

export const getChatSessions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const sessions = await StudentService.getChatSessions(userId);
        return successResponse(res, sessions);
    } catch (error) {
        return errorResponse(res, "Failed to get chat sessions", 500);
    }
};