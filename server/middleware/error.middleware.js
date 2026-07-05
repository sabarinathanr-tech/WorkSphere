export function errorHandler(error, _req, res, _next) {
  const status = error.status || error.statusCode || 500;
  res.status(status).json({
    message: error.message || "Something went wrong",
    details: process.env.NODE_ENV === "production" ? undefined : error.details
  });
}
