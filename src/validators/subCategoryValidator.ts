import Joi from "joi";

export const createSubCategorySchema = Joi.object({
  categoryName: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  slug: Joi.string().trim().lowercase().required(),
  image: Joi.string().uri().trim().required(),
});

export const updateSubCategorySchema = Joi.object({
  categoryName: Joi.string().trim(),
  name: Joi.string().trim(),
  slug: Joi.string().trim().lowercase(),
  image: Joi.string().uri().trim(),
});
