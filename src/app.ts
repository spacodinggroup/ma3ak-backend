import Express from "express";
declare module "cors";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import founderRoutes from "./routes/founder.routes.js";
import businessRoutes from "./routes/business.routes.js";
import studentRoutes from "./routes/student.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = Express();

app.use(cors());
app.use(Express.json());
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/founder", founderRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/student", studentRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app; 