import type { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  getProductBySlugService,
  getProductsByCategoryIdService,
  getProductsBySubCategoryIdService,
  updateProductService,
} from "../services/productService.js";
import Product from "../models/product.js";

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
  const search = String(req.query.search || "");

  const isNewArrival =
    req.query.isNewArrival !== undefined
      ? req.query.isNewArrival === "true"
      : undefined;

  const featured =
    req.query.featured !== undefined
      ? req.query.featured === "true"
      : undefined;

  const isSustainable =
    req.query.isSustainable !== undefined
      ? req.query.isSustainable === "true"
      : undefined;

  const isHighTop =
    req.query.isHighTop !== undefined
      ? req.query.isHighTop === "true"
      : undefined;

  const stock =
    req.query.stock !== undefined ? String(req.query.stock) : undefined;

  const categoryId =
    req.query.categoryId !== undefined
      ? String(req.query.categoryId)
      : undefined;

  const subCategoryId =
    req.query.subCategoryId !== undefined
      ? String(req.query.subCategoryId)
      : undefined;

  const rating =
    req.query.rating !== undefined ? Number(req.query.rating) : undefined;

  const minPrice =
    req.query.minPrice !== undefined ? Number(req.query.minPrice) : undefined;

  const maxPrice =
    req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined;

  const result = await getAllProductsService(
    page,
    limit,
    search,
    isNewArrival,
    featured,
    isSustainable,
    isHighTop,
    stock,
    categoryId,
    subCategoryId,
    rating,
    minPrice,
    maxPrice,
  );

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

export const getProductsByCategoryId = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;

  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  const rating = req.query.rating ? Number(req.query.rating) : undefined;
  const sizes = req.query.size
    ? Array.isArray(req.query.size)
      ? req.query.size.map(String)
      : [String(req.query.size)]
    : [];
  const colors = req.query.color
    ? Array.isArray(req.query.color)
      ? req.query.color.map(String)
      : [String(req.query.color)]
    : [];
  const type = req.query.type ? String(req.query.type) : undefined;

  const products = await getProductsByCategoryIdService(
    categoryId as string,
    page,
    limit,
    minPrice,
    maxPrice,
    sizes,
    colors,
    type,
    rating,
  );

  return res.status(200).json({
    success: true,
    message: "Products found successfully.",
    data: products,
  });
};

export const getProductsBySubCategoryId = async (
  req: Request,
  res: Response,
) => {
  const { subCategoryId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;

  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  const rating = req.query.rating ? Number(req.query.rating) : undefined;
  const sizes = req.query.size
    ? Array.isArray(req.query.size)
      ? req.query.size.map(String)
      : [String(req.query.size)]
    : [];
  const colors = req.query.color
    ? Array.isArray(req.query.color)
      ? req.query.color.map(String)
      : [String(req.query.color)]
    : [];
  const type = req.query.type ? String(req.query.type) : undefined;

  const products = await getProductsBySubCategoryIdService(
    subCategoryId as string,
    page,
    limit,
    minPrice,
    maxPrice,
    sizes,
    colors,
    type,
    rating,
  );

  return res.status(200).json({
    success: true,
    message: "Products found",
    data: products,
  });
};

export const getProductBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const product = await getProductBySlugService(slug as string);

  return res.status(200).json({
    success: true,
    message: "Product found",
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
