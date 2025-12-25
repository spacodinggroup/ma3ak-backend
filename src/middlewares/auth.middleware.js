import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { getUserById } from "../services/user.service.js";
export const protect = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth)
            return res.status(401).json({ message: "No token" });
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const user = await getUserById(decoded.id);
        if (!user)
            return res.status(401).json({ message: "User not found" });
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ message: "Unauthorized" });
    }
};
//# sourceMappingURL=auth.middleware.js.map