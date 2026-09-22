import type { Request, Response } from "express";
import {
  createSubCategoryService,
  deleteSubCategoryService,
  getAllPaginatedSubCategoriesService,
  getSubCategoriesByCategoryIdService,
  getSubCategoryByIdService,
  updateSubCategoryService,
} from "../services/subCategoryService.js";
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

export const getAllPaginatedSubCategories = async (
  req: Request,
  res: Response,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = String(req.query.search || "");

  const subCategories = await getAllPaginatedSubCategoriesService(page, limit);

  return res.status(200).json({
    success: true,
    message: "Subcategories found.",
    data: subCategories,
  });
};

export const getSubCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const subCategory = await getSubCategoryByIdService(id as string);

  return res.status(200).json({
    success: true,
    message: "Subcategory found",
    data: subCategory,
  });
};

export const getSubCategoriesByCategoryId = async (
  req: Request,
  res: Response,
) => {
  const { categoryId } = req.params;

  const subCategories = await getSubCategoriesByCategoryIdService(
    categoryId as string,
  );

  return res.status(200).json({
    success: true,
    message: "Subcategories found.",
    data: subCategories,
  });
};

export const updateSubCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { categoryName, name, slug } = req.body;

  let image: string | undefined;

  if (req.file) {
    const result = await uploadImageToCloudinary(
      req.file.buffer,
      "zapatos/category-image",
    );

    image = result.secure_url;
  }

  const updatedSubCategory = await updateSubCategoryService(
    id as string,
    categoryName,
    name,
    slug,
    image,
  );

  return res.status(200).json({
    success: true,
    message: "Subcategory updated successfully",
    data: {
      id: updatedSubCategory._id,
      categoryId: updatedSubCategory.categoryId,
      name: updatedSubCategory.name,
      slug: updatedSubCategory.slug,
      image: updatedSubCategory.image,
    },
  });
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteSubCategoryService(id as string);

  return res.status(200).json({
    success: true,
    message: "Subcategory deleted successfully.",
  });
};
