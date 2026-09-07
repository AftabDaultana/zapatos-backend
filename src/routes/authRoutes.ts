import Router from "express";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  passwordResetSchema,
  registerSchema,
  verifyOTPSchema,
} from "../validators/authValidator.js";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyOTP,
} from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyPasswordResetToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", logout);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(forgotPassword),
);
router.post(
  "/verify-otp",
  validate(verifyOTPSchema),
  verifyPasswordResetToken,
  verifyOTP,
);
router.post(
  "/reset-password",
  validate(passwordResetSchema),
  verifyPasswordResetToken,
  asyncHandler(resetPassword),
);

export default router;
