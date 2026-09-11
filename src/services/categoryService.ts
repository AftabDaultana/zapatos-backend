import AppError from "../utils/AppError.js";
import Category from "../models/category.js";
import { getPagination } from "../utils/pagination.js";

export const createCategoryService = async (name: string, slug: string) => {
  const existingCategory = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingCategory) {
    throw new AppError(
      `${existingCategory.name} category already exists.`,
      400,
    );
  }

  const categoryCreated = await Category.create({
    name,
    slug,
  });

  return categoryCreated;
};

export const getAllPaginatedCategoriesService = async (
  page: number,
  limit: number,
) => {
  const { skip } = getPagination({ page, limit });
  const categories = await Category.find()
    .select("-createdAt -updatedAt -__v")
    .skip(skip)
    .limit(limit);

  const totalCategories = await Category.countDocuments();

  const totalPages = Math.ceil(totalCategories / limit);

  return {
    categories,
    pagination: {
      page,
      limit,
      totalCategories,
      totalPages,
    },
  };
};

export const getAllCategoriesService = async () => {
  const categories = await Category.find().select("-createdAt -updatedAt -__v");

  return categories;
};

export const updateCategoryService = async (
  id: string,
  name: string,
  slug: string,
) => {
  const category = await Category.findOne({ _id: id }).select(
    "_id name slug updatedAt",
  );

  if (!category) {
    throw new AppError("Category with the provided ID does not exist", 404);
  }

  category.name = name;
  category.slug = slug;

  const updatedCategory = await category.save();

  return updatedCategory;
};

export const deleteCategoryService = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new AppError("Category with the provided ID does not exist", 404);
  }

  return category;
};
