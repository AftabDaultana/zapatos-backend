import Category from "../models/category.js";
import SubCategory from "../models/subCategory.js";
import AppError from "../utils/AppError.js";
import { getPagination } from "../utils/pagination.js";

export const createSubCategoryService = async (
  categoryName: string,
  name: string,
  slug: string,
  image: string,
) => {
  const category = await Category.findOne({
    name: categoryName.toUpperCase(),
  }).select("_id name");

  if (!category) {
    throw new AppError("Category does not exist", 404);
  }

  const existingSubCategory = await SubCategory.findOne({ name });

  if (existingSubCategory) {
    throw new AppError(
      `${existingSubCategory.name} sub category already exists.`,
      400,
    );
  }

  const createSubCategory = await SubCategory.create({
    categoryId: category._id,
    name,
    slug,
    image,
  });

  return createSubCategory;
};
