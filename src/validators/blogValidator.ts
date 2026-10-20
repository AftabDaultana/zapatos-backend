import Joi from "joi";

export const createBlogSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Blog title is required.",
    "any.required": "Blog title is required.",
  }),

  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .messages({
      "string.empty": "Blog slug is required.",
      "string.pattern.base":
        "Slug can contain lowercase letters, numbers, and hyphens only.",
      "any.required": "Blog slug is required.",
    }),

  content: Joi.string().trim().required().messages({
    "string.empty": "Blog content is required.",
    "any.required": "Blog content is required.",
  }),
});

export const updateBlogSchema = Joi.object({
  title: Joi.string().trim(),
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  image: Joi.string().trim().uri().messages({
    "string.uri": "Please provide a valid blog image URL.",
  }),
  content: Joi.string().trim(),
})
  .min(1)
  .messages({
    "object.min": "Provide at least one field to update.",
  });
