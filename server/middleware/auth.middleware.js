import { prisma } from "../config/db.js";
import { verifyAccessToken } from "../config/jwt.js";

export async function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    const error = new Error("Authentication required");
    error.status = 401;
    return next(error);
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { employee: true }
    });

    if (!user || user.disabledAt || user.tokenVersion !== payload.tokenVersion) {
      const error = new Error("Session is no longer valid");
      error.status = 401;
      return next(error);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
      employeeId: user.employee?.id || null
    };
    return next();
  } catch {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    return next(error);
  }
}
