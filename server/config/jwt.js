import "./env.js";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "worksphere-local-development-secret";

export function signToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, secret);
}
