import ApiError from "../utils/ApiError.js";

// 404 handler — for unmatched routes
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message    = err.message    || "Internal server error";

  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${statusCode} — ${message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};