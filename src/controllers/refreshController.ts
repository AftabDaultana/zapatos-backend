import type { Request, Response } from "express";
import AppError from "../utils/AppError.js";
import { refreshTokenService } from "../services/refreshTokenService.js";

export const refresh = async (req: Request, res: Response) => {
  const refreshTokenValue = req.cookies.refreshToken;

  if (!refreshTokenValue) {
    throw new AppError("No active session found. Please log in again.", 401);
  }

  const { accessToken, refreshToken } =
    await refreshTokenService(refreshTokenValue);

  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
  });

  return res.status(200).json({
    success: true,
    message: "Session refreshed",
  });
};
