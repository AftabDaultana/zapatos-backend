import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  slug: Joi.string().trim().lowercase().required(),
  subCategoryId: Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .required(),
  description: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),
  discountedPrice: Joi.number().min(0).max(Joi.ref("price")).required(),
  quantity: Joi.number().integer().min(0).required(),
  featured: Joi.boolean().default(false),
  isNewArrival: Joi.boolean().default(false),
  isSustainable: Joi.boolean().default(false),
  isHighTop: Joi.boolean().default(false),
  specifications: Joi.object({
    type: Joi.string().trim().required(),
    gender: Joi.string().valid("men", "women", "unisex", "kids").required(),
    material: Joi.string().trim().required(),
    color: Joi.array().items(Joi.string().trim()).min(1).required(),
    sizeRange: Joi.array().items(Joi.string().trim()).min(1).required(),
    features: Joi.array().items(Joi.string().trim()).min(1).required(),
  }).required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim(),
  slug: Joi.string().trim().lowercase(),
  subCategoryId: Joi.array().items(Joi.string().hex().length(24)).min(1),
  description: Joi.string().trim(),
  price: Joi.number().min(0),
  discountedPrice: Joi.number().min(0),
  quantity: Joi.number().integer().min(0),
  featured: Joi.boolean(),
  isNewArrival: Joi.boolean(),
  isSustainable: Joi.boolean(),
  isHighTop: Joi.boolean(),
  specifications: Joi.object({
    type: Joi.string().trim(),
    gender: Joi.string().valid("men", "women", "unisex", "kids"),
    material: Joi.string().trim(),
    color: Joi.array().items(Joi.string().trim()).min(1),
    sizeRange: Joi.array().items(Joi.string().trim()).min(1),
    features: Joi.array().items(Joi.string().trim()).min(1),
  }),
}).min(1);
