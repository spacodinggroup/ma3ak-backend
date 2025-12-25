import { getUserById } from "../services/user.service.js";
export const getProfile = async (req, res) => {
    const user = await getUserById(req.user.id);
    res.json(user);
};
//# sourceMappingURL=user.controller.js.map