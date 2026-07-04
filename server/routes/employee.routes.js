import { Router } from "express";
import { createEmployee, getEmployee, listEmployees } from "../controllers/employee.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", requireAuth, listEmployees);
router.post("/", requireAuth, requireRole("ADMIN", "HR"), createEmployee);
router.get("/:id", requireAuth, getEmployee);

export default router;
