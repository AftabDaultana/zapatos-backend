import Joi from "joi";

export const updateUSerSchema = Joi.object({
  email: Joi.string().email().trim().lowercase(),
  name: Joi.string().trim(),
  phoneNumber: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": "Please enter a valid phone number",
    }),
});
