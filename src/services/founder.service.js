export class FounderService {
    // Mock data - in production, this would query the database
    static mockStartupStage = {
        current: "MVP",
        progress: 65,
        stages: ["Idea", "MVP", "Growth", "Scale"]
    };
    static mockMetrics = [
        { label: "Revenue", value: "$12,500", change: "+15%", target: "$15,000" },
        { label: "Users", value: "1,247", change: "+8%", target: "2,000" },
        { label: "Conversion", value: "3.2%", change: "-0.5%" },
        { label: "Retention", value: "78%", change: "+2%" }
    ];
    static mockRoadmapItems = [
        { id: "1", feature: "User authentication system", status: "done", priority: "P0" },
        { id: "2", feature: "Basic dashboard", status: "done", priority: "P0" },
        { id: "3", feature: "AI chat integration", status: "in-progress", priority: "P0" },
        { id: "4", feature: "Payment processing", status: "pending", priority: "P1" },
        { id: "5", feature: "Mobile app", status: "pending", priority: "P2" }
    ];
    static mockMilestones = [
        { id: "1", name: "First paying customer", date: "Dec 2024", status: "completed" },
        { id: "2", name: "MVP launch", date: "Jan 2025", status: "in-progress" },
        { id: "3", name: "Seed funding", date: "Mar 2025", status: "pending" },
        { id: "4", name: "Team expansion", date: "Jun 2025", status: "pending" }
    ];
    static mockTeamMembers = [
        { id: "1", name: "John Doe", role: "CEO", avatar: "JD" },
        { id: "2", name: "Jane Smith", role: "CTO", avatar: "JS" },
        { id: "3", name: "Bob Wilson", role: "Designer", avatar: "BW" }
    ];
    static async getDashboard(userId) {
        // In production, calculate based on user data
        // For now, return mock data
        return {
            startupStage: this.mockStartupStage,
            metrics: this.mockMetrics,
            roadmapItems: this.mockRoadmapItems,
            milestones: this.mockMilestones,
            teamMembers: this.mockTeamMembers
        };
    }
    static async getMetrics(userId) {
        // Calculate metrics based on user data
        return [
            { label: "Monthly Revenue", value: "$12,500", icon: "TrendingUp", change: "+15%", target: "$15,000" },
            { label: "Active Users", value: "1,247", icon: "Users", change: "+8%", target: "2,000" },
            { label: "Conversion Rate", value: "3.2%", icon: "Target", change: "-0.5%" },
            { label: "Customer Retention", value: "78%", icon: "BarChart3", change: "+2%" }
        ];
    }
    static async getMilestones(userId) {
        return this.mockMilestones;
    }
    static async getOKRs(userId) {
        return [
            { id: "1", objective: "Launch MVP", keyResults: ["Complete core features", "Get 100 beta users"], progress: 75 },
            { id: "2", objective: "Achieve product-market fit", keyResults: ["80% retention", "$10k MRR"], progress: 60 }
        ];
    }
    static async getPitch(userId) {
        return {
            title: "Ma3ak - AI-Powered Startup Assistant",
            problem: "Founders waste 6 months building wrong products",
            solution: "AI co-founder that guides from idea to funding",
            market: "$100B SaaS market",
            traction: "1,200 users, $12k MRR",
            ask: "$500k for 10% equity"
        };
    }
    static async getRoadmap(userId) {
        return this.mockRoadmapItems.map(item => ({
            ...item,
            quarter: "Q1 2025" // Add computed field
        }));
    }
    static async getSettings(userId) {
        return {
            notifications: true,
            emailUpdates: true,
            theme: "dark",
            language: "en"
        };
    }
    static async updateSettings(userId, settings) {
        // Save to database
        return { message: "Settings updated", settings };
    }
    static async getTeam(userId) {
        return this.mockTeamMembers;
    }
    static async getTech(userId) {
        return {
            stack: ["React", "Node.js", "PostgreSQL", "OpenAI"],
            recommendations: ["Add Redis for caching", "Consider GraphQL"]
        };
    }
    static async getValidate(userId) {
        return {
            score: 85,
            strengths: ["Strong team", "Clear value prop"],
            weaknesses: ["Limited traction", "Competitive market"],
            recommendations: ["Focus on user acquisition", "Validate pricing"]
        };
    }
}
//# sourceMappingURL=founder.service.js.map