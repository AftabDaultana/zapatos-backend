import type { Request, Response } from "express";
import { createSubCategoryService } from "../services/sbCategoryService.js";
import { uploadImageToCloudinary } from "../services/cloudinaryService.js";
import AppError from "../utils/AppError.js";

export const createSubCategory = async (req: Request, res: Response) => {
  const { categoryName, name, slug } = req.body;
  let image: string | undefined;

  if (!req.file) {
    throw new AppError("Image is required", 400);
  }
  const result = await uploadImageToCloudinary(
    req.file.buffer,
    "zapatos/category-image",
  );

  image = result.secure_url;

  const createSubCategory = await createSubCategoryService(
    categoryName,
    name,
    slug,
    image,
  );

  return res.status(201).json({
    success: true,
    message: "Sub category created successfully",
    data: {
      id: createSubCategory._id,
      name: createSubCategory.name,
      slug: createSubCategory.slug,
      image: createSubCategory.image,
      categoryId: createSubCategory.categoryId,
    },
  });
};
