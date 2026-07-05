import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = [
  process.env.CLIENT_DIST_PATH,
  path.resolve(process.cwd(), "client/dist"),
  path.resolve(__dirname, "../client/dist"),
  path.resolve(__dirname, "../../client/dist")
].filter(Boolean).find((candidate) => fs.existsSync(path.join(candidate, "index.html")));
const railwayOrigin = process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null;
const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  railwayOrigin,
  "https://worksphere-production-88d0.up.railway.app",
  ...(process.env.CLIENT_URLS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5050",
  "http://127.0.0.1:5050"
].filter(Boolean));

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    if (/^https:\/\/[a-z0-9-]+\.up\.railway\.app$/i.test(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "WorkSphere API" });
});

app.get("/ready", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ready", service: "WorkSphere API", database: "connected" });
  } catch (error) {
    error.status = 503;
    error.message = "PostgreSQL is not connected";
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

if (process.env.NODE_ENV === "production" && clientDistPath) {
  const staticOptions = {
    immutable: true,
    maxAge: "1y"
  };

  app.use("/assets", express.static(path.join(clientDistPath, "assets"), staticOptions));
  app.use(express.static(clientDistPath, { index: false }));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    if (path.extname(req.path)) {
      return res.status(404).json({ message: "Static asset not found" });
    }
    return next();
  });

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/assets/")) return next();
    return res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

if (process.env.NODE_ENV === "production" && !clientDistPath) {
  app.get("/", (_req, res) => {
    res.status(503).json({
      message: "Frontend build not found. Run npm run railway:build before starting the production server."
    });
  });
}

app.use(errorHandler);

export default app;
