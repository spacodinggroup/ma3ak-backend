import { StudentService } from '../services/student.service.js';
import { successResponse, errorResponse } from "../utils/response.js";
import { aiService } from '../services/ai/ai.service.js';
const ensurePdfRuntime = async () => {
    if (!globalThis.DOMMatrix) {
        globalThis.DOMMatrix = class DOMMatrix {
        };
    }
    if (!globalThis.DOMPoint) {
        globalThis.DOMPoint = class DOMPoint {
        };
    }
};
export const getStudentDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("[Dashboard] userId:", userId);
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const data = await StudentService.getDashboard(userId);
        return successResponse(res, data);
    }
    catch (error) {
        console.error("[Dashboard] error:", error?.message || error);
        return errorResponse(res, "Failed to get student dashboard");
    }
};
export const getStudentSubjects = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const subjects = await StudentService.getSubjects(userId);
        return successResponse(res, subjects);
    }
    catch (error) {
        return errorResponse(res, "Failed to get student subjects", 500);
    }
};
export const generateStudyPlan = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subjects, hoursPerDay, examDate } = req.body;
        const requestedHoursPerDay = Number(hoursPerDay);
        const safeHoursPerDay = Number.isFinite(requestedHoursPerDay) ? requestedHoursPerDay : 2;
        const clampedHoursPerDay = Math.max(1, Math.min(2, safeHoursPerDay));
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return errorResponse(res, "Subjects must be a non-empty array", 400);
        }
        const buildStudyPlanPrompt = (subs) => `
System Prompt:
You are an expert academic planner and professional teacher.
Your task is to create a REALISTIC, PRACTICAL, and ACTIONABLE study plan.

STRICT RULES:
- Start immediately with the study plan.
- Do NOT repeat the user’s request.
- Do NOT use phrases like: "I understand your question", "Here is a detailed explanation", "You are asking about".
- Do NOT include any meta commentary.
- Write only useful educational content.

STUDY PLAN REQUIREMENTS:
- Assume the student is learning for the first time.
- Adapt difficulty gradually from easy → medium → advanced.
- Focus on understanding, not memorization.
- Use simple, clear language.
- Be motivating but professional.
- Do NOT exceed realistic daily study time (1–2 hours max).

Subjects to cover: ${subs.join(", ")}
Available hours per day: ${clampedHoursPerDay}
Target Exam Date: ${examDate || 'Next month'}

MANDATORY OUTPUT FORMAT:
Return ONLY a JSON object with a "studyPlan" key.
Each item in "studyPlan" must have:
- "date": Day X (e.g. "Day 1")
- "subject": The subject being studied
- "topic": Short title of the day's lesson
- "content": Detailed instructions including "What to study", "Key concepts", and "Practice task" using bullet points.
- "duration": Estimated time in minutes (integer)

Example Object:
{
  "studyPlan": [
    {
      "date": "Day 1",
      "subject": "Math",
      "topic": "Algebra Basics",
      "content": "- What to study: Introduction to variables\\n- Key concepts: Solving for X\\n- Practice task: Complete 5 linear equations",
      "duration": 60
    }
  ]
}
`.trim();
        const prompt = buildStudyPlanPrompt(subjects);
        let studyPlan = [];
        let attempts = 0;
        const maxAttempts = 2;
        while (attempts < maxAttempts && studyPlan.length === 0) {
            attempts++;
            try {
                const result = await aiService({
                    user: req.user,
                    tool: 'study-plan',
                    prompt
                });
                const aiResponse = result.reply || '';
                try {
                    const parsed = JSON.parse(aiResponse);
                    studyPlan = parsed.studyPlan || [];
                }
                catch (e) {
                    const jsonMatch = aiResponse.match(/\{[^]*\}/);
                    if (jsonMatch) {
                        const extracted = JSON.parse(jsonMatch[0]);
                        studyPlan = extracted.studyPlan || [];
                    }
                }
            }
            catch (err) {
                console.warn(`[Study Plan] AI attempt ${attempts} failed:`, err);
            }
        }
        if (studyPlan.length === 0) {
            studyPlan = subjects.map((sub, index) => ({
                subject: sub,
                date: `Day ${index + 1}`,
                topic: `Introduction to ${sub}`,
                content: `- What to study: Core concepts of ${sub}\n- Practice task: Basic problems`,
                duration: 60
            }));
        }
        // PERSIST the study plan
        await StudentService.saveStudyPlan(userId, studyPlan);
        return res.status(200).json({
            success: true,
            studyPlan
        });
    }
    catch (error) {
        console.error('[Study Plan] Controller error:', error);
        return errorResponse(res, "Failed to generate study plan", 500);
    }
};
export const getStudentCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const courses = await StudentService.getCourses(userId);
        return successResponse(res, courses);
    }
    catch (error) {
        return errorResponse(res, "Failed to get student courses", 500);
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
        const { messages } = req.body;
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
        return successResponse(res, notes);
    }
    catch (error) {
        return errorResponse(res, "Failed to get student notes", 500);
    }
};
export const getStudentPlan = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const plan = await StudentService.getPlan(userId);
        return successResponse(res, plan);
    }
    catch (error) {
        return errorResponse(res, "Failed to get student plan", 500);
    }
};
export const getStudentExams = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const exams = await StudentService.getExams(userId);
        return successResponse(res, exams);
    }
    catch (error) {
        return errorResponse(res, "Failed to get student exams", 500);
    }
};
export const getStudentPractice = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const practice = await StudentService.getPractice(userId);
        return successResponse(res, practice);
    }
    catch (error) {
        return errorResponse(res, "Failed to get student practice", 500);
    }
};
export const getStudentProgress = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const progress = await StudentService.getProgress(userId);
        return successResponse(res, progress);
    }
    catch (error) {
        return errorResponse(res, "Failed to get student progress", 500);
    }
};
export const getStudentSettings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const settings = await StudentService.getSettings(userId);
        return successResponse(res, settings);
    }
    catch (error) {
        return errorResponse(res, "Failed to get student settings", 500);
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
        return successResponse(res, result);
    }
    catch (error) {
        return errorResponse(res, "Failed to update student settings", 500);
    }
};
export const getStudentTimer = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const timer = await StudentService.getTimer(userId);
        return successResponse(res, timer);
    }
    catch (error) {
        return errorResponse(res, "Failed to get student timer", 500);
    }
};
export const uploadNoteController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            // Requirement 6: Catch all exceptions, log, return safe JSON
            console.warn('[PDF Upload] Unauthorized access');
            return res.status(401).json({ notes: [] });
        }
        // 1. Requirement 2: Validate file existence
        if (!req.file) {
            console.warn('[PDF Upload] No file uploaded');
            return res.status(400).json({ notes: [] });
        }
        // 2. Requirement 2: Extract text using pdf-parse
        let pdfText = '';
        try {
            await ensurePdfRuntime();
            const pdfMod = await import('pdf-parse');
            const pdfParser = typeof pdfMod === 'function' ? pdfMod : (pdfMod?.default ?? pdfMod);
            const data = await pdfParser(req.file.buffer);
            pdfText = data.text || '';
        }
        catch (pdfError) {
            console.error('[PDF Upload] PDF parse error:', pdfError.message);
            return res.json({ notes: [] });
        }
        // 3. Requirement 2: If PDF text is empty
        if (!pdfText.trim()) {
            console.info('[PDF Upload] Empty PDF content');
            return res.json({ notes: [] });
        }
        // 4. Requirement 3: AI Processing
        const buildPrompt = (text) => `
Generate clear, simple, and student-friendly bullet points from the provided text.
STRICT RULES:
- Summarize the content effectively.
- Return ONLY a JSON object with a "notes" key containing an array of strings.
- NO meta-phrases, NO introductions, NO conclusions.

Text:
${text.substring(0, 10000)}
`.trim();
        try {
            const result = await aiService({
                user: req.user,
                tool: 'pdf-notes',
                prompt: buildPrompt(pdfText)
            });
            const aiResponse = result.reply || '';
            // 5. Requirement 4: Response Contract
            let finalNotes = [];
            try {
                // Try to extract JSON from AI response
                const jsonMatch = aiResponse.match(/\{[^]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
                const parsed = JSON.parse(jsonStr);
                finalNotes = parsed.notes || [];
            }
            catch (pError) {
                // Fallback parsing: split by lines
                finalNotes = aiResponse.split('\n')
                    .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
                    .filter(line => line.length > 5);
            }
            // Persistence: Requirements state student interactions must be saved
            if (finalNotes.length > 0) {
                await StudentService.uploadNote(userId, {
                    title: req.file.originalname || `PDF Note - ${new Date().toLocaleDateString()}`,
                    subject: req.body.subject || 'General Study',
                    content: finalNotes.join('\n'), // Store parsed notes
                    type: 'PDF'
                });
            }
            return res.status(200).json({ notes: finalNotes });
        }
        catch (aiError) {
            console.error('[PDF Upload] AI Processing error:', aiError.message);
            return res.json({ notes: [] });
        }
    }
    catch (error) {
        // Requirement 6: Catch all excepts, log server-side, return safe messages
        console.error('[PDF Upload] Global Error:', error.message);
        return res.json({ notes: [] });
    }
};
export const saveStudentSubjects = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subjects } = req.body;
        if (!subjects || !Array.isArray(subjects)) {
            return errorResponse(res, "Subjects must be an array", 400);
        }
        await StudentService.saveSubjects(userId, { subjects });
        return successResponse(res, { message: "Subjects saved" });
    }
    catch (error) {
        return errorResponse(res, "Failed to save subjects", 500);
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
        return successResponse(res, { message: "Item completed" });
    }
    catch (error) {
        if (error?.message === 'Unauthorized') {
            return errorResponse(res, "Forbidden", 403);
        }
        if (error?.message === 'NotFound') {
            return errorResponse(res, "Study plan item not found", 404);
        }
        return errorResponse(res, "Failed to complete item", 500);
    }
};
export const saveExamAttempt = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { examId, answers, score, duration } = req.body;
        if (!examId || !answers || score === undefined) {
            return errorResponse(res, "Missing required exam data", 400);
        }
        const attempt = await StudentService.submitExamAttempt(userId, examId, { answers, score, duration: duration || 0 });
        return successResponse(res, attempt);
    }
    catch (error) {
        if (error?.message === 'Unauthorized') {
            return errorResponse(res, "Forbidden", 403);
        }
        if (error?.message === 'NotFound') {
            return errorResponse(res, "Exam not found", 404);
        }
        return errorResponse(res, "Failed to save exam attempt", 500);
    }
};
export const saveExam = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const { subject, questions } = req.body;
        if (!subject || !questions) {
            return errorResponse(res, "Subject and questions are required", 400);
        }
        const exam = await StudentService.saveExam(userId, subject, questions);
        return successResponse(res, exam);
    }
    catch (error) {
        return errorResponse(res, "Failed to save exam", 500);
    }
};
export const getChatSessions = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }
        const sessions = await StudentService.getChatSessions(userId);
        return successResponse(res, sessions);
    }
    catch (error) {
        return errorResponse(res, "Failed to get chat sessions", 500);
    }
};
//# sourceMappingURL=student.controller.js.map