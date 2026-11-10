import Router from "express";
import { validate } from "../middleware/validate.js";
import passport from "../config/passport.js";
import { googleLogin } from "../controllers/authController.js";
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
import { refresh } from "../controllers/refreshController.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(forgotPassword),
);
router.post(
  "/verify-otp",
  validate(verifyOTPSchema),
  verifyPasswordResetToken,
  asyncHandler(verifyOTP),
);
router.post(
  "/reset-password",
  validate(passwordResetSchema),
  verifyPasswordResetToken,
  asyncHandler(resetPassword),
);
router.post("/refresh", asyncHandler(refresh));

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  asyncHandler(googleLogin),
);

export default router;
