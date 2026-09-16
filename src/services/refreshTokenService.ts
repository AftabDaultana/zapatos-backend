import crypto from "crypto";
import { RefreshToken } from "../models/refreshToken.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";
import { generateRefreshToken } from "../utils/generateRefreshToken.js";

export const refreshTokenService = async (refreshTokenValue: string) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshTokenValue)
    .digest("hex");

  const storedToken = await RefreshToken.findOne({ tokenHash });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError("Invalid or expired session. Please log in again.", 401);
  }

  const user = await User.findById(storedToken.userId);

  if (!user || user.status !== "active") {
    throw new AppError("Account is no longer active.", 403);
  }

  const newAccessToken = generateToken(user._id.toString(), "15m");
  const { token: newRefreshTokenValue, tokenHash: newTokenHash } =
    generateRefreshToken();

  storedToken.tokenHash = newTokenHash;
  storedToken.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await storedToken.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshTokenValue };
};
