import { prisma } from "../prisma/client.js";
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
        const [milestones, roadmapItems, teamMembers] = await Promise.all([
            prisma.milestone.findMany({ where: { userId }, orderBy: { date: 'asc' } }),
            prisma.roadmapItem.findMany({ where: { userId }, orderBy: { priority: 'asc' } }),
            prisma.teamMember.findMany({ where: { userId } })
        ]);
        // Mock metrics and stage for now, can be calculated later
        const metrics = [
            { label: "Revenue", value: "$12,500", change: "+15%", target: "$15,000" },
            { label: "Users", value: "1,247", change: "+8%", target: "2,000" },
            { label: "Conversion", value: "3.2%", change: "-0.5%" },
            { label: "Retention", value: "78%", change: "+2%" }
        ];
        const startupStage = {
            current: "MVP",
            progress: 65,
            stages: ["Idea", "MVP", "Growth", "Scale"]
        };
        return {
            startupStage,
            metrics,
            roadmapItems: roadmapItems.map((item) => ({
                id: item.id,
                feature: item.feature,
                status: item.status.toLowerCase(),
                priority: item.priority
            })),
            milestones: milestones.map((item) => ({
                id: item.id,
                name: item.name,
                date: item.date.toISOString().split('T')[0],
                status: item.status.toLowerCase()
            })),
            teamMembers: teamMembers.map((member) => ({
                id: member.id,
                name: member.name,
                role: member.role,
                avatar: member.avatar || member.name.split(' ').map((n) => n[0]).join('')
            }))
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
        const milestones = await prisma.milestone.findMany({
            where: { userId },
            orderBy: { date: 'asc' }
        });
        return milestones.map((item) => ({
            id: item.id,
            name: item.name,
            date: item.date.toISOString().split('T')[0],
            status: item.status.toLowerCase()
        }));
    }
    static async getOKRs(userId) {
        const okrs = await prisma.oKR.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        return okrs.map((okr) => ({
            id: okr.id,
            objective: okr.objective,
            keyResults: okr.keyResults,
            progress: 50 // placeholder
        }));
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
        const items = await prisma.roadmapItem.findMany({
            where: { userId },
            orderBy: { priority: 'asc' }
        });
        return items.map((item) => ({
            id: item.id,
            feature: item.feature,
            status: item.status.toLowerCase(),
            priority: item.priority,
            quarter: "Q1 2025"
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
        const members = await prisma.teamMember.findMany({ where: { userId } });
        return members.map((member) => ({
            id: member.id,
            name: member.name,
            role: member.role,
            avatar: member.avatar || member.name.split(' ').map((n) => n[0]).join('')
        }));
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
    static async sendMessage(userId, message) {
        const { prisma } = await import('../prisma/client.js');
        // Find or create chat session
        let session = await prisma.chatSession.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        if (!session) {
            session = await prisma.chatSession.create({
                data: { userId, title: 'Founder Chat' }
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
        // Get user for AI service
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        // Call AI service for real response
        const { aiService } = await import('./ai/ai.service.js');
        let aiResponse = '';
        try {
            const result = await aiService({
                user,
                tool: 'chat',
                prompt: message
                // provider omitted - defaults to OpenAI with automatic Grok fallback
            });
            aiResponse = result.reply || '';
        }
        catch (aiError) {
            console.error('[FounderService] AI service error:', aiError.message || aiError);
            throw new Error('AI service unavailable');
        }
        // Save AI response
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
        return { reply: aiResponse };
    }
}
//# sourceMappingURL=founder.service.js.map