import cors from "cors";
import express from "express";
import "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import { prisma } from "./config/db.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://127.0.0.1:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", service: "WorkSphere API", database: "connected" });
  } catch (error) {
    error.status = 503;
    error.message = "WorkSphere API is running, but PostgreSQL is not connected";
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/profile", profileRoutes);

app.use(errorHandler);

export default app;
