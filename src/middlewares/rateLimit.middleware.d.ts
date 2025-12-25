import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/request.js";
export declare const checkLimit: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=rateLimit.middleware.d.ts.map