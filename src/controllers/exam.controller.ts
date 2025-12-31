import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/request.js";
import { aiService } from "../services/ai/ai.service.js";
import { prisma } from "../prisma/client.js";
import { StudentService } from "../services/student.service.js";

export const generateExam = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { subject } = req.body;
        if (!subject) return res.status(400).json({ success: false, message: "Subject is required" });

        // 1. Determine Difficulty based on past performance
        const { averageScore: avgScore } = await StudentService.getPastPerformance(userId);
        let difficulty = "average";
        if (avgScore < 40) difficulty = "weak";
        else if (avgScore > 80) difficulty = "strong";

        // 2. Build AI Prompt
        const prompt = `
Generate a smart, adaptive exam for the subject: ${subject}.
Student Level: ${difficulty} (Adaptive based on past score: ${avgScore.toFixed(0)}%).

STRICT RULES:
- Include exactly 10 questions.
- Mix of MCQ (5), Short Answer (3), and Problem Solving (2).
- Follow a progressive difficulty curve.
- Return ONLY valid JSON.

JSON Structure:
{
  "subject": "${subject}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": "q1",
      "type": "MCQ",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "...",
      "points": 5
    },
    {
      "id": "q6",
      "type": "SHORT",
      "question": "...",
      "correctAnswer": "...",
      "points": 10
    },
    {
      "id": "q9",
      "type": "PROBLEM",
      "question": "...",
      "correctAnswer": "...",
      "points": 20
    }
  ]
}
`.trim();

        // 3. AI Generation
        const result = await aiService({
            user: (req as AuthenticatedRequest).user,
            tool: 'exam-generation',
            prompt
        });

        const aiResponse = result.reply || '';
        let examData;
        try {
            const jsonMatch = aiResponse.match(/\{[^]*\}/);
            examData = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
        } catch (e) {
            throw new Error("AI failed to produce valid exam JSON");
        }

        // 4. Save Exam
        const exam = await prisma.exam.create({
            data: {
                userId,
                subject: examData.subject || subject,
                questions: examData.questions
            }
        });

        return res.status(200).json({
            success: true,
            examId: exam.id,
            questions: examData.questions
        });

    } catch (error) {
        console.error('[Generate Exam] Error:', error instanceof Error ? error.message : error);
        return res.status(500).json({ success: false, message: "Failed to generate exam" });
    }
};

export const submitExam = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { examId, answers } = req.body;
        if (!examId || !answers) return res.status(400).json({ success: false, message: "Exam ID and answers are required" });

        const exam = await prisma.exam.findUnique({ where: { id: examId } });
        if (!exam || exam.userId !== userId) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // 1. Call AI to Grade Pedagogically
        const prompt = `
Grade the following exam submission.
Subject: ${exam.subject}
Questions: ${JSON.stringify(exam.questions)}
Student Answers: ${JSON.stringify(answers)}

STRICT RULES:
- Calculate a total score out of 100.
- Detect weak topics based on incorrect answers.
- Provide actionable improvement advice.
- Return ONLY valid JSON.

JSON Structure:
{
  "score": number,
  "level": "struggling" | "improving" | "strong",
  "weakTopics": ["Topic 1", "Topic 2"],
  "advice": ["Action 1", "Action 2"]
}
`.trim();

        const result = await aiService({
            user: (req as AuthenticatedRequest).user,
            tool: 'exam-grading',
            prompt
        });

        const aiResponse = result.reply || '';
        let grading;
        try {
            const jsonMatch = aiResponse.match(/\{[^]*\}/);
            grading = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
        } catch (e) {
            // Manual grading fallback logic if AI fails
            const score = 0; // Better safe than crash
            grading = { score, level: "struggling", weakTopics: ["Unknown"], advice: ["Review your study materials again."] };
        }

        // 2. Save Attempt
        await prisma.examAttempt.create({
            data: {
                examId,
                answers,
                score: grading.score,
                duration: 0 // Placeholder
            }
        });

        // 3. Update User Aggregate Score
        const attempts = await prisma.examAttempt.findMany({
            where: { exam: { userId } },
            select: { score: true }
        });
        const avg = attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length;

        await prisma.user.update({
            where: { id: userId },
            data: { averageScore: avg }
        });

        return res.status(200).json({
            success: true,
            score: grading.score,
            level: grading.level,
            weakTopics: grading.weakTopics,
            advice: grading.advice
        });

    } catch (error) {
        console.error('[Submit Exam] Error:', error instanceof Error ? error.message : error);
        return res.status(500).json({ success: false, message: "Failed to process exam submission" });
    }
};
