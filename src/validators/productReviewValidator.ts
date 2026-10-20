import Joi from "joi";

export const createProductReviewSchema = Joi.object({
  heading: Joi.string().trim().required().messages({
    "string.empty": "Review heading is required.",
    "any.required": "Review heading is required.",
  }),

  content: Joi.string().trim().required().messages({
    "string.empty": "Review content is required.",
    "any.required": "Review content is required.",
  }),

  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number.",
    "number.integer": "Rating must be an integer.",
    "number.min": "Rating must be between 1 and 5.",
    "number.max": "Rating must be between 1 and 5.",
    "any.required": "Product rating is required.",
  }),
});
