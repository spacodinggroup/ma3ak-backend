import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";
import { Request, Response } from "express";
import { prisma } from "../prisma/client.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return errorResponse(res, "Missing required fields", 400);
        }
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return errorResponse(res, "Email already exists", 409);
        }
        const hashed = await bcrypt.hash(password, 8);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: role.toUpperCase(),
            },
        });

        const token = signToken({ id: user.id });

        successResponse(res, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
            token,
        }, 201);
    } catch (err) {
        if (err instanceof Error && err.message.includes("JWT_SECRET")) {
            return errorResponse(res, "Server configuration error: JWT_SECRET missing", 500);
        }
        errorResponse(res, "Registration failed", 500);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, "Missing fields", 400);
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return errorResponse(res, "Invalid credentials", 401);
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return errorResponse(res, "Invalid credentials", 401);
        }

        const token = signToken({ id: user.id });

        successResponse(res, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt,
            },
            token,
        });
    } catch (err) {
        if (err instanceof Error && err.message.includes("JWT_SECRET")) {
            return errorResponse(res, "Server configuration error: JWT_SECRET missing", 500);
        }
        errorResponse(res, "Login failed", 500);
    }
};