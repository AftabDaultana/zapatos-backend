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

  const existingSubCategory = await SubCategory.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingSubCategory) {
    throw new AppError("Subcategory name or slug already exists.", 400);
  }

  const createSubCategory = await SubCategory.create({
    categoryId: category._id,
    name,
    slug,
    image,
  });

  return createSubCategory;
};

export const getAllSubCategoriesService = async (
  page: number,
  limit: number,
) => {
  const { skip } = getPagination({ page, limit });

  const subCategories = await SubCategory.find()
    .skip(skip)
    .limit(limit)
    .select("-createdAt -updatedAt -__v");

  const totalSubCategories = await SubCategory.countDocuments();

  const totalPages = Math.ceil(totalSubCategories / limit);

  return {
    subCategories,
    pagination: {
      page,
      limit,
      totalSubCategories,
      totalPages,
    },
  };
};

export const getSubCategoryByIdService = async (id: string) => {
  const subCategory = await SubCategory.findById(id).select(
    "-createdAt -updatedAt -__v",
  );

  if (!subCategory) {
    throw new AppError("No subcategory found against the given ID", 404);
  }

  return subCategory;
};

export const getSubCategoriesByCategoryIdService = async (
  categoryId: string,
) => {
  const subcategories = await SubCategory.find({ categoryId }).select(
    "-createdAt -updatedAt -__v",
  );

  return subcategories;
};

export const updateSubCategoryService = async (
  id: string,
  categoryName?: string,
  name?: string,
  slug?: string,
  image?: string,
) => {
  const subCategory = await SubCategory.findById(id);

  if (!subCategory) {
    throw new AppError("Subcategory with the provided id does not exist", 404);
  }

  if (categoryName !== undefined) {
    const category = await Category.findOne({
      name: categoryName.toUpperCase(),
    }).select("_id name");

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    subCategory.categoryId = category._id;
  }

  if (name !== undefined || slug !== undefined) {
    const existingSubCategory = await SubCategory.findOne({
      $or: [
        ...(name !== undefined ? [{ name }] : []),
        ...(slug !== undefined ? [{ slug }] : []),
      ],
      _id: { $ne: id },
    });

    if (existingSubCategory) {
      throw new AppError("Subcategory name or slug already exists", 400);
    }
  }

  if (name !== undefined) {
    subCategory.name = name;
  }

  if (slug !== undefined) {
    subCategory.slug = slug;
  }

  if (image !== undefined) {
    subCategory.image = image;
  }

  await subCategory.save();

  return subCategory;
};

export const deleteSubCategoryService = async (id: string) => {
  const subCategory = await SubCategory.findByIdAndDelete(id);

  if (!subCategory) {
    throw new AppError(
      "Subcategory against the provided ID does not exist",
      404,
    );
  }

  return subCategory;
};
