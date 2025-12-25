import { Request, Response } from "express";
export declare const getAdminStats: (_: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllUsers: (_: Request, res: Response) => Promise<void>;
export declare const toggleUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUsageByRole: (_: Request, res: Response) => Promise<void>;
export declare const changeUserRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=admin.controller.d.ts.map