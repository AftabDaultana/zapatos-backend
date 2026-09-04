import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (
  userId: string,
  expiresIn: SignOptions["expiresIn"],
) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ userId }, secret, { expiresIn });
};
