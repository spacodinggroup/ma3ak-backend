import { FounderDashboardResponse, Metric, RoadmapItem, MilestoneItem, TeamMember, StartupStage } from '../types/dashboard.js';
import { prisma } from "../prisma/client.js";

export class FounderService {
  // Mock data - in production, this would query the database
  private static mockStartupStage: StartupStage = {
    current: "MVP",
    progress: 65,
    stages: ["Idea", "MVP", "Growth", "Scale"]
  };

  private static mockMetrics: Metric[] = [
    { label: "Revenue", value: "$12,500", change: "+15%", target: "$15,000" },
    { label: "Users", value: "1,247", change: "+8%", target: "2,000" },
    { label: "Conversion", value: "3.2%", change: "-0.5%" },
    { label: "Retention", value: "78%", change: "+2%" }
  ];

  private static mockRoadmapItems: RoadmapItem[] = [
    { id: "1", feature: "User authentication system", status: "done", priority: "P0" },
    { id: "2", feature: "Basic dashboard", status: "done", priority: "P0" },
    { id: "3", feature: "AI chat integration", status: "in-progress", priority: "P0" },
    { id: "4", feature: "Payment processing", status: "pending", priority: "P1" },
    { id: "5", feature: "Mobile app", status: "pending", priority: "P2" }
  ];

  private static mockMilestones: MilestoneItem[] = [
    { id: "1", name: "First paying customer", date: "Dec 2024", status: "completed" },
    { id: "2", name: "MVP launch", date: "Jan 2025", status: "in-progress" },
    { id: "3", name: "Seed funding", date: "Mar 2025", status: "pending" },
    { id: "4", name: "Team expansion", date: "Jun 2025", status: "pending" }
  ];

  private static mockTeamMembers: TeamMember[] = [
    { id: "1", name: "John Doe", role: "CEO", avatar: "JD" },
    { id: "2", name: "Jane Smith", role: "CTO", avatar: "JS" },
    { id: "3", name: "Bob Wilson", role: "Designer", avatar: "BW" }
  ];

  static async getDashboard(userId: string): Promise<FounderDashboardResponse> {
    const [milestones, roadmapItems, teamMembers] = await Promise.all([
      prisma.milestone.findMany({ where: { userId }, orderBy: { date: 'asc' } }),
      prisma.roadmapItem.findMany({ where: { userId }, orderBy: { priority: 'asc' } }),
      prisma.teamMember.findMany({ where: { userId } })
    ]);

    // Mock metrics and stage for now, can be calculated later
    const metrics: Metric[] = [
      { label: "Revenue", value: "$12,500", change: "+15%", target: "$15,000" },
      { label: "Users", value: "1,247", change: "+8%", target: "2,000" },
      { label: "Conversion", value: "3.2%", change: "-0.5%" },
      { label: "Retention", value: "78%", change: "+2%" }
    ];

    const startupStage: StartupStage = {
      current: "MVP",
      progress: 65,
      stages: ["Idea", "MVP", "Growth", "Scale"]
    };

    return {
      startupStage,
      metrics,
      roadmapItems: roadmapItems.map((item: any) => ({
        id: item.id,
        feature: item.feature,
        status: item.status.toLowerCase() as any,
        priority: item.priority
      })),
      milestones: milestones.map((item: any) => ({
        id: item.id,
        name: item.name,
        date: item.date.toISOString().split('T')[0],
        status: item.status.toLowerCase() as any
      })),
      teamMembers: teamMembers.map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        avatar: member.avatar || member.name.split(' ').map((n: string) => n[0]).join('')
      }))
    };
  }

  static async getMetrics(userId: string): Promise<Metric[]> {
    // Calculate metrics based on user data
    return [
      { label: "Monthly Revenue", value: "$12,500", icon: "TrendingUp", change: "+15%", target: "$15,000" },
      { label: "Active Users", value: "1,247", icon: "Users", change: "+8%", target: "2,000" },
      { label: "Conversion Rate", value: "3.2%", icon: "Target", change: "-0.5%" },
      { label: "Customer Retention", value: "78%", icon: "BarChart3", change: "+2%" }
    ];
  }

  static async getMilestones(userId: string): Promise<MilestoneItem[]> {
    const milestones = await prisma.milestone.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });
    return milestones.map((item: any) => ({
      id: item.id,
      name: item.name,
      date: item.date.toISOString().split('T')[0],
      status: item.status.toLowerCase() as any
    }));
  }

  static async getOKRs(userId: string) {
    const okrs = await prisma.oKR.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return okrs.map((okr: any) => ({
      id: okr.id,
      objective: okr.objective,
      keyResults: okr.keyResults as string[],
      progress: 50 // placeholder
    }));
  }

  static async getPitch(userId: string) {
    return {
      title: "Ma3ak - AI-Powered Startup Assistant",
      problem: "Founders waste 6 months building wrong products",
      solution: "AI co-founder that guides from idea to funding",
      market: "$100B SaaS market",
      traction: "1,200 users, $12k MRR",
      ask: "$500k for 10% equity"
    };
  }

  static async getRoadmap(userId: string): Promise<RoadmapItem[]> {
    const items = await prisma.roadmapItem.findMany({
      where: { userId },
      orderBy: { priority: 'asc' }
    });
    return items.map((item: any) => ({
      id: item.id,
      feature: item.feature,
      status: item.status.toLowerCase() as any,
      priority: item.priority,
      quarter: "Q1 2025"
    }));
  }

  static async getSettings(userId: string) {
    return {
      notifications: true,
      emailUpdates: true,
      theme: "dark",
      language: "en"
    };
  }

  static async updateSettings(userId: string, settings: any) {
    // Save to database
    return { message: "Settings updated", settings };
  }

  static async getTeam(userId: string): Promise<TeamMember[]> {
    const members = await prisma.teamMember.findMany({ where: { userId } });
    return members.map((member: any) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      avatar: member.avatar || member.name.split(' ').map((n: string) => n[0]).join('')
    }));
  }

  static async getTech(userId: string) {
    return {
      stack: ["React", "Node.js", "PostgreSQL", "OpenAI"],
      recommendations: ["Add Redis for caching", "Consider GraphQL"]
    };
  }

  static async getValidate(userId: string) {
    return {
      score: 85,
      strengths: ["Strong team", "Clear value prop"],
      weaknesses: ["Limited traction", "Competitive market"],
      recommendations: ["Focus on user acquisition", "Validate pricing"]
    };
  }
}