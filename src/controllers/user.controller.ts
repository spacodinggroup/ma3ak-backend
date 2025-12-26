import { getUserById } from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { AuthenticatedRequest } from "../types/request.js";
import { Response } from "express";

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await getUserById(req.user!.id);
        successResponse(res, user);
    } catch (error) {
        errorResponse(res, "Failed to get profile", 500);
    }
};