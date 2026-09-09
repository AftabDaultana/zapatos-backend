import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (
  userId: string,
  expiresIn: SignOptions["expiresIn"],
) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const jti = crypto.randomUUID();

  return jwt.sign({ userId }, secret, { expiresIn, jwtid: jti });
};
