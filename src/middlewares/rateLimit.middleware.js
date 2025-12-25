import { ROLE_LIMITS } from "../utils/limits.js";
export const checkLimit = (req, res, next) => {
    const user = req.user;
    if (user.role === "ADMIN")
        return next();
    const limit = ROLE_LIMITS[user.role] ?? 0;
    if (user.requests >= limit) {
        return res.status(429).json({
            message: "Daily limit reached",
        });
    }
    next();
};
//# sourceMappingURL=rateLimit.middleware.js.map