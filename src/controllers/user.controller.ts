import { getUserById } from "../services/user.service.js";

export const getProfile = async (req: any, res: any) => {
    const user = await getUserById(req.user.id);
    res.json(user);
};