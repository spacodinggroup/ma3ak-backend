import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/request.js";
export declare const adminOnly: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=admin.middleware.d.ts.map