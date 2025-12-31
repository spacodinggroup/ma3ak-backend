import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";
import { prisma } from "../prisma/client.js";
import { successResponse, errorResponse } from "../utils/response.js";
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Validate request payload
        if (!name || typeof name !== "string" || name.trim() === "") {
            return errorResponse(res, "Valid name is required", 400);
        }
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return errorResponse(res, "Valid email is required", 400);
        }
        if (!password || typeof password !== "string" || password.length < 6) {
            return errorResponse(res, "Password must be at least 6 characters", 400);
        }
        if (!role || typeof role !== "string") {
            return errorResponse(res, "Valid role is required", 400);
        }
        // Check if email already exists
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return errorResponse(res, "Email already exists", 409);
        }
        // Hash password using bcrypt
        const hashed = await bcrypt.hash(password, 10);
        // Create user in database
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashed,
                role: role.toUpperCase(),
            },
        });
        // Generate JWT token
        const token = signToken({ id: user.id });
        // Return success response with user data and token
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
    }
    catch (err) {
        if (err instanceof Error && err.message.includes("JWT_SECRET")) {
            return errorResponse(res, "Server configuration error: JWT_SECRET missing", 500);
        }
        console.error("Registration error:", err);
        errorResponse(res, "Registration failed", 500);
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate request payload
        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return errorResponse(res, "Email and password required", 400);
        }
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user || !user.password) {
            return errorResponse(res, "Invalid credentials", 401);
        }
        // Compare password using bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return errorResponse(res, "Invalid credentials", 401);
        }
        // Generate JWT token
        const token = signToken({ id: user.id });
        // Return success response with user data and token
        return successResponse(res, {
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
    }
    catch (err) {
        if (err instanceof Error && err.message.includes("JWT_SECRET")) {
            return errorResponse(res, "Server configuration error: JWT_SECRET missing", 500);
        }
        console.error("[LOGIN ERROR]", err);
        return errorResponse(res, "Login failed", 500);
    }
};
//# sourceMappingURL=auth.controller.js.map