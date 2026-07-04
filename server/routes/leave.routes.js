import { Router } from "express";
import { applyLeave, listLeaves, reviewLeave } from "../controllers/leave.controller.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(listLeaves));
router.post("/", requireAuth, asyncHandler(applyLeave));
router.patch("/:id/review", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(reviewLeave));

export default router;
