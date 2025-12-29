import * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
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
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options?: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
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
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = Prisma.PrismaClientOptions['omit'], in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.aiLog`: Exposes CRUD operations for the **AiLog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AiLogs
      * const aiLogs = await prisma.aiLog.findMany()
      * ```
      */
    get aiLog(): Prisma.AiLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.subject`: Exposes CRUD operations for the **Subject** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Subjects
      * const subjects = await prisma.subject.findMany()
      * ```
      */
    get subject(): Prisma.SubjectDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.studyPlan`: Exposes CRUD operations for the **StudyPlan** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StudyPlans
      * const studyPlans = await prisma.studyPlan.findMany()
      * ```
      */
    get studyPlan(): Prisma.StudyPlanDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.studyPlanItem`: Exposes CRUD operations for the **StudyPlanItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StudyPlanItems
      * const studyPlanItems = await prisma.studyPlanItem.findMany()
      * ```
      */
    get studyPlanItem(): Prisma.StudyPlanItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.note`: Exposes CRUD operations for the **Note** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Notes
      * const notes = await prisma.note.findMany()
      * ```
      */
    get note(): Prisma.NoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.chatSession`: Exposes CRUD operations for the **ChatSession** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ChatSessions
      * const chatSessions = await prisma.chatSession.findMany()
      * ```
      */
    get chatSession(): Prisma.ChatSessionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ChatMessages
      * const chatMessages = await prisma.chatMessage.findMany()
      * ```
      */
    get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.exam`: Exposes CRUD operations for the **Exam** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Exams
      * const exams = await prisma.exam.findMany()
      * ```
      */
    get exam(): Prisma.ExamDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.examAttempt`: Exposes CRUD operations for the **ExamAttempt** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ExamAttempts
      * const examAttempts = await prisma.examAttempt.findMany()
      * ```
      */
    get examAttempt(): Prisma.ExamAttemptDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.milestone`: Exposes CRUD operations for the **Milestone** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Milestones
      * const milestones = await prisma.milestone.findMany()
      * ```
      */
    get milestone(): Prisma.MilestoneDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.oKR`: Exposes CRUD operations for the **OKR** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OKRS
      * const oKRS = await prisma.oKR.findMany()
      * ```
      */
    get oKR(): Prisma.OKRDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.roadmapItem`: Exposes CRUD operations for the **RoadmapItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RoadmapItems
      * const roadmapItems = await prisma.roadmapItem.findMany()
      * ```
      */
    get roadmapItem(): Prisma.RoadmapItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teamMember`: Exposes CRUD operations for the **TeamMember** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TeamMembers
      * const teamMembers = await prisma.teamMember.findMany()
      * ```
      */
    get teamMember(): Prisma.TeamMemberDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.businessTask`: Exposes CRUD operations for the **BusinessTask** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BusinessTasks
      * const businessTasks = await prisma.businessTask.findMany()
      * ```
      */
    get businessTask(): Prisma.BusinessTaskDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.businessGoal`: Exposes CRUD operations for the **BusinessGoal** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BusinessGoals
      * const businessGoals = await prisma.businessGoal.findMany()
      * ```
      */
    get businessGoal(): Prisma.BusinessGoalDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Customers
      * const customers = await prisma.customer.findMany()
      * ```
      */
    get customer(): Prisma.CustomerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(dirname: string): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map