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

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Ma3ak Backend!",
    status: "OK"
  });
});

app.use(cors());
app.use(Express.json());
app.use('/auth', authRoutes);
app.use('/ai', aiRoutes);
app.use("/user", userRoutes);
app.use("/admin",adminRoutes);
app.use("/founder", founderRoutes);
app.use("/business", businessRoutes);
app.use("/student", studentRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app; 