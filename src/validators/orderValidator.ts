import Joi from "joi";

const orderItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
  color: Joi.string().trim().required(),
  size: Joi.string().trim().required(),
});

const addressSchema = Joi.object({
  street: Joi.string().trim(),
  city: Joi.string().trim(),
  state: Joi.string().trim(),
  postalCode: Joi.string().trim(),
  country: Joi.string().trim(),
});

const customerSchema = Joi.object({
  name: Joi.string().trim(),
  email: Joi.string().trim().email(),
  phoneNumber: Joi.string().trim(),
});

export const createOrderSchema = Joi.object({
  customer: customerSchema,
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
  items: Joi.array().items(orderItemSchema).min(1).required(),
});
