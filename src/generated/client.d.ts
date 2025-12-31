import * as runtime from "@prisma/client/runtime/library";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model AiLog
 *
 */
export type AiLog = Prisma.AiLogModel;
/**
 * Model Subject
 *
 */
export type Subject = Prisma.SubjectModel;
/**
 * Model StudyPlan
 *
 */
export type StudyPlan = Prisma.StudyPlanModel;
/**
 * Model StudyPlanItem
 *
 */
export type StudyPlanItem = Prisma.StudyPlanItemModel;
/**
 * Model Note
 *
 */
export type Note = Prisma.NoteModel;
/**
 * Model ChatSession
 *
 */
export type ChatSession = Prisma.ChatSessionModel;
/**
 * Model ChatMessage
 *
 */
export type ChatMessage = Prisma.ChatMessageModel;
/**
 * Model Exam
 *
 */
export type Exam = Prisma.ExamModel;
/**
 * Model ExamAttempt
 *
 */
export type ExamAttempt = Prisma.ExamAttemptModel;
/**
 * Model Progress
 *
 */
export type Progress = Prisma.ProgressModel;
/**
 * Model Milestone
 *
 */
export type Milestone = Prisma.MilestoneModel;
/**
 * Model OKR
 *
 */
export type OKR = Prisma.OKRModel;
/**
 * Model RoadmapItem
 *
 */
export type RoadmapItem = Prisma.RoadmapItemModel;
/**
 * Model TeamMember
 *
 */
export type TeamMember = Prisma.TeamMemberModel;
/**
 * Model BusinessTask
 *
 */
export type BusinessTask = Prisma.BusinessTaskModel;
/**
 * Model BusinessGoal
 *
 */
export type BusinessGoal = Prisma.BusinessGoalModel;
/**
 * Model Customer
 *
 */
export type Customer = Prisma.CustomerModel;
//# sourceMappingURL=client.d.ts.map