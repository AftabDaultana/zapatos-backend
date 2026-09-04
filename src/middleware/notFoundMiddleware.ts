import type { Request, Response, NextFunction } from "express";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404);

  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};
