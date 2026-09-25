import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().required().hex().length(24),
  quantity: Joi.number().integer().min(1).required(),
  color: Joi.string().required().trim(),
  size: Joi.string().required().trim(),
});
