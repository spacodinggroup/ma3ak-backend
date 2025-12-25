import { prisma } from "../prisma/client.js";

export const updateStreak = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const now = new Date();
    const last = user.lastActiveAt;

    if (!last) {
        await prisma.user.update({
            where: { id: userId },
            data: { streak: 1, lastActiveAt: now },
        });
        return;
    }

    const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

    if (diff < 1) {
        // Same day, no update
        return;
    } else if (diff < 2) {
        // Next day, increment streak
        await prisma.user.update({
            where: { id: userId },
            data: { streak: user.streak + 1, lastActiveAt: now },
        });
    } else {
        // More than 1 day, reset streak
        await prisma.user.update({
            where: { id: userId },
            data: { streak: 1, lastActiveAt: now },
        });
    }
};