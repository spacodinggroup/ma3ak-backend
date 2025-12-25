export interface Metric {
    label: string;
    value: string;
    change?: string;
    target?: string;
    icon?: string;
}
export interface RoadmapItem {
    id: string;
    feature: string;
    status: 'pending' | 'in-progress' | 'done';
    priority: 'P0' | 'P1' | 'P2';
}
export interface MilestoneItem {
    id: string;
    name: string;
    date: string;
    status: 'pending' | 'in-progress' | 'completed';
}
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
}
export interface StartupStage {
    current: string;
    progress: number;
    stages: string[];
}
export interface FounderDashboardResponse {
    startupStage: StartupStage;
    metrics: Metric[];
    roadmapItems: RoadmapItem[];
    milestones: MilestoneItem[];
    teamMembers: TeamMember[];
}
export interface BusinessMonthlyGoal {
    current: number;
    target: number;
    progress: number;
    daysRemaining: number;
}
export interface BusinessDashboardResponse {
    monthlyGoal: BusinessMonthlyGoal;
}
export interface StudyPlanItem {
    topic: string;
    subject: string;
    time: string;
    duration: string;
    completed: boolean;
}
export interface UpcomingExam {
    subject: string;
    daysLeft: number;
    readiness: number;
    date: string;
}
export interface Subject {
    name: string;
    icon: string;
    progress: number;
}
export interface StudentStats {
    streak: number;
    hours: number;
    topics: number;
    questions: number;
    avgScore: number;
    hoursThisWeek: number;
    topicsThisWeek: number;
    questionsThisWeek: number;
    avgScoreChange: number;
}
export interface StudentDashboardResponse {
    studyPlan: StudyPlanItem[];
    upcomingExam: UpcomingExam[];
    subjects: Subject[];
    Stats: StudentStats;
}
export interface ErrorResponse {
    success: false;
    message: string;
    code?: string;
}
//# sourceMappingURL=dashboard.d.ts.map