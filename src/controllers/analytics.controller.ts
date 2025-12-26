import { Request, Response } from "express";
import { prisma } from "../prisma/client.js";
import { AuthenticatedRequest } from "../types/request.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getWeeklyUsage = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const from = new Date();
    from.setDate(from.getDate() - 7);

    const data = await prisma.aiLog.groupBy({
        by: ["createdAt"],
        where: {
            userId,
            createdAt: { gte: from },
        },
        _count: { id: true },
    });
    successResponse(res, data);
};