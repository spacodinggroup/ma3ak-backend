import { BusinessDashboardResponse } from '../types/dashboard.js';
export declare class BusinessService {
    static getDashboard(userId: string): Promise<BusinessDashboardResponse>;
    static getAnalytics(userId: string): Promise<{
        revenue: {
            current: number;
            previous: number;
            change: number;
        };
        customers: {
            current: number;
            previous: number;
            change: number;
        };
        conversion: {
            current: number;
            previous: number;
            change: number;
        };
        retention: {
            current: number;
            previous: number;
            change: number;
        };
    }>;
    static getCalendar(userId: string): Promise<{
        id: string;
        title: string;
        date: string;
        time: string;
    }[]>;
    static getContent(userId: string): Promise<{
        id: string;
        title: string;
        type: string;
        status: string;
    }[]>;
    static getCustomers(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        value: number;
        status: string;
    }[]>;
    static getGoals(userId: string): Promise<{
        id: string;
        title: string;
        progress: number;
        target: number;
        current: number;
        deadline: string;
    }[]>;
    static getMarketing(userId: string): Promise<{
        campaigns: {
            id: string;
            name: string;
            budget: number;
            spent: number;
            impressions: number;
            clicks: number;
        }[];
        channels: {
            name: string;
            performance: number;
        }[];
    }>;
    static getReports(userId: string): Promise<{
        monthly: {
            revenue: number;
            growth: number;
            customers: number;
            churn: number;
        };
        quarterly: {
            revenue: number;
            growth: number;
            customers: number;
            churn: number;
        };
        yearly: {
            revenue: number;
            growth: number;
            customers: number;
            churn: number;
        };
    }>;
    static getSales(userId: string): Promise<{
        pipeline: {
            stage: string;
            count: number;
            value: number;
        }[];
        forecast: {
            thisMonth: number;
            nextMonth: number;
            quarter: number;
        };
    }>;
    static getSettings(userId: string): Promise<{
        notifications: boolean;
        emailReports: boolean;
        currency: string;
        timezone: string;
    }>;
    static updateSettings(userId: string, settings: any): Promise<{
        message: string;
        settings: any;
    }>;
}
//# sourceMappingURL=business.service.d.ts.map