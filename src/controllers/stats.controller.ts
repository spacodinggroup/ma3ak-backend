import { Request, Response } from "express";
import { prisma } from "../prisma/client.js";
import { AuthenticatedRequest } from "../types/request.js";

export const getMyStats = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;

    const total = await prisma.aiLog.count({
        where: { userId },
    });

    const today = await prisma.aiLog.count({
        where: {
            userId,
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        },
    });
    res.json({ total, today });
};