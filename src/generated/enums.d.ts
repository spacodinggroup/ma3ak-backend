export declare const Role: {
    readonly STUDENT: "STUDENT";
    readonly BUSINESS: "BUSINESS";
    readonly FOUNDER: "FOUNDER";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const Aiprovider: {
    readonly OPENAI: "OPENAI";
    readonly GROK: "GROK";
};
export type Aiprovider = (typeof Aiprovider)[keyof typeof Aiprovider];
export declare const NoteType: {
    readonly NOTE: "NOTE";
    readonly PDF: "PDF";
};
export type NoteType = (typeof NoteType)[keyof typeof NoteType];
export declare const MessageRole: {
    readonly USER: "USER";
    readonly ASSISTANT: "ASSISTANT";
};
export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole];
export declare const MilestoneStatus: {
    readonly PENDING: "PENDING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
};
export type MilestoneStatus = (typeof MilestoneStatus)[keyof typeof MilestoneStatus];
export declare const OKRStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type OKRStatus = (typeof OKRStatus)[keyof typeof OKRStatus];
export declare const RoadmapStatus: {
    readonly PENDING: "PENDING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly DONE: "DONE";
};
export type RoadmapStatus = (typeof RoadmapStatus)[keyof typeof RoadmapStatus];
export declare const TaskStatus: {
    readonly TODO: "TODO";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly DONE: "DONE";
};
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export declare const GoalStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly ACHIEVED: "ACHIEVED";
    readonly CANCELLED: "CANCELLED";
};
export type GoalStatus = (typeof GoalStatus)[keyof typeof GoalStatus];
export declare const CustomerStatus: {
    readonly LEAD: "LEAD";
    readonly CUSTOMER: "CUSTOMER";
    readonly INACTIVE: "INACTIVE";
};
export type CustomerStatus = (typeof CustomerStatus)[keyof typeof CustomerStatus];
//# sourceMappingURL=enums.d.ts.map