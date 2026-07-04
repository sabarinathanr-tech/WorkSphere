import { verifyToken } from "../config/jwt.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    const error = new Error("Authentication required");
    error.status = 401;
    return next(error);
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    return next(error);
  }
}
