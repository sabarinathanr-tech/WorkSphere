import { Router } from "express";
import { applyLeave, listLeaves, reviewLeave } from "../controllers/leave.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", requireAuth, listLeaves);
router.post("/", requireAuth, applyLeave);
router.patch("/:id/review", requireAuth, requireRole("ADMIN", "HR"), reviewLeave);

export default router;
