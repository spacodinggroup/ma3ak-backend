import { Router } from "express";
import { getAdminStats, getAllUsers, toggleUser, changeUserRole, } from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
const router = Router();
router.use(protect);
router.use(adminOnly);
router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.patch("/user/:id", toggleUser);
router.patch("/user/:id/role", changeUserRole);
export default router;
//# sourceMappingURL=admin.routes.js.map