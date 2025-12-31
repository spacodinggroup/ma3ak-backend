import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const ModelName: {
    readonly User: "User";
    readonly AiLog: "AiLog";
    readonly Subject: "Subject";
    readonly StudyPlan: "StudyPlan";
    readonly StudyPlanItem: "StudyPlanItem";
    readonly Note: "Note";
    readonly ChatSession: "ChatSession";
    readonly ChatMessage: "ChatMessage";
    readonly Exam: "Exam";
    readonly ExamAttempt: "ExamAttempt";
    readonly Progress: "Progress";
    readonly Milestone: "Milestone";
    readonly OKR: "OKR";
    readonly RoadmapItem: "RoadmapItem";
    readonly TeamMember: "TeamMember";
    readonly BusinessTask: "BusinessTask";
    readonly BusinessGoal: "BusinessGoal";
    readonly Customer: "Customer";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly password: "password";
    readonly role: "role";
    readonly avatar: "avatar";
    readonly requests: "requests";
    readonly streak: "streak";
    readonly hoursStudied: "hoursStudied";
    readonly topicsCompleted: "topicsCompleted";
    readonly questionsAsked: "questionsAsked";
    readonly averageScore: "averageScore";
    readonly lastActiveAt: "lastActiveAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly disabled: "disabled";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const AiLogScalarFieldEnum: {
    readonly id: "id";
    readonly prompt: "prompt";
    readonly response: "response";
    readonly provider: "provider";
    readonly createdAt: "createdAt";
    readonly userId: "userId";
};
export type AiLogScalarFieldEnum = (typeof AiLogScalarFieldEnum)[keyof typeof AiLogScalarFieldEnum];
export declare const SubjectScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly difficulty: "difficulty";
    readonly hoursPerWeek: "hoursPerWeek";
    readonly examDate: "examDate";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SubjectScalarFieldEnum = (typeof SubjectScalarFieldEnum)[keyof typeof SubjectScalarFieldEnum];
export declare const StudyPlanScalarFieldEnum: {
    readonly id: "id";
    readonly date: "date";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type StudyPlanScalarFieldEnum = (typeof StudyPlanScalarFieldEnum)[keyof typeof StudyPlanScalarFieldEnum];
export declare const StudyPlanItemScalarFieldEnum: {
    readonly id: "id";
    readonly subject: "subject";
    readonly topic: "topic";
    readonly content: "content";
    readonly time: "time";
    readonly duration: "duration";
    readonly completed: "completed";
    readonly planId: "planId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type StudyPlanItemScalarFieldEnum = (typeof StudyPlanItemScalarFieldEnum)[keyof typeof StudyPlanItemScalarFieldEnum];
export declare const NoteScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly subject: "subject";
    readonly content: "content";
    readonly fileUrl: "fileUrl";
    readonly type: "type";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type NoteScalarFieldEnum = (typeof NoteScalarFieldEnum)[keyof typeof NoteScalarFieldEnum];
export declare const ChatSessionScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ChatSessionScalarFieldEnum = (typeof ChatSessionScalarFieldEnum)[keyof typeof ChatSessionScalarFieldEnum];
export declare const ChatMessageScalarFieldEnum: {
    readonly id: "id";
    readonly role: "role";
    readonly content: "content";
    readonly sessionId: "sessionId";
    readonly createdAt: "createdAt";
};
export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum];
export declare const ExamScalarFieldEnum: {
    readonly id: "id";
    readonly subject: "subject";
    readonly questions: "questions";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ExamScalarFieldEnum = (typeof ExamScalarFieldEnum)[keyof typeof ExamScalarFieldEnum];
export declare const ExamAttemptScalarFieldEnum: {
    readonly id: "id";
    readonly answers: "answers";
    readonly score: "score";
    readonly duration: "duration";
    readonly examId: "examId";
    readonly createdAt: "createdAt";
};
export type ExamAttemptScalarFieldEnum = (typeof ExamAttemptScalarFieldEnum)[keyof typeof ExamAttemptScalarFieldEnum];
export declare const ProgressScalarFieldEnum: {
    readonly id: "id";
    readonly date: "date";
    readonly completedTasks: "completedTasks";
    readonly studyHours: "studyHours";
    readonly averageQuizScore: "averageQuizScore";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProgressScalarFieldEnum = (typeof ProgressScalarFieldEnum)[keyof typeof ProgressScalarFieldEnum];
export declare const MilestoneScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly date: "date";
    readonly status: "status";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MilestoneScalarFieldEnum = (typeof MilestoneScalarFieldEnum)[keyof typeof MilestoneScalarFieldEnum];
export declare const OKRScalarFieldEnum: {
    readonly id: "id";
    readonly objective: "objective";
    readonly keyResults: "keyResults";
    readonly status: "status";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OKRScalarFieldEnum = (typeof OKRScalarFieldEnum)[keyof typeof OKRScalarFieldEnum];
export declare const RoadmapItemScalarFieldEnum: {
    readonly id: "id";
    readonly feature: "feature";
    readonly status: "status";
    readonly priority: "priority";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RoadmapItemScalarFieldEnum = (typeof RoadmapItemScalarFieldEnum)[keyof typeof RoadmapItemScalarFieldEnum];
export declare const TeamMemberScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly role: "role";
    readonly avatar: "avatar";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TeamMemberScalarFieldEnum = (typeof TeamMemberScalarFieldEnum)[keyof typeof TeamMemberScalarFieldEnum];
export declare const BusinessTaskScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly status: "status";
    readonly priority: "priority";
    readonly dueDate: "dueDate";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BusinessTaskScalarFieldEnum = (typeof BusinessTaskScalarFieldEnum)[keyof typeof BusinessTaskScalarFieldEnum];
export declare const BusinessGoalScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly target: "target";
    readonly current: "current";
    readonly status: "status";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BusinessGoalScalarFieldEnum = (typeof BusinessGoalScalarFieldEnum)[keyof typeof BusinessGoalScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly company: "company";
    readonly status: "status";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly AnyNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map