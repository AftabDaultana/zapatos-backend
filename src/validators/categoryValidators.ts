import Joi from "joi";

export const createCatgorySchema = Joi.object({
  name: Joi.string().required().trim(),
  slug: Joi.string().required().trim(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().required().trim(),
  slug: Joi.string().required().trim(),
});
