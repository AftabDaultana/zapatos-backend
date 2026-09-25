import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().required().hex().length(24),
  quantity: Joi.number().integer().min(1).required(),
  color: Joi.string().required().trim(),
  size: Joi.string().required().trim(),
});

export const updateCartSchema = Joi.object({
  productId: Joi.string().required().hex().length(24),
  quantity: Joi.number().min(1),
  color: Joi.string().trim(),
  size: Joi.string().trim(),
});

export const deleteCartItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});
