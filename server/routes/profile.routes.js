import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(getProfile));
router.patch("/", requireAuth, asyncHandler(updateProfile));

export default router;
