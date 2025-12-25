import { StudentDashboardResponse } from '../types/dashboard.js';
export declare class StudentService {
    static getDashboard(userId: string): Promise<StudentDashboardResponse>;
    static getSubjects(userId: string): Promise<{
        id: string;
        name: string;
        progress: number;
        topics: number;
        completed: number;
    }[]>;
    static generateStudyPlan(userId: string, payload: any): Promise<{
        dailyPlan: {
            day: string;
            subjects: string[];
            hours: number;
        }[];
        totalHours: number;
        examDate: any;
    }>;
    static getCourses(userId: string): Promise<{
        id: string;
        name: string;
        instructor: string;
        progress: number;
        nextLesson: string;
    }[]>;
    static sendMessage(userId: string, message: string): Promise<{
        message: string;
        suggestions: string[];
    }>;
    static getNotes(userId: string): Promise<{
        id: string;
        title: string;
        subject: string;
        date: string;
        pages: number;
    }[]>;
    static getPlan(userId: string): Promise<{
        weekly: {
            day: string;
            tasks: string[];
            completed: number;
        }[];
        goals: {
            weeklyHours: number;
            currentHours: number;
            subjects: number;
            completedSubjects: number;
        };
    }>;
    static getExams(userId: string): Promise<{
        id: string;
        subject: string;
        date: string;
        time: string;
        readiness: number;
        topics: string[];
    }[]>;
    static getPractice(userId: string): Promise<{
        quizzes: {
            id: string;
            subject: string;
            title: string;
            questions: number;
            difficulty: string;
            score: number;
        }[];
        flashcards: {
            id: string;
            subject: string;
            title: string;
            cards: number;
            mastered: number;
        }[];
    }>;
    static getProgress(userId: string): Promise<{
        overall: {
            completed: number;
            total: number;
            percentage: number;
        };
        subjects: {
            name: string;
            completed: number;
            total: number;
            percentage: number;
        }[];
        weekly: {
            week: string;
            hours: number;
            topics: number;
        }[];
    }>;
    static getSettings(userId: string): Promise<{
        notifications: boolean;
        reminders: boolean;
        studyReminders: boolean;
        language: string;
        theme: string;
    }>;
    static updateSettings(userId: string, settings: any): Promise<{
        message: string;
        settings: any;
    }>;
    static getTimer(userId: string): Promise<{
        currentSession: {
            subject: string;
            time: number;
            goal: number;
        };
        today: {
            total: number;
            goal: number;
        };
        week: {
            total: number;
            goal: number;
        };
    }>;
    static uploadNote(userId: string, formData: any): Promise<{
        id: string;
        title: string;
        subject: string;
        pages: number;
        processed: boolean;
        summary: string;
    }>;
}
//# sourceMappingURL=student.service.d.ts.map