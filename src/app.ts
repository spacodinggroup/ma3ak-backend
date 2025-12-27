import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import founderRoutes from "./routes/founder.routes.js";
import businessRoutes from "./routes/business.routes.js";
import studentRoutes from "./routes/student.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(
  cors({
    origin: "https://ma3ak.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

/**
 * Health check / Root
 */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Ma3ak Backend!",
    status: "OK",
  });
});

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/founder", founderRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/student", studentRoutes);

/**
 * Error handler 
 */
app.use(errorHandler);

export default app;
