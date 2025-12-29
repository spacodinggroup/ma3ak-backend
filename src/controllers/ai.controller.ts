import { aiService } from "../services/ai/ai.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const generateAI = async (req: any, res: any) => {
    try {
        const { tool, prompt, provider } = req.body;

        if (!tool || !prompt) {
            return res.json({ reply: "Missing AI data" });
        }

        const result = await aiService({
            user: req.user,
            tool,
            prompt,
            provider,
        });

        // 3️⃣ CONTROLLER ENFORCEMENT
        // If reply is invalid → force fallback message
        if (!result || typeof result.reply !== 'string' || result.reply.trim() === '') {
            return res.json({ reply: "Sorry, the AI could not generate a response. Please try again." });
        }

        return res.json(result);
    } catch (err) {
        // Catch ALL errors and return a safe fallback message
        console.error("AI Generation Error:", err);
        return res.json({ reply: "Sorry, the AI could not generate a response. Please try again." });
    }
};

export const generateStudyPlan = async (req: any, res: any) => {
    const startTime = Date.now();

    try {
        // 1. Validate subjects array
        const { subjects } = req.body;

        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            console.warn('[Study Plan] Invalid subjects array');
            return res.status(400).json({
                studyPlan: [],
                error: "Invalid subjects array. Please provide at least one subject."
            });
        }

        // Validate each subject is a string
        if (!subjects.every((s: any) => typeof s === 'string' && s.trim().length > 0)) {
            console.warn('[Study Plan] Subjects must be non-empty strings');
            return res.status(400).json({
                studyPlan: [],
                error: "All subjects must be non-empty strings."
            });
        }

        // 2. Build prompt for AI
        const prompt = `Generate a detailed study plan for the following subjects: ${subjects.join(', ')}. 
Return a JSON array with this exact format:
[{"subject": "SubjectName", "date": "YYYY-MM-DD", "tasks": ["task1", "task2", "task3"]}]
Each subject should have a date and at least 3 specific study tasks.`;

        // 3. Call AI service with fallback
        let aiResponse = '';
        try {
            console.info(`[Study Plan] Generating plan for ${subjects.length} subjects`);
            const result = await aiService({
                user: req.user,
                tool: 'study-plan',
                prompt
            });
            aiResponse = result.reply || '';
        } catch (aiError: any) {
            console.error('[Study Plan] AI service error:', aiError.message || aiError);
            const duration = Date.now() - startTime;
            console.warn(`[Study Plan] Returning fallback after ${duration}ms`);
            return res.status(200).json({
                studyPlan: [],
                error: "Sorry, the AI could not generate a study plan. Please try again."
            });
        }

        // 4. Parse and normalize AI response
        let studyPlan: any[] = [];
        try {
            // Try to parse as JSON
            const parsed = JSON.parse(aiResponse);
            if (Array.isArray(parsed)) {
                studyPlan = parsed;
            } else if (parsed.studyPlan && Array.isArray(parsed.studyPlan)) {
                studyPlan = parsed.studyPlan;
            }
        } catch (parseError) {
            // AI returned non-JSON, try to extract JSON from text
            const jsonMatch = aiResponse.match(/\[.*\]/s);
            if (jsonMatch) {
                try {
                    studyPlan = JSON.parse(jsonMatch[0]);
                } catch (e) {
                    console.error('[Study Plan] Could not parse extracted JSON');
                }
            }
        }

        // 5. Validate study plan structure
        if (!Array.isArray(studyPlan) || studyPlan.length === 0) {
            console.warn('[Study Plan] Invalid or empty study plan from AI');
            const duration = Date.now() - startTime;
            console.warn(`[Study Plan] Returning fallback after ${duration}ms`);
            return res.status(200).json({
                studyPlan: [],
                error: "Sorry, the AI could not generate a study plan. Please try again."
            });
        }

        // 6. Ensure each item has required fields
        const normalizedPlan = studyPlan.map((item: any) => ({
            subject: item.subject || item.name || 'Unknown Subject',
            date: item.date || new Date().toISOString().split('T')[0],
            tasks: Array.isArray(item.tasks) ? item.tasks.filter((t: any) => typeof t === 'string') : ['Study this subject']
        }));

        // 7. Success - return study plan
        const duration = Date.now() - startTime;
        console.info(`[Study Plan] Success - generated plan for ${normalizedPlan.length} subjects in ${duration}ms`);

        return res.status(200).json({ studyPlan: normalizedPlan });

    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error('[Study Plan] Unexpected error:', {
            error: error.message || error,
            stack: error.stack,
            duration: `${duration}ms`
        });

        return res.status(200).json({
            studyPlan: [],
            error: "Sorry, the AI could not generate a study plan. Please try again."
        });
    }
};