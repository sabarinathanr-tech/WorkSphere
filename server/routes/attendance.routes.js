import { Router } from "express";
import { checkIn, checkOut, getAttendance } from "../controllers/attendance.controller.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(getAttendance));
router.post("/check-in", requireAuth, asyncHandler(checkIn));
router.post("/check-out", requireAuth, asyncHandler(checkOut));

export default router;
