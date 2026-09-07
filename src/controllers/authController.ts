import type { Response, Request } from "express";

import {
  forgotPasswordService,
  loginService,
  registerService,
  resetPasswordService,
  verifyOtpService,
} from "../services/authService.js";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await registerService(name, email, password);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  const { user, token } = await loginService(email, password, rememberMe);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...(rememberMe && {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }),
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const { otp, passwordResetToken } = await forgotPasswordService(email);

  res.cookie("passwordResetToken", passwordResetToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 20 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "OTP generated successfully",
    OTP: otp,
  });
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { otp } = req.body;

  await verifyOtpService(req.userId!, otp);

  return res
    .status(200)
    .json({ success: true, message: "OTP matched successfully" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;

  await resetPasswordService(newPassword, req.userId!);

  res.clearCookie("passwordResetToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
};
