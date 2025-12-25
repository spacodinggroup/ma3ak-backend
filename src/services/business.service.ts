import { BusinessDashboardResponse, BusinessMonthlyGoal } from '../types/dashboard.js';
import { prisma } from "../prisma/client.js";

export class BusinessService {
  static async getDashboard(userId: string): Promise<BusinessDashboardResponse> {
    // Mock data
    return {
      monthlyGoal: {
        current: 48520,
        target: 60000,
        progress: 81,
        daysRemaining: 8
      }
    };
  }

  static async getAnalytics(userId: string) {
    return {
      revenue: { current: 48520, previous: 42000, change: 15.5 },
      customers: { current: 1247, previous: 1150, change: 8.4 },
      conversion: { current: 3.8, previous: 3.4, change: 11.8 },
      retention: { current: 78, previous: 75, change: 4.0 }
    };
  }

  static async getCalendar(userId: string) {
    return [
      { id: "1", title: "Team Meeting", date: "2024-12-25", time: "10:00 AM" },
      { id: "2", title: "Client Presentation", date: "2024-12-26", time: "2:00 PM" },
      { id: "3", title: "Marketing Campaign Launch", date: "2024-12-28", time: "9:00 AM" }
    ];
  }

  static async getContent(userId: string) {
    return [
      { id: "1", title: "Holiday Marketing Campaign", type: "campaign", status: "draft" },
      { id: "2", title: "Product Launch Blog Post", type: "blog", status: "published" },
      { id: "3", title: "Customer Success Story", type: "case-study", status: "review" }
    ];
  }

  static async getCustomers(userId: string) {
    const customers = await prisma.customer.findMany({ where: { userId } });
    return customers.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      company: customer.company,
      value: 5000, // placeholder
      status: customer.status.toLowerCase()
    }));
  }

  static async getGoals(userId: string) {
    const goals = await prisma.businessGoal.findMany({ where: { userId } });
    return goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      progress: 50, // placeholder
      target: goal.target,
      current: goal.current,
      deadline: "2024-12-31" // placeholder
    }));
  }

  static async getMarketing(userId: string) {
    return {
      campaigns: [
        { id: "1", name: "Holiday Sale", budget: 5000, spent: 3200, impressions: 45000, clicks: 1200 },
        { id: "2", name: "Email Newsletter", budget: 1000, spent: 800, impressions: 15000, clicks: 450 }
      ],
      channels: [
        { name: "Google Ads", performance: 85 },
        { name: "Facebook", performance: 72 },
        { name: "Email", performance: 91 }
      ]
    };
  }

  static async getReports(userId: string) {
    return {
      monthly: { revenue: 48520, growth: 15.5, customers: 1247, churn: 5.2 },
      quarterly: { revenue: 142000, growth: 22.3, customers: 3650, churn: 4.8 },
      yearly: { revenue: 520000, growth: 35.7, customers: 12000, churn: 3.9 }
    };
  }

  static async getSales(userId: string) {
    return {
      pipeline: [
        { stage: "Lead", count: 45, value: 225000 },
        { stage: "Qualified", count: 23, value: 115000 },
        { stage: "Proposal", count: 12, value: 60000 },
        { stage: "Closed", count: 8, value: 40000 }
      ],
      forecast: { thisMonth: 52000, nextMonth: 58000, quarter: 185000 }
    };
  }

  static async getSettings(userId: string) {
    return {
      notifications: true,
      emailReports: true,
      currency: "USD",
      timezone: "UTC"
    };
  }

  static async updateSettings(userId: string, settings: any) {
    return { message: "Settings updated", settings };
  }
}