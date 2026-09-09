import mongoose, { Document, Schema } from "mongoose";

export interface IBlacklistedToken extends Document {
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
}

const blackListedTokenSchema = new mongoose.Schema<IBlacklistedToken>(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
      expires: 0,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

const BlacklistedToken = mongoose.model<IBlacklistedToken>(
  "BlacklistedToken",
  blackListedTokenSchema,
);

export default BlacklistedToken;
