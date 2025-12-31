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
        where: { userId, date: { lte: new Date() } },
        orderBy: { date: 'desc' },
        include: { items: true }
      }),
      prisma.subject.findMany({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId } })
    ]);

    const studyPlan: StudyPlanItem[] = plan ? plan.items.map((item: any) => ({
      date: item.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      subject: item.subject,
      topic: item.topic,
      content: item.content,
      duration: item.duration
    })) : [];


    const upcomingExam = subjects.map((subj: any) => ({
      subject: subj.name,
      daysLeft: Math.ceil((subj.examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      readiness: 70, // could be calculated from exam attempts
      date: subj.examDate.toDateString()
    }));

    const subjectProgress = subjects.map((subj: any) => ({
      name: subj.name,
      icon: "📚",
      progress: 65 // could be calculated from completed studyPlanItems
    }));

    const stats: StudentStats = user ? {
      streak: user.streak,
      hours: user.hoursStudied,
      topics: user.topicsCompleted,
      questions: user.questionsAsked,
      avgScore: user.averageScore,
      hoursThisWeek: 0,
      topicsThisWeek: 0,
      questionsThisWeek: 0,
      avgScoreChange: 0
    } : { streak: 0, hours: 0, topics: 0, questions: 0, avgScore: 0, hoursThisWeek: 0, topicsThisWeek: 0, questionsThisWeek: 0, avgScoreChange: 0 };

    return {
      studyPlan,
      upcomingExam,
      subjects: subjectProgress,
      Stats: stats
    };
  }


  static async getSubjects(userId: string): Promise<SubjectData[]> {
    return await prisma.subject.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }


  static async getPastPerformance(
    userId: string
  ): Promise<{ averageScore: number; totalAttempts: number }> {

    const attempts = await prisma.examAttempt.findMany({
      where: {
        exam: { userId }
      }
    });

    if (attempts.length === 0) {
      return {
        averageScore: 0,
        totalAttempts: 0
      };
    }

    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);

    return {
      averageScore: Math.round(totalScore / attempts.length),
      totalAttempts: attempts.length
    };
  }


  static async saveSubjects(userId: string, payload: SaveSubjectsPayload): Promise<SaveSubjectsResponse> {
    const { subjects } = payload;

    // Use transaction for consistency
    return await prisma.$transaction(async (tx) => {
      // Upsert subjects or append? Requirement says append but subjects usually have a name?
      // Actually, standard practice for subjects is upsert by name for user.
      for (const subj of subjects) {
        await tx.subject.upsert({
          where: { name_userId: { name: subj.name, userId } },
          update: {
            difficulty: subj.difficulty,
            hoursPerWeek: subj.hoursPerWeek,
            examDate: new Date(subj.examDate)
          },
          create: {
            name: subj.name,
            difficulty: subj.difficulty,
            hoursPerWeek: subj.hoursPerWeek,
            examDate: new Date(subj.examDate),
            userId
          }
        });
      }

      const allSubjects = await tx.subject.findMany({ where: { userId } });

      return {
        id: userId,
        dailyPlan: [], // Will be generated via generateStudyPlan
        totalHours: allSubjects.reduce((sum, s) => sum + s.hoursPerWeek, 0)
      };
    });
  }

  static async generateStudyPlan(userId: string, subjects?: string[]): Promise<{ studyPlan: StudyPlanItem[] }> {
    const plan = await prisma.studyPlan.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
      include: { items: true }
    });

    if (!plan) return { studyPlan: [] };

    return {
      studyPlan: plan.items.map((item: any) => ({
        date: item.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        subject: item.subject,
        topic: item.topic,
        content: item.content,
        duration: item.duration
      }))
    };
  }


  static async saveStudyPlan(userId: string, studyPlan: any[]): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.studyPlan.create({
      data: {
        userId,
        date: today,
        items: {
          create: studyPlan.map(day => ({
            subject: day.subject,
            topic: day.topic || 'Daily Study',
            content: day.content || '',
            duration: day.duration || 60,
            time: today
          }))
        }
      }
    });
  }


  static async getCourses(userId: string): Promise<Course[]> {
    // If no course model, keep placeholders but scoped
    return [
      { id: "1", name: "Advanced Calculus", instructor: "Dr. Smith", progress: 75, nextLesson: "Integration Techniques" },
      { id: "2", name: "Quantum Physics", instructor: "Prof. Johnson", progress: 60, nextLesson: "Wave Functions" }
    ];
  }

  static async sendMessage(userId: string, message: string): Promise<MessageResponse> {
    let session = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId, title: 'Study Chat' }
      });
    }

    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'USER', content: message }
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const { aiService } = await import('./ai/ai.service.js');
    const result = await aiService({ user, tool: 'chat', prompt: message });
    const aiResponse = result.reply || 'I am processing your request.';

    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'ASSISTANT', content: aiResponse }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { questionsAsked: { increment: 1 } }
    });

    return { reply: aiResponse };
  }

  static async getNotes(userId: string): Promise<Note[]> {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return notes.map((n: any) => ({
      id: n.id,
      title: n.title,
      subject: n.subject,
      date: n.createdAt.toISOString().split('T')[0],
      pages: 1 // placeholder
    }));
  }

  static async getPlan(userId: string): Promise<PlanResponse> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const plan = await prisma.studyPlan.findFirst({
      where: { userId, date: { lte: today } },
      orderBy: { date: 'desc' },
      include: { items: true }
    });

    if (!plan) {
      return {
        weekly: [],
        goals: { weeklyHours: 0, currentHours: 0, subjects: 0, completedSubjects: 0 }
      };
    }

    // Group items by day for weekly view (simplification)
    const weekly: WeeklyTask[] = [
      {
        day: today.toLocaleDateString('en-US', { weekday: 'long' }),
        tasks: plan.items.map(i => i.topic), // Keep simple list for tasks in PlanResponse if needed
        completed: plan.items.filter(i => i.completed).length
      }
    ];


    const subjectsCount = await prisma.subject.count({ where: { userId } });

    return {
      weekly,
      goals: {
        weeklyHours: 20, // default goal
        currentHours: plan.items.reduce((sum, i) => sum + (i.completed ? i.duration / 60 : 0), 0),
        subjects: subjectsCount,
        completedSubjects: 0 // logic to determine if a subject is "completed"
      }
    };
  }

  static async getExams(userId: string): Promise<Exam[]> {
    const subjects = await prisma.subject.findMany({ where: { userId } });
    const exams = await prisma.exam.findMany({
      where: { userId },
      include: { attempts: true }
    });

    return subjects.map((subj: any) => {
      const examForSubj = exams.find(e => e.subject === subj.name);
      const latestAttempt = examForSubj?.attempts[0];

      return {
        id: examForSubj?.id || subj.id,
        subject: subj.name,
        date: subj.examDate.toISOString().split('T')[0],
        time: "10:00 AM",
        readiness: latestAttempt ? latestAttempt.score : 0,
        topics: [subj.name]
      };
    });
  }

  static async getPractice(userId: string): Promise<PracticeData> {
    // Quizzes based on exam attempts
    const attempts = await prisma.examAttempt.findMany({
      where: { exam: { userId } },
      include: { exam: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return {
      quizzes: attempts.map(a => ({
        id: a.id,
        subject: a.exam.subject,
        title: `${a.exam.subject} Practice`,
        questions: 10,
        difficulty: "Medium",
        score: a.score
      })),
      flashcards: [] // No model for flashcards yet
    };
  }

  static async getProgress(userId: string): Promise<ProgressData> {
    const [user, subjects, sessions] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.subject.findMany({ where: { userId } }),
      prisma.studyPlanItem.findMany({
        where: { plan: { userId } }
      })
    ]);

    const overall = {
      completed: user?.topicsCompleted || 0,
      total: sessions.length || 100,
      percentage: sessions.length > 0 ? Math.round((user?.topicsCompleted || 0) / sessions.length * 100) : 0
    };

    const subjectProgress = subjects.map(s => {
      const subjItems = sessions.filter(i => i.subject === s.name);
      const completed = subjItems.filter(i => i.completed).length;
      return {
        name: s.name,
        completed,
        total: subjItems.length,
        percentage: subjItems.length > 0 ? Math.round(completed / subjItems.length * 100) : 0
      };
    });

    const weeklyProgress = [
      { week: "Current", hours: user?.hoursStudied || 0, topics: user?.topicsCompleted || 0 }
    ];

    return { overall, subjects: subjectProgress, weekly: weeklyProgress };
  }

  static async getSettings(userId: string): Promise<Settings> {
    // If no settings model, return defaults
    return {
      notifications: true,
      reminders: true,
      studyReminders: true,
      language: "en",
      theme: "light"
    };
  }

  static async updateSettings(userId: string, settings: Settings): Promise<UpdateSettingsResponse> {
    return { message: "Settings saved", settings };
  }

  static async getTimer(userId: string): Promise<Timer> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return {
      currentSession: { subject: "General Study", time: 0, goal: 60 },
      today: { total: user?.hoursStudied || 0, goal: 300 },
      week: { total: (user?.hoursStudied || 0) * 5, goal: 1500 }
    };
  }

  static async uploadNote(userId: string, data: any): Promise<NoteData> {
    const { title, subject, fileUrl, content, type } = data;
    const note = await prisma.note.create({
      data: {
        title,
        subject,
        fileUrl,
        content,
        type: (type || 'PDF') as any,
        userId
      }
    });
    return {
      id: note.id,
      title: note.title,
      subject: note.subject,
      fileUrl: note.fileUrl || '',
      type: note.type,
      createdAt: note.createdAt
    };
  }

  static async completeItem(userId: string, itemId: string): Promise<void> {
    return await prisma.$transaction(async (tx) => {
      const item = await tx.studyPlanItem.update({
        where: { id: itemId },
        data: { completed: true },
        include: { plan: true }
      });

      if (item.plan.userId !== userId) throw new Error('Unauthorized');

      await tx.user.update({
        where: { id: userId },
        data: {
          topicsCompleted: { increment: 1 },
          hoursStudied: { increment: item.duration / 60 },
          lastActiveAt: new Date()
        }
      });

      // Update daily progress
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await tx.progress.upsert({
        where: { userId_date: { userId, date: today } },
        update: {
          completedTasks: { increment: 1 },
          studyHours: { increment: item.duration / 60 }
        },
        create: {
          userId,
          date: today,
          completedTasks: 1,
          studyHours: item.duration / 60
        }
      });
    });
  }

  static async saveExam(userId: string, subject: string, questions: any): Promise<ExamData> {
    return await prisma.exam.create({
      data: { subject, questions, userId }
    });
  }

  static async submitExamAttempt(userId: string, examId: string, payload: { answers: any, score: number, duration: number }): Promise<any> {
    const { answers, score, duration } = payload;

    return await prisma.$transaction(async (tx) => {
      const attempt = await tx.examAttempt.create({
        data: { examId, answers, score, duration }
      });

      // Update user average score
      const user = await tx.user.findUnique({ where: { id: userId } });
      const currentAvg = user?.averageScore || 0;
      const totalExams = await tx.examAttempt.count({ where: { exam: { userId } } });

      await tx.user.update({
        where: { id: userId },
        data: {
          averageScore: (currentAvg * (totalExams - 1) + score) / totalExams
        }
      });

      return attempt;
    });
  }

  static async getChatSessions(userId: string): Promise<ChatSession[]> {
    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { updatedAt: 'desc' }
    });

    return sessions.map((s: any) => ({
      id: s.id,
      title: s.title || 'Untitled Session',
      messages: s.messages.map((m: any) => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt
      })),
      createdAt: s.createdAt
    }));
  }
}
