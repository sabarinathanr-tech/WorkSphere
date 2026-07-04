import { Router } from "express";
import { getPayroll } from "../controllers/payroll.controller.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(getPayroll));

export default router;
