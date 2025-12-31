import { StudentDashboardResponse, StudyPlanItem } from '../types/dashboard.js';
interface Quiz {
    id: string;
    subject: string;
    title: string;
    questions: number;
    difficulty: string;
    score: number;
}
interface Flashcard {
    id: string;
    subject: string;
    title: string;
    cards: number;
    mastered: number;
}
interface PracticeData {
    quizzes: Quiz[];
    flashcards: Flashcard[];
}
interface OverallProgress {
    completed: number;
    total: number;
    percentage: number;
}
interface SubjectProgress {
    name: string;
    completed: number;
    total: number;
    percentage: number;
}
interface WeeklyProgress {
    week: string;
    hours: number;
    topics: number;
}
interface ProgressData {
    overall: OverallProgress;
    subjects: SubjectProgress[];
    weekly: WeeklyProgress[];
}
interface SubjectData {
    id: string;
    name: string;
    difficulty: string;
    hoursPerWeek: number;
    examDate: Date;
    createdAt: Date;
}
interface SaveSubjectsPayload {
    subjects: SubjectData[];
    hoursPerDay?: number;
    examDate?: Date;
}
interface SaveSubjectsResponse {
    id: string;
    dailyPlan: {
        subject: string;
        topic: string;
        time: string;
        duration: number;
    }[];
    totalHours: number;
}
interface Course {
    id: string;
    name: string;
    instructor: string;
    progress: number;
    nextLesson: string;
}
interface MessageResponse {
    reply: string;
}
interface Note {
    id: string;
    title: string;
    subject: string;
    date: string;
    pages: number;
}
interface WeeklyTask {
    day: string;
    tasks: string[];
    completed: number;
}
interface Goals {
    weeklyHours: number;
    currentHours: number;
    subjects: number;
    completedSubjects: number;
}
interface PlanResponse {
    weekly: WeeklyTask[];
    goals: Goals;
}
interface Exam {
    id: string;
    subject: string;
    date: string;
    time: string;
    readiness: number;
    topics: string[];
}
interface Settings {
    notifications: boolean;
    reminders: boolean;
    studyReminders: boolean;
    language: string;
    theme: string;
}
interface UpdateSettingsResponse {
    message: string;
    settings: Settings;
}
interface Timer {
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
}
interface NoteData {
    id: string;
    title: string;
    subject: string;
    fileUrl: string;
    type: string;
    createdAt: Date;
}
interface ExamData {
    id: string;
    subject: string;
    questions: any;
    userId: string;
    createdAt: Date;
}
interface ChatMessage {
    role: string;
    content: string;
    createdAt: Date;
}
interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
}
export declare class StudentService {
    static getDashboard(userId: string): Promise<StudentDashboardResponse>;
    static getSubjects(userId: string): Promise<SubjectData[]>;
    static getPastPerformance(userId: string): Promise<{
        averageScore: number;
        totalAttempts: number;
    }>;
    static saveSubjects(userId: string, payload: SaveSubjectsPayload): Promise<SaveSubjectsResponse>;
    static generateStudyPlan(userId: string, subjects?: string[]): Promise<{
        studyPlan: StudyPlanItem[];
    }>;
    static saveStudyPlan(userId: string, studyPlan: any[]): Promise<void>;
    static getCourses(userId: string): Promise<Course[]>;
    static sendMessage(userId: string, message: string): Promise<MessageResponse>;
    static getNotes(userId: string): Promise<Note[]>;
    static getPlan(userId: string): Promise<PlanResponse>;
    static getExams(userId: string): Promise<Exam[]>;
    static getPractice(userId: string): Promise<PracticeData>;
    static getProgress(userId: string): Promise<ProgressData>;
    static getSettings(userId: string): Promise<Settings>;
    static updateSettings(userId: string, settings: Settings): Promise<UpdateSettingsResponse>;
    static getTimer(userId: string): Promise<Timer>;
    static uploadNote(userId: string, data: any): Promise<NoteData>;
    static completeItem(userId: string, itemId: string): Promise<void>;
    static saveExam(userId: string, subject: string, questions: any): Promise<ExamData>;
    static submitExamAttempt(userId: string, examId: string, payload: {
        answers: any;
        score: number;
        duration: number;
    }): Promise<any>;
    static getChatSessions(userId: string): Promise<ChatSession[]>;
}
export {};
//# sourceMappingURL=student.service.d.ts.map