import { prisma } from "../prisma/client.js";

export const getUserById = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            requests: true,
            createdAt: true,
        },
        });\n};\n\nexport const getUserUsage = async (userId: string) => {
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

export const incrementUserRequests = async (userId: string) => {
    await prisma.user.update({
        where: { id: userId },
        data: {
            requests: {
                increment: 1,
            },
        },
    });
};