import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(getDashboard));

export default router;
