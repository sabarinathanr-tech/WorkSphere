import bcrypt from "bcryptjs";
import { z } from "zod";
import { signToken } from "../config/jwt.js";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "HR", "EMPLOYEE"]).default("EMPLOYEE")
  })
});

export const registerSchema = loginSchema.extend({
  body: loginSchema.shape.body.extend({
    name: z.string().min(2)
  })
});

export async function register(req, res) {
  const { email, role, name } = req.validated.body;
  const passwordHash = await bcrypt.hash(req.validated.body.password, 10);
  const token = signToken({ id: "demo-user", email, role });
  res.status(201).json({
    token,
    user: { id: "demo-user", email, role, name, isVerified: false },
    passwordHashPreview: passwordHash.slice(0, 12)
  });
}

export async function login(req, res) {
  const { email, role } = req.validated.body;
  const token = signToken({ id: "demo-user", email, role });
  res.json({ token, user: { id: "demo-user", email, role, name: role === "EMPLOYEE" ? "Kabir Mehta" : "Anika Rao" } });
}

export function me(req, res) {
  res.json({ user: req.user });
}
