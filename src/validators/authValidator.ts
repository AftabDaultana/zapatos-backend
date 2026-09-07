import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required().min(6).max(18),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().default(false),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().required(),
});

export const verifyOTPSchema = Joi.object({
  otp: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({ "string.pattern.base": "OTP must be a 6 digit number." }),
});

export const passwordResetSchema = Joi.object({
  newPassword: Joi.string().required().min(6).max(18),
});
