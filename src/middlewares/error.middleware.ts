import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);