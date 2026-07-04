import { Router } from "express";
import { checkIn, checkOut, getAttendance } from "../controllers/attendance.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getAttendance);
router.post("/check-in", requireAuth, checkIn);
router.post("/check-out", requireAuth, checkOut);

export default router;
