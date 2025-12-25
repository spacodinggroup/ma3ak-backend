export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'INTERNAL_ERROR';
    console.error(`Error ${statusCode}: ${message}`, err);
    res.status(statusCode).json({
        success: false,
        message,
        code,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
//# sourceMappingURL=error.middleware.js.map