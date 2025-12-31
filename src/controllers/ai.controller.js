import { aiService } from "../services/ai/ai.service.js";
export const generateAI = async (req, res) => {
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
    }
    catch (err) {
        // Catch ALL errors and return a safe fallback message
        console.error("AI Generation Error:", err);
        return res.json({ reply: "Sorry, the AI could not generate a response. Please try again." });
    }
};
/**
 * Generates a manual educational fallback study plan if the AI fails.
 */
const generateFallbackPlan = (subjects, level) => {
    return subjects.map((subject, index) => ({
        day: `Day ${index + 1}`,
        focus: level === "weak" ? "Foundations" : "Core Concepts",
        subjects: [
            {
                name: subject,
                topics: [`Introduction to ${subject}`, `${subject} fundamentals`],
                tasks: ["Read introductory material", "Solve level-appropriate exercises", "Self-assessment"]
            }
        ]
    }));
};
export const generateStudyPlan = async (req, res) => {
    const startTime = Date.now();
    try {
        // 1. Validate Input
        const { subjects, level = "average", availableHoursPerDay = 4, examDate } = req.body;
        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a non-empty array of subjects."
            });
        }
        // 2. Build Pedagogical AI Prompt
        const prompt = `
Act as a Senior Curriculum Designer and Expert Tutor. 
Create a ${level} level study plan for a student who can study ${availableHoursPerDay} hours per day.
Goal: Improve the student's academic level through a progressive learning path.

Subjects: ${subjects.join(', ')}
${examDate ? `Target Exam Date: ${examDate}` : ""}

STRICT PEDAGOGICAL PHASES:
- Phase 1 (Foundations): Focus on basics, definitions, and logic for students.
- Phase 2 (Immersion): Progressive difficulty, connecting concepts.
- Phase 3 (Excellence): Exam simulation, practice problems, and revision.

STRICT OUTPUT RULES:
- Return ONLY valid JSON.
- DO NOT use meta-phrases (e.g., "Sure, here is your plan", "I hope this helps").
- Teach like a real teacher: prioritize understanding and student improvement.
- The plan should cover at least 7 days or the most critical path for the subjects.

JSON Structure:
{
  "studyPlan": [
    {
      "day": "Day 1",
      "focus": "String description of pedagogical focus",
      "subjects": [
        {
          "name": "Subject Name",
          "topics": ["Topic 1", "Topic 2"],
          "tasks": ["Actionable task 1", "Actionable task 2"]
        }
      ]
    }
  ]
}
`.trim();
        // 3. AI Generation with Fallback (OpenAI -> Grok handled by aiService)
        let aiResponse = '';
        try {
            const result = await aiService({
                user: req.user,
                tool: 'study-plan',
                prompt
            });
            aiResponse = result.reply || '';
        }
        catch (aiError) {
            console.error('[Study Plan] AI Error:', aiError.message);
            // Switch to manual fallback immediately if service throws
        }
        // 4. Robust Parsing and Regex Fallback
        let studyPlan = [];
        if (aiResponse) {
            try {
                // Try clean JSON parse
                const parsed = JSON.parse(aiResponse);
                studyPlan = parsed.studyPlan || (Array.isArray(parsed) ? parsed : []);
            }
            catch (pError) {
                // Try regex extraction if AI included text
                const jsonMatch = aiResponse.match(/\{[^]*\}/);
                if (jsonMatch) {
                    try {
                        const extracted = JSON.parse(jsonMatch[0]);
                        studyPlan = extracted.studyPlan || [];
                    }
                    catch (e) {
                        console.warn('[Study Plan] Failed to parse extracted JSON');
                    }
                }
            }
        }
        // 5. Final Fallback Check
        if (!Array.isArray(studyPlan) || studyPlan.length === 0) {
            console.warn('[Study Plan] AI failed to produce valid plan. Using manual fallback.');
            studyPlan = generateFallbackPlan(subjects, level);
        }
        // 6. Response Construction
        return res.status(200).json({
            success: true,
            studyPlan
        });
    }
    catch (error) {
        console.error('[Study Plan] Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while generating your study plan."
        });
    }
};
//# sourceMappingURL=ai.controller.js.map