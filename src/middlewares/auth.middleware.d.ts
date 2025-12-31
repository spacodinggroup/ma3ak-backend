import type { Role } from "../types/role.js";
export declare const protect: (req: any, res: any, next: any) => Promise<any>;
export declare const requireRole: (...roles: Role[]) => (req: any, res: any, next: any) => any;
//# sourceMappingURL=auth.middleware.d.ts.map