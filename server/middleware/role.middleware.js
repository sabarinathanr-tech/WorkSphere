export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const error = new Error("You do not have permission to perform this action");
      error.status = 403;
      return next(error);
    }
    return next();
  };
}
