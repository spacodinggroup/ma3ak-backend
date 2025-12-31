import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { getUserById } from "../services/user.service.js";
import type { Role } from "../types/role.js";

export const protect = async (req: any, res: any, next: any) =>  {
    try {
        const auth = req.headers.authorization;
        if (!auth) return res.status(401).json({ message: "No token"});

        const token = auth.split(" ")[1];
        const decoded: any = jwt.verify(token, ENV.JWT_SECRET);

        const user = await getUserById(decoded.id);
        if (!user) return res.status(401).json({message: "User not found"});

        req.user = user;
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(401).json({ message: "Unauthorized"})
    }
};

export const requireRole = (...roles: Role[]) => {
    return (req: any, res: any, next: any) => {
        const role: Role | undefined = req.user?.role;
        if (!role) return res.status(401).json({ message: "Unauthorized" });
        if (!roles.includes(role)) return res.status(403).json({ message: "Forbidden" });
        return next();
    };
};