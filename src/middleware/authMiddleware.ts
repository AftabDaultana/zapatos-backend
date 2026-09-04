import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AppError from "../utils/AppError.js";

interface JwtPayload {
  userId: string;
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const decoded = jwt.verify(token, secret);

  if (typeof decoded === "string" || !decoded.userId) {
    throw new AppError("Invalid authentication token", 401);
  }

  req.userId = decoded.userId;

  next();
};

export const verifyPasswordResetToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const passwordResetToken = req.cookies.passwordResetToken;

  if (!passwordResetToken) {
    throw new AppError(
      "Password reset session has expired. Please request a new OTP.",
      401,
    );
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const decoded = jwt.verify(passwordResetToken, secret);

  if (typeof decoded === "string" || !decoded.userId) {
    throw new AppError("Invalid password reset token", 401);
  }

  req.userId = decoded.userId;

  next();
};
