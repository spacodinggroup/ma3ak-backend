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
            return errorResponse(res, "Unauthorized", 401);
        }
        const subjects = await StudentService.getSubjects(userId);
        successResponse(res, subjects);
    }
    catch (error) {
        errorResponse(res, "Failed to get student subjects", 500);
    }
};
export const generateStudyPlan = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subjects, hoursPerDay, examDate } = req.body;
        const plan = await StudentService.generateStudyPlan(userId, { subjects, hoursPerDay, examDate });
        successResponse(res, plan);
    }
    catch (error) {
        errorResponse(res, "Failed to generate study plan", 500);
    }
};
export const getStudentCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const courses = await StudentService.getCourses(userId);
        successResponse(res, courses);
    }
    catch (error) {
        errorResponse(res, "Failed to get student courses", 500);
    }
};
export const sendStudentMessage = async (req, res) => {
    const startTime = Date.now();
    try {
        // 1. Validate User Authorization
        const userId = req.user?.id;
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
        }
        catch (serviceError) {
            // Log the full error for debugging
            console.error('[Student Chat] Service error:', {
                userId,
                error: serviceError.message || serviceError,
                stack: serviceError.stack
            });
            // Check if it's a specific type of error
            if (serviceError.message?.includes('Prisma') || serviceError.message?.includes('database')) {
                console.error('[Student Chat] Database error detected');
            }
            else if (serviceError.message?.includes('network') || serviceError.message?.includes('ECONNREFUSED')) {
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
    }
    catch (error) {
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
export const getStudentNotes = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const notes = await StudentService.getNotes(userId);
        successResponse(res, notes);
    }
    catch (error) {
        errorResponse(res, "Failed to get student notes", 500);
    }
};
export const getStudentPlan = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const plan = await StudentService.getPlan(userId);
        successResponse(res, plan);
    }
    catch (error) {
        errorResponse(res, "Failed to get student plan", 500);
    }
};
export const getStudentExams = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const exams = await StudentService.getExams(userId);
        successResponse(res, exams);
    }
    catch (error) {
        errorResponse(res, "Failed to get student exams", 500);
    }
};
export const getStudentPractice = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const practice = await StudentService.getPractice(userId);
        successResponse(res, practice);
    }
    catch (error) {
        errorResponse(res, "Failed to get student practice", 500);
    }
};
export const getStudentProgress = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const progress = await StudentService.getProgress(userId);
        successResponse(res, progress);
    }
    catch (error) {
        errorResponse(res, "Failed to get student progress", 500);
    }
};
export const getStudentSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = await StudentService.getSettings(userId);
        successResponse(res, settings);
    }
    catch (error) {
        errorResponse(res, "Failed to get student settings", 500);
    }
};
export const updateStudentSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = req.body;
        const result = await StudentService.updateSettings(userId, settings);
        successResponse(res, result);
    }
    catch (error) {
        errorResponse(res, "Failed to update student settings", 500);
    }
};
export const getStudentTimer = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const timer = await StudentService.getTimer(userId);
        successResponse(res, timer);
    }
    catch (error) {
        errorResponse(res, "Failed to get student timer", 500);
    }
};
export const uploadStudentNote = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        // Assuming file is handled by multer middleware
        const result = await StudentService.uploadNote(userId, req.file || req.body);
        successResponse(res, result);
    }
    catch (error) {
        errorResponse(res, "Failed to upload note", 500);
    }
};
export const processPDFNotes = async (req, res) => {
    const startTime = Date.now();
    try {
        // 1. Validate user
        const userId = req.user?.id;
        if (!userId) {
            console.warn('[PDF Notes] Unauthorized access attempt');
            return res.status(401).json({ notes: [] });
        }
        // 2. Validate PDF file
        if (!req.file) {
            console.warn('[PDF Notes] No file uploaded');
            return res.status(400).json({ notes: [] });
        }
        // 3. Extract text from PDF
        let pdfText = '';
        try {
            // Import pdf-parse as namespace (ESM compatible)
            const pdfParseModule = await import('pdf-parse');
            // pdf-parse is a CommonJS module, access the function directly
            const pdfParse = pdfParseModule;
            const pdfData = await pdfParse(req.file.buffer);
            pdfText = pdfData.text || '';
        }
        catch (pdfError) {
            console.error('[PDF Notes] PDF parsing error:', pdfError.message);
            return res.status(200).json({ notes: [] });
        }
        // 4. Handle empty PDF
        if (!pdfText || pdfText.trim().length === 0) {
            console.warn('[PDF Notes] Empty PDF content');
            return res.status(200).json({ notes: [] });
        }
        // 5. Build AI prompt for structured notes
        const prompt = `Extract and convert the following text into clear, actionable bullet points.

STRICT RULES:
- Return ONLY valid JSON, no extra text
- Do NOT include phrases like "I understand" or "Here are the notes"
- Each bullet point must be clear, concise, and actionable
- Remove redundant information
- Focus on key concepts and important details

Required output format:
{
  "notes": [
    "Clear actionable point 1",
    "Clear actionable point 2",
    "Clear actionable point 3"
  ]
}

Text to process:
${pdfText.slice(0, 8000)}`; // Limit to 8000 chars to avoid token limits
        // 6. Call AI service with fallback
        let aiResponse = '';
        try {
            console.info(`[PDF Notes] Processing PDF (${pdfText.length} chars) for user ${userId}`);
            const { aiService } = await import('../services/ai/ai.service.js');
            const result = await aiService({
                user: req.user,
                tool: 'pdf-notes',
                prompt
            });
            aiResponse = result.reply || '';
        }
        catch (aiError) {
            console.error('[PDF Notes] AI service error:', aiError.message || aiError);
            const duration = Date.now() - startTime;
            console.warn(`[PDF Notes] Returning empty notes after ${duration}ms`);
            return res.status(200).json({ notes: [] });
        }
        // 7. Parse AI response
        let notes = [];
        try {
            const parsed = JSON.parse(aiResponse);
            if (Array.isArray(parsed)) {
                notes = parsed.filter((n) => typeof n === 'string');
            }
            else if (parsed.notes && Array.isArray(parsed.notes)) {
                notes = parsed.notes.filter((n) => typeof n === 'string');
            }
        }
        catch (parseError) {
            // Try to extract JSON array from text
            const jsonMatch = aiResponse.match(/\{[^]*"notes"[^]*\[[^]*\][^]*\}/s);
            if (jsonMatch) {
                try {
                    const extracted = JSON.parse(jsonMatch[0]);
                    if (extracted.notes && Array.isArray(extracted.notes)) {
                        notes = extracted.notes.filter((n) => typeof n === 'string');
                    }
                }
                catch (e) {
                    console.error('[PDF Notes] Could not parse extracted JSON');
                }
            }
        }
        // 8. Validate result
        if (!Array.isArray(notes) || notes.length === 0) {
            console.warn('[PDF Notes] No valid notes extracted from AI response');
            const duration = Date.now() - startTime;
            console.warn(`[PDF Notes] Returning empty notes after ${duration}ms`);
            return res.status(200).json({ notes: [] });
        }
        // 9. Success
        const duration = Date.now() - startTime;
        console.info(`[PDF Notes] Success - extracted ${notes.length} notes in ${duration}ms`);
        return res.status(200).json({ notes });
    }
    catch (error) {
        const duration = Date.now() - startTime;
        console.error('[PDF Notes] Unexpected error:', {
            error: error.message || error,
            stack: error.stack,
            duration: `${duration}ms`
        });
        return res.status(200).json({ notes: [] });
    }
};
export const saveStudentSubjects = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subjects } = req.body;
        await StudentService.saveSubjects(userId, subjects);
        successResponse(res, { message: "Subjects saved" });
    }
    catch (error) {
        errorResponse(res, "Failed to save subjects", 500);
    }
};
export const completeStudyPlanItem = async (req, res) => {
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
    }
    catch (error) {
        errorResponse(res, "Failed to complete item", 500);
    }
};
export const saveExam = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subject, questions } = req.body;
        const exam = await StudentService.saveExam(userId, subject, questions);
        successResponse(res, exam);
    }
    catch (error) {
        errorResponse(res, "Failed to save exam", 500);
    }
};
export const getChatSessions = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const sessions = await StudentService.getChatSessions(userId);
        successResponse(res, sessions);
    }
    catch (error) {
        errorResponse(res, "Failed to get chat sessions", 500);
    }
};
//# sourceMappingURL=student.controller.js.map