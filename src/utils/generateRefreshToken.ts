import crypto from "crypto";

export const generateRefreshToken = () => {
  const token = crypto.randomBytes(40).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  return { token, tokenHash };
};
