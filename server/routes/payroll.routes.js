import { Router } from "express";
import { getPayroll } from "../controllers/payroll.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getPayroll);

export default router;
