import bcrypt from "bcrypt";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import PasswordReset from "../models/passwordReset.js";
import { generateOTP } from "../utils/generateOTP.js";

export const registerService = async (
  name: string,
  email: string,
  password: string,
) => {
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

  return user;
};

export const loginService = async (
  email: string,
  password: string,
  rememberMe: boolean,
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User with the provided email does not exist", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("UNAUTHORIZED! Please enter the correct password.", 401);
  }

  const token = generateToken(user._id.toString(), rememberMe ? "7d" : "1d");

  return { user, token, rememberMe };
};

export const forgotPasswordService = async (email: string) => {
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

  return {
    otp,
    passwordResetToken,
  };
};

export const verifyOtpService = async (userId: string, otp: string) => {
  const existingOtp = await PasswordReset.findOne({
    userId,
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

  await existingOtp.save();

  return existingOtp;
};

export const resetPasswordService = async (
  newPassword: string,
  userId: string,
) => {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  await user.save();

  await PasswordReset.deleteOne({ userId: user._id });

  return user;
};
