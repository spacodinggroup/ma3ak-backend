import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}
export declare const errorHandler: (err: AppError, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=error.middleware.d.ts.map