import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/request.js";

export const adminOnly = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({
            message: "Admin access only",
        });
    }

    next();
};