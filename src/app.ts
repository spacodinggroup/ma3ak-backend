import express from "express";
import cors from "cors";

import { ENV } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import founderRoutes from "./routes/founder.routes.js";
import businessRoutes from "./routes/business.routes.js";
import studentRoutes from "./routes/student.routes.js";
import examRoutes from "./routes/exam.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      const allowlist = (ENV.CORS_ORIGIN || "http://localhost:3000,https://your-frontend-domain.com")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

      // allow non-browser clients (no Origin header)
      if (!origin) return callback(null, true);

      if (allowlist.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"), false);
    },
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
app.use("/api/exams", examRoutes);

/**
 * Error handler 
 */
app.use(errorHandler);

export default app;
