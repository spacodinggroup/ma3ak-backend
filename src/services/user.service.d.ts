export declare const getUserById: (userId: string) => Promise<{
    name: string;
    email: string;
    role: import("../generated/enums.js").Role;
    id: string;
    requests: number;
    createdAt: Date;
} | null>;
export declare const getUserUsage: (userId: string) => Promise<{
    requestsUsed: number;
}>;
export declare const incrementUserRequests: (userId: string) => Promise<void>;
//# sourceMappingURL=user.service.d.ts.map