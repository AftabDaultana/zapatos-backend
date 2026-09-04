import type { Response, Request } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";
import { generateOTP } from "../utils/generateOTP.js";
import PasswordReset from "../models/passwordReset.js";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("A user with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

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
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User with the provided email does not exist", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        "UNAUTHORIZED! Please enter the correct password.",
        401,
      );
    }

    const token = generateToken(user._id.toString(), rememberMe ? "7d" : "1d");

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
      message: "Login seccessful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
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

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppError(
      "User with entered email does not exist. Please enter a valid email",
      404,
    );
  }

  const otpExist = await PasswordReset.findOne({
    userId: existingUser._id,
    isVerified: false,
  });

  const otp = generateOTP();

  const hashedOTP = await bcrypt.hash(otp, 12);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  if (otpExist) {
    otpExist.otp = hashedOTP;
    otpExist.isVerified = false;
    otpExist.expiresAt = expiresAt;

    await otpExist.save();
  } else {
    await PasswordReset.create({
      userId: existingUser._id,
      otp: hashedOTP,
      isVerified: false,
      expiresAt,
    });
  }

  const passwordResetToken = generateToken(existingUser._id.toString(), "20m");

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

  if (!otp) {
    throw new AppError("Please enter the otp to continue.", 400);
  }

  const existingOtp = await PasswordReset.findOne({
    userId: req.userId,
    isVerified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!existingOtp) {
    throw new AppError("OTP does not exist for current user.", 404);
  }

  const compareOtp = await bcrypt.compare(otp.toString(), existingOtp.otp);

  if (!compareOtp) {
    throw new AppError("Incorrect OTP", 400);
  }

  existingOtp.isVerified = true;

  existingOtp.save();

  return res
    .status(200)
    .json({ success: true, message: "OTP matched successfully" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new AppError("Please enter your new password", 400);
  }

  const user = await User.findOne({ _id: req.userId });

  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  user.save();

  await PasswordReset.deleteOne({ userId: user._id });

  res.clearCookie("passwordResetToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Passwprd reset successfully",
  });
};
