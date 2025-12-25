import { FounderDashboardResponse, Metric, RoadmapItem, MilestoneItem, TeamMember } from '../types/dashboard.js';
export declare class FounderService {
    private static mockStartupStage;
    private static mockMetrics;
    private static mockRoadmapItems;
    private static mockMilestones;
    private static mockTeamMembers;
    static getDashboard(userId: string): Promise<FounderDashboardResponse>;
    static getMetrics(userId: string): Promise<Metric[]>;
    static getMilestones(userId: string): Promise<MilestoneItem[]>;
    static getOKRs(userId: string): Promise<{
        id: string;
        objective: string;
        keyResults: string[];
        progress: number;
    }[]>;
    static getPitch(userId: string): Promise<{
        title: string;
        problem: string;
        solution: string;
        market: string;
        traction: string;
        ask: string;
    }>;
    static getRoadmap(userId: string): Promise<RoadmapItem[]>;
    static getSettings(userId: string): Promise<{
        notifications: boolean;
        emailUpdates: boolean;
        theme: string;
        language: string;
    }>;
    static updateSettings(userId: string, settings: any): Promise<{
        message: string;
        settings: any;
    }>;
    static getTeam(userId: string): Promise<TeamMember[]>;
    static getTech(userId: string): Promise<{
        stack: string[];
        recommendations: string[];
    }>;
    static getValidate(userId: string): Promise<{
        score: number;
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
    }>;
}
//# sourceMappingURL=founder.service.d.ts.map