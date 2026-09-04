import mongoose, { Schema, type Document } from "mongoose";

interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  otp: string;
  isVerified: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);

export default PasswordReset;
