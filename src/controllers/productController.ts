import type { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
} from "../services/productService.js";

export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    slug,
    subCategoryId,
    description,
    price,
    discountedPrice,
    quantity,
    featured,
    isNewArrival,
    isSustainable,
    isHighTop,
    specifications,
  } = req.body;

  const files = req.files as Express.Multer.File[];

  const product = await createProductService(
    name,
    slug,
    subCategoryId,
    description,
    price,
    discountedPrice,
    quantity,
    featured,
    isNewArrival,
    isSustainable,
    isHighTop,
    specifications,
    files,
  );

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

export const getAllProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await getAllProductsService(page, limit);

  return res.status(200).json({
    success: true,
    message: "Products found",
    data: result,
  });
};

export const getProductbyId = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await getProductByIdService(id as string);

  return res.status(200).json({
    success: true,
    message: "Product found successfully",
    data: product,
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    slug,
    subCategoryId,
    description,
    price,
    discountedPrice,
    quantity,
    featured,
    isNewArrival,
    isSustainable,
    isHighTop,
    specifications,
  } = req.body;
  const files = req.files as Express.Multer.File[];

  const updatedProduct = await updateProductService(
    id as string,
    name,
    slug,
    subCategoryId,
    description,
    price,
    discountedPrice,
    quantity,
    featured,
    isNewArrival,
    isSustainable,
    isHighTop,
    specifications,
    files,
  );

  return res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    data: updatedProduct,
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteProductService(id as string);

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};
