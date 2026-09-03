import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required().min(6).max(18),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().default(false),
});
