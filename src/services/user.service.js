import { prisma } from "../prisma/client.js";
export const getUserById = async (userId) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            requests: true,
            createAt: true,
        },
    });
};
export const incrementUserRequqsts = async (userId) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            requests: {
                increment: 1,
            },
        },
    });
};
export const getUserUsage = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            requests: true,
        },
    });
    return {
        requestsUsed: user?.requests ?? 0,
    };
};
export const incrementUserRequests = async (userId) => {
    await prisma.user.update({
        where: { id: userId },
        data: {
            requests: {
                increment: 1,
            },
        },
    });
};
//# sourceMappingURL=user.service.js.map