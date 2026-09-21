import { response, type Request, type Response } from "express";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getAllPaginatedCategoriesService,
  updateCategoryService,
} from "../services/categoryService.js";

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;

  const createdCategory = await createCategoryService(name, slug);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: {
      name: createdCategory.name,
      slug: createdCategory.slug,
    },
  });
};

export const getAllPaginatedCategories = async (
  req: Request,
  res: Response,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const result = await getAllPaginatedCategoriesService(page, limit);

  return res.status(200).json({
    success: true,
    message: "Categories found.",
    data: result.categories,
    pagination: result.pagination,
  });
};

export const getAllCategories = async (req: Request, res: Response) => {
  const result = await getAllCategoriesService();

  return res.status(200).json({
    success: true,
    message: "Categories found",
    data: result,
  });
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  const updatedCategory = await updateCategoryService(id as string, name, slug);

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteCategoryService(id as string);

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
  });
};
