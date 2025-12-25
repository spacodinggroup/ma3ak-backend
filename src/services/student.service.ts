import { StudentDashboardResponse, StudyPlanItem, UpcomingExam, Subject, StudentStats } from '../types/dashboard.js';
import { prisma } from "../prisma/client.js";

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
  subjects: any[];
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

interface StudyPlanResponse {
  items: StudyPlanItem[];
}

interface Course {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  nextLesson: string;
}

interface MessageResponse {
  message: string;
  suggestions: string[];
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

interface UploadNoteData {
  title: string;
  subject: string;
  fileUrl: string;
  type?: string;
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

export class StudentService {
  static async getDashboard(userId: string): Promise<StudentDashboardResponse> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [plan, subjects, user] = await Promise.all([
      prisma.studyPlan.findFirst({
        where: { userId, date: today },
        include: { items: true }
      }),
      prisma.subject.findMany({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId } })
    ]);

    const studyPlan = plan ? plan.items.map((item: any) => ({
      topic: item.topic,
      subject: item.subject,
      time: item.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      duration: `${Math.floor(item.duration / 60)}h ${item.duration % 60}m`,
      completed: item.completed
    })) : [];

    const upcomingExam = subjects.map((subj: any) => ({
      subject: subj.name,
      daysLeft: Math.ceil((subj.examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      readiness: 50, // placeholder
      date: subj.examDate.toDateString()
    }));

    const subjList = subjects.map((subj: any) => ({
      name: subj.name,
      icon: "📚", // placeholder
      progress: 50 // placeholder
    }));

    const stats = user ? {
      streak: user.streak,
      hours: user.hoursStudied,
      topics: user.topicsCompleted,
      questions: user.questionsAsked,
      avgScore: user.averageScore,
      hoursThisWeek: 0, // placeholder
      topicsThisWeek: 0,
      questionsThisWeek: 0,
      avgScoreChange: 0
    } : { streak: 0, hours: 0, topics: 0, questions: 0, avgScore: 0, hoursThisWeek: 0, topicsThisWeek: 0, questionsThisWeek: 0, avgScoreChange: 0 };

    return {
      studyPlan,
      upcomingExam,
      subjects: subjList,
      Stats: stats
    };
  }

  static async getSubjects(userId: string): Promise<SubjectData[]> {
    const subjects = await prisma.subject.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        difficulty: true,
        hoursPerWeek: true,
        examDate: true,
        createdAt: true
      }
    });
    return subjects;
  }

  static async saveSubjects(userId: string, payload: SaveSubjectsPayload): Promise<SaveSubjectsResponse> {
    const { subjects, hoursPerDay, examDate } = payload;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create subjects
    await prisma.subject.createMany({
      data: subjects.map((s: any) => ({ ...s, userId }))
    });

    // Create plan
    const plan = await prisma.studyPlan.create({
      data: {
        date: today,
        userId,
        items: {
          create: subjects.map((subj: any, index: number) => ({
            subject: subj.name,
            topic: 'Study ' + subj.name,
            time: new Date(today.getTime() + index * 2 * 60 * 60 * 1000), // 2 hours apart
            duration: 60 // 1 hour
          }))
        }
      },
      include: { items: true }
    });

    return {
      id: plan.id,
      dailyPlan: plan.items.map((item: any) => ({
        subject: item.subject,
        topic: item.topic,
        time: item.time.toISOString(),
        duration: item.duration
      })),
      totalHours: plan.items.reduce((sum: number, item: any) => sum + item.duration / 60, 0),
    };
  }

  static async generateStudyPlan(userId: string, payload?: any): Promise<StudyPlanResponse> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const plan = await prisma.studyPlan.findFirst({
      where: { userId, date: today },
      include: { items: true }
    });
    if (!plan) return { items: [] };
    return {
      items: plan.items.map((item: any) => ({
        subject: item.subject,
        topic: item.topic,
        time: item.time,
        duration: item.duration,
        completed: item.completed
      }))
    };
  }

  static async getCourses(userId: string): Promise<Course[]> {
    return [
      { id: "1", name: "Advanced Calculus", instructor: "Dr. Smith", progress: 75, nextLesson: "Integration Techniques" },
      { id: "2", name: "Quantum Physics", instructor: "Prof. Johnson", progress: 60, nextLesson: "Wave Functions" },
      { id: "3", name: "Organic Chemistry", instructor: "Dr. Brown", progress: 45, nextLesson: "Reaction Mechanisms" }
    ];
  }

  static async sendMessage(userId: string, message: string): Promise<MessageResponse> {
    // Find or create session
    let session = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId, title: 'Study Chat' }
      });
    }

    // Add user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'USER',
        content: message
      }
    });

    // Simulate AI response
    const aiResponse = `I understand you're asking about: "${message}". Here's a detailed explanation...`;

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'ASSISTANT',
        content: aiResponse
      }
    });

    // Update user stats
    await prisma.user.update({
      where: { id: userId },
      data: { questionsAsked: { increment: 1 } }
    });

    return {
      message: aiResponse,
      suggestions: ["Try this practice problem", "Watch this video", "Read this chapter"]
    };
  }

  static async getNotes(userId: string): Promise<Note[]> {
    return [
      { id: "1", title: "Calculus Notes", subject: "Mathematics", date: "2024-12-20", pages: 5 },
      { id: "2", title: "Physics Formulas", subject: "Physics", date: "2024-12-18", pages: 3 },
      { id: "3", title: "Chemistry Reactions", subject: "Chemistry", date: "2024-12-15", pages: 7 }
    ];
  }

  static async getPlan(userId: string): Promise<PlanResponse> {
    return {
      weekly: [
        { day: "Monday", tasks: ["Math homework", "Physics reading"], completed: 2 },
        { day: "Tuesday", tasks: ["Chemistry lab", "English essay"], completed: 1 },
        { day: "Wednesday", tasks: ["Math practice", "History notes"], completed: 3 }
      ],
      goals: { weeklyHours: 15, currentHours: 12, subjects: 4, completedSubjects: 3 }
    };
  }

  static async getExams(userId: string): Promise<Exam[]> {
    const subjects = await prisma.subject.findMany({ where: { userId } });
    return subjects.map((subj: any) => ({
      id: subj.id,
      subject: subj.name,
      date: subj.examDate.toISOString().split('T')[0],
      time: "10:00 AM", // placeholder
      readiness: 50, // placeholder
      topics: [subj.name] // placeholder
    }));
  }

  static async getPractice(userId: string): Promise<PracticeData> {
    return {
      quizzes: [
        { id: "1", subject: "Mathematics", title: "Calculus Quiz", questions: 20, difficulty: "Hard", score: 85 },
        { id: "2", subject: "Physics", title: "Mechanics Test", questions: 15, difficulty: "Medium", score: 78 }
      ],
      flashcards: [
        { id: "1", subject: "Chemistry", title: "Organic Reactions", cards: 50, mastered: 35 },
        { id: "2", subject: "English", title: "Vocabulary", cards: 100, mastered: 80 }
      ]
    };
  }

  static async getProgress(userId: string): Promise<ProgressData> {
    return {
      overall: { completed: 75, total: 100, percentage: 75 },
      subjects: [
        { name: "Mathematics", completed: 34, total: 45, percentage: 75 },
        { name: "Physics", completed: 23, total: 38, percentage: 60 },
        { name: "Chemistry", completed: 23, total: 52, percentage: 44 }
      ],
      weekly: [
        { week: "Week 1", hours: 12, topics: 8 },
        { week: "Week 2", hours: 15, topics: 10 },
        { week: "Week 3", hours: 10, topics: 6 }
      ]
    };
  }

  static async getSettings(userId: string): Promise<Settings> {
    return {
      notifications: true,
      reminders: true,
      studyReminders: true,
      language: "en",
      theme: "light"
    };
  }

  static async updateSettings(userId: string, settings: Settings): Promise<UpdateSettingsResponse> {
    return { message: "Settings updated", settings };
  }

  static async getTimer(userId: string): Promise<Timer> {
    return {
      currentSession: { subject: "Mathematics", time: 0, goal: 90 },
      today: { total: 240, goal: 300 },
      week: { total: 1800, goal: 2100 }
    };
  }

  static async uploadNote(userId: string, formData: UploadNoteData): Promise<NoteData> {
    const { title, subject, fileUrl, type } = formData;
    const note = await prisma.note.create({
      data: {
        title,
        subject,
        fileUrl,
        type: (type || 'NOTE') as any,
        userId
      }
    });
    return {
      id: note.id,
      title: note.title,
      subject: note.subject,
      fileUrl: note.fileUrl,
      type: note.type,
      createdAt: note.createdAt
    };
  }

  static async completeItem(userId: string, itemId: string): Promise<void> {
    const item = await prisma.studyPlanItem.update({
      where: { id: itemId },
      data: { completed: true },
      include: { plan: true }
    });
    if (item.plan.userId !== userId) throw new Error('Unauthorized');

    // Update user stats
    await prisma.user.update({
      where: { id: userId },
      data: {
        topicsCompleted: { increment: 1 },
        hoursStudied: { increment: item.duration / 60 },
        lastActiveAt: new Date()
      }
    });

    // Update streak
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
      if (lastActive) {
        lastActive.setHours(0, 0, 0, 0);
        const diffDays = (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          await prisma.user.update({
            where: { id: userId },
            data: { streak: { increment: 1 } }
          });
        } else if (diffDays > 1) {
          await prisma.user.update({
            where: { id: userId },
            data: { streak: 1 }
          });
        }
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { streak: 1 }
        });
      }
    }
  }

  static async saveExam(userId: string, subject: string, questions: any): Promise<ExamData> {
    return await prisma.exam.create({
      data: {
        subject,
        questions,
        userId
      }
    });
  }

  static async getChatSessions(userId: string): Promise<ChatSession[]> {
    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return sessions.map((session: any) => ({
      id: session.id,
      title: session.title,
      messages: session.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt
      })),
      createdAt: session.createdAt
    }));
  }
}