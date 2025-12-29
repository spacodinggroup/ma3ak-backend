import { getUserById } from "../services/user.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
export const getProfile = async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        successResponse(res, user);
    }
    catch (error) {
        errorResponse(res, "Failed to get profile", 500);
    }
};
//# sourceMappingURL=user.controller.js.map