import crypto from "crypto";
import bcrypt from "bcryptjs";

export const PASSWORD_RULES_MESSAGE = "Password must be at least 10 characters and include uppercase, lowercase, number and symbol";

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/.test(password);
}

export function createOpaqueToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
