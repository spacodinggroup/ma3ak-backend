import { prisma } from "../prisma/client.js";
import { successResponse, errorResponse } from "../utils/response.js";
export const getAdminStats = async (_, res) => {
    const usersCount = await prisma.user.count();
    const aiRequests = await prisma.aiLog.count();
    return successResponse(res, { usersCount, aiRequests });
};
export const getAllUsers = async (_, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            requests: true,
            createdAt: true,
        },
    });
    successResponse(res, users);
};
export const toggleUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return errorResponse(res, "ID required", 400);
    }
    const { disabled } = req.body;
    await prisma.user.update({
        where: { id },
        data: { disabled },
    });
    successResponse(res, { success: true });
};
export const getUsageByRole = async (_, res) => {
    const data = await prisma.user.groupBy({
        by: ["role"],
        _count: { id: true },
    });
    successResponse(res, data);
};
export const changeUserRole = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return errorResponse(res, "ID required", 400);
    }
    const { role } = req.body;
    await prisma.user.update({
        where: { id },
        data: { role },
    });
    successResponse(res, { success: true });
};
//# sourceMappingURL=admin.controller.js.map