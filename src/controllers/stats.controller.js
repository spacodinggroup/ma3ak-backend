import { prisma } from "../prisma/client.js";
import { successResponse } from "../utils/response.js";
export const getMyStats = async (req, res) => {
    const userId = req.user.id;
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
    successResponse(res, { total, today });
};
//# sourceMappingURL=stats.controller.js.map