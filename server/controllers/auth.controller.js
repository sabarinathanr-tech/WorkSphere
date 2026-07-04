import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/db.js";
import { signToken } from "../config/jwt.js";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "HR", "EMPLOYEE"]).optional()
  })
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "HR", "EMPLOYEE"]).default("EMPLOYEE")
  })
});

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    employee: user.employee ? {
      employeeId: user.employee.employeeId,
      firstName: user.employee.firstName,
      lastName: user.employee.lastName,
      jobTitle: user.employee.jobTitle
    } : null
  };
}

export async function register(req, res) {
  const { email, password, role, name } = req.validated.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "An account already exists for this email" });
  }

  const peopleDepartment = await prisma.department.upsert({
    where: { name: "People" },
    update: {},
    create: { name: "People", description: "HR operations and employee experience" }
  });
  const [firstName, ...rest] = name.trim().split(/\s+/);
  const lastName = rest.join(" ") || "User";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      isVerified: false,
      employee: {
        create: {
          employeeId: `EMP-${Date.now().toString().slice(-6)}`,
          firstName,
          lastName,
          jobTitle: role === "HR" ? "HR Associate" : role === "ADMIN" ? "Administrator" : "Employee",
          salary: 0,
          departmentId: peopleDepartment.id,
          dateOfJoining: new Date()
        }
      }
    },
    include: { employee: true }
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return res.status(201).json({ token, user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password, role } = req.validated.body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { employee: true }
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (role && role !== user.role) {
    return res.status(403).json({ message: "Selected role does not match this account" });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return res.json({ token, user: publicUser(user) });
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { employee: true }
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user: publicUser(user) });
}
