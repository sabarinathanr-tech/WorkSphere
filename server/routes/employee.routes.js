import { Router } from "express";
import { createEmployee, getEmployee, listEmployees } from "../controllers/employee.controller.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(listEmployees));
router.post("/", requireAuth, requireRole("ADMIN", "HR"), asyncHandler(createEmployee));
router.get("/:id", requireAuth, asyncHandler(getEmployee));

export default router;
