import { Router } from "express";
import {
  changePassword,
  changePasswordSchema,
  forgotPassword,
  forgotPasswordSchema,
  login,
  loginSchema,
  logout,
  logoutAll,
  logoutSchema,
  me,
  refresh,
  refreshSchema,
  register,
  registerSchema,
  resetPassword,
  resetPasswordSchema
} from "../controllers/auth.controller.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.get("/login", (_req, res) => {
  res.json({
    endpoint: "/api/auth/login",
    method: "POST",
    requiredBody: ["email", "password"],
    optionalBody: ["role"]
  });
});
router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/refresh", validate(refreshSchema), asyncHandler(refresh));
router.post("/logout", validate(logoutSchema), asyncHandler(logout));
router.post("/forgot-password", validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post("/reset-password", validate(resetPasswordSchema), asyncHandler(resetPassword));
router.get("/me", requireAuth, asyncHandler(me));
router.post("/logout-all", requireAuth, asyncHandler(logoutAll));
router.post("/change-password", requireAuth, validate(changePasswordSchema), asyncHandler(changePassword));

export default router;
