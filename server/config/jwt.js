import "./env.js";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "worksphere-local-development-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "worksphere-local-refresh-secret";
const issuer = "worksphere-api";
const audience = "worksphere-client";

export function signAccessToken(payload) {
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    issuer,
    audience
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    issuer,
    audience
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, secret, { issuer, audience });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret, { issuer, audience });
}
