import { z } from "zod";
import { prisma } from "../config/db.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../config/jwt.js";
import {
  createOpaqueToken,
  hashPassword,
  isStrongPassword,
  normalizeEmail,
  PASSWORD_RULES_MESSAGE,
  sha256,
  verifyPassword
} from "../utils/security.js";

const roleSchema = z.enum(["ADMIN", "HR", "EMPLOYEE"]);
const passwordSchema = z.string().refine(isStrongPassword, PASSWORD_RULES_MESSAGE);

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
    role: roleSchema.optional()
  })
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().email(),
    password: passwordSchema,
    role: roleSchema.default("EMPLOYEE")
  })
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(40)
  })
});

export const logoutSchema = refreshSchema;

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email()
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(40),
    password: passwordSchema
  })
});

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    lastLoginAt: user.lastLoginAt,
    employee: user.employee ? {
      id: user.employee.id,
      employeeId: user.employee.employeeId,
      firstName: user.employee.firstName,
      lastName: user.employee.lastName,
      jobTitle: user.employee.jobTitle
    } : null
  };
}

function accessPayload(user) {
  return {
    sub: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
    jti: createOpaqueToken(16)
  };
}

async function createSession(req, user) {
  const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion, jti: createOpaqueToken(16) });
  const refreshTokenHash = sha256(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.authSession.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      expiresAt,
      userAgent: req.headers["user-agent"] || null,
      ipAddress: req.ip || null
    }
  });

  return {
    accessToken: signAccessToken(accessPayload(user)),
    refreshToken
  };
}

async function revokeRefreshToken(refreshToken) {
  await prisma.authSession.updateMany({
    where: {
      refreshTokenHash: sha256(refreshToken),
      revokedAt: null
    },
    data: { revokedAt: new Date() }
  });
}

export async function register(req, res) {
  const { password, role, name } = req.validated.body;
  if (role !== "EMPLOYEE") {
    return res.status(403).json({ message: "Admin and HR accounts must be created by an administrator" });
  }

  const email = normalizeEmail(req.validated.body.email);
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

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
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

  const tokens = await createSession(req, user);
  return res.status(201).json({ ...tokens, user: publicUser(user) });
}

export async function login(req, res) {
  const email = normalizeEmail(req.validated.body.email);
  const { password, role } = req.validated.body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { employee: true }
  });

  if (!user || user.disabledAt || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (role && role !== user.role) {
    return res.status(403).json({ message: "Selected role does not match this account" });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
    include: { employee: true }
  });
  const tokens = await createSession(req, updatedUser);

  return res.json({ ...tokens, user: publicUser(updatedUser) });
}

export async function refresh(req, res) {
  const { refreshToken } = req.validated.body;
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }

  const session = await prisma.authSession.findUnique({
    where: { refreshTokenHash: sha256(refreshToken) },
    include: { user: { include: { employee: true } } }
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.disabledAt || session.user.tokenVersion !== payload.tokenVersion) {
    return res.status(401).json({ message: "Refresh session is no longer valid" });
  }

  await revokeRefreshToken(refreshToken);
  const tokens = await createSession(req, session.user);
  return res.json({ ...tokens, user: publicUser(session.user) });
}

export async function logout(req, res) {
  await revokeRefreshToken(req.validated.body.refreshToken);
  return res.status(204).send();
}

export async function logoutAll(req, res) {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: req.user.id },
      data: { tokenVersion: { increment: 1 } }
    }),
    prisma.authSession.updateMany({
      where: { userId: req.user.id, revokedAt: null },
      data: { revokedAt: new Date() }
    })
  ]);
  return res.status(204).send();
}

export async function changePassword(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user || !(await verifyPassword(req.validated.body.currentPassword, user.passwordHash))) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(req.validated.body.newPassword),
        tokenVersion: { increment: 1 }
      }
    }),
    prisma.authSession.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() }
    })
  ]);

  return res.json({ message: "Password changed. Please sign in again." });
}

export async function forgotPassword(req, res) {
  const email = normalizeEmail(req.validated.body.email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.disabledAt) {
    return res.json({ message: "If the account exists, a reset link has been prepared" });
  }

  const token = createOpaqueToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    }
  });

  return res.json({
    message: "If the account exists, a reset link has been prepared",
    resetToken: process.env.NODE_ENV === "production" ? undefined : token
  });
}

export async function resetPassword(req, res) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: sha256(req.validated.body.token) },
    include: { user: true }
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date() || resetToken.user.disabledAt) {
    return res.status(400).json({ message: "Password reset token is invalid or expired" });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        passwordHash: await hashPassword(req.validated.body.password),
        tokenVersion: { increment: 1 }
      }
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() }
    }),
    prisma.authSession.updateMany({
      where: { userId: resetToken.userId, revokedAt: null },
      data: { revokedAt: new Date() }
    })
  ]);

  return res.json({ message: "Password reset complete. Please sign in." });
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { employee: true }
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user: publicUser(user) });
}
