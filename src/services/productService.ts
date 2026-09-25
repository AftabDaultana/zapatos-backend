import mongoose from "mongoose";
import Product from "../models/product.js";
import AppError from "../utils/AppError.js";
import SubCategory from "../models/subCategory.js";
import { uploadImageToCloudinary } from "./cloudinaryService.js";
import { getPagination } from "../utils/pagination.js";
import Category from "../models/category.js";
import {
  getSubCategoriesByCategoryIdService,
  getSubCategoryByIdService,
} from "./subCategoryService.js";

export const createProductService = async (
  name: string,
  slug: string,
  subCategoryId: string[],
  description: string,
  price: number,
  discountedPrice: number,
  quantity: number,
  featured: boolean,
  isNewArrival: boolean,
  isSustainable: boolean,
  isHighTop: boolean,
  specifications: {
    type: string;
    gender: string;
    material: string;
    color: string[];
    sizeRange: string[];
    features: string[];
  },
  files: Express.Multer.File[],
) => {
  const existingProduct = await Product.findOne({ slug });

  if (existingProduct) {
    throw new AppError("Product with the given slug already exist", 400);
  }

  if (discountedPrice > price) {
    throw new AppError(
      "Discounted price cannot be greater than the actual price",
      400,
    );
  }

  const subCategoryObjectIds = subCategoryId.map(
    (id) => new mongoose.Types.ObjectId(id),
  );

  const existingSubCategories = await SubCategory.find({
    _id: { $in: subCategoryObjectIds },
  }).select("_id");

  if (existingSubCategories.length !== subCategoryObjectIds.length) {
    throw new AppError("One or more provided subcategories do not exist", 404);
  }

  if (!files || files.length === 0) {
    throw new AppError("At least one product image is required", 400);
  }
  const uploadedImages = await Promise.all(
    files.map((file) =>
      uploadImageToCloudinary(file.buffer, "zapatos/products"),
    ),
  );
  const images = uploadedImages.map((image) => image.secure_url);

  const product = await Product.create({
    name,
    slug,
    subCategoryId: subCategoryObjectIds,
    description,
    rating: 0,
    ratingCount: 0,
    price,
    discountedPrice,
    quantity,
    featured,
    isNewArrival,
    isSustainable,
    isHighTop,
    specifications,
    images,
  });

  return product;
};

export const getAllProductsService = async (
  page: number,
  limit: number,
  search?: string,
  isNewArrival?: boolean,
  featured?: boolean,
  isSustainable?: boolean,
  isHighTop?: boolean,
  stock?: string,
  categoryId?: string,
  subCategoryId?: string,
  rating?: number,
  minPrice?: number,
  maxPrice?: number,
) => {
  const { skip } = getPagination({ page, limit });

  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { slug: new RegExp(search, "i") },
    ];
  }

  if (isNewArrival !== undefined) {
    filter.isNewArrival = isNewArrival;
  }

  if (featured !== undefined) {
    filter.featured = featured;
  }

  if (isSustainable !== undefined) {
    filter.isSustainable = isSustainable;
  }

  if (isHighTop !== undefined) {
    filter.isHighTop = isHighTop;
  }

  if (stock === "in-stock") {
    filter.quantity = { $gt: 0 };
  }

  if (stock === "out-of-stock") {
    filter.quantity = 0;
  }

  if (categoryId) {
    const subCategories = await SubCategory.find({
      categoryId,
    }).select("_id");

    const subCategoryIds = subCategories.map((subCategory) => subCategory._id);

    filter.subCategoryId = { $in: subCategoryIds };
  }

  if (subCategoryId) {
    filter.subCategoryId = subCategoryId;
  }

  if (rating !== undefined) {
    filter.rating = { $gte: rating };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.discountedPrice = {};

    if (minPrice !== undefined) {
      filter.discountedPrice.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      filter.discountedPrice.$lte = maxPrice;
    }
  }

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-createdAt -updatedAt -__v");

  const totalProducts = await Product.countDocuments(filter);

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages,
    },
  };
};

export const getProductByIdService = async (id: string) => {
  const product = await Product.findById(id).select(
    "-createdAt -updatedAt -__v",
  );

  if (!product) {
    throw new AppError("No product found against the provided ID", 404);
  }

  return product;
};

export const getProductsByCategoryIdService = async (
  categoryId: string,
  page: number,
  limit: number,
  minPrice?: number,
  maxPrice?: number,
  sizes: string[] = [],
  colors: string[] = [],
  type?: string,
  rating?: number,
) => {
  const { skip } = getPagination({ page, limit });

  const subcategories = await getSubCategoriesByCategoryIdService(categoryId);

  if (subcategories.length === 0) {
    return [];
  }

  const subCategoryIds = subcategories.map((subCategory) => subCategory._id);

  const filter: Record<string, any> = {
    subCategoryId: { $in: subCategoryIds },
  };

  if (maxPrice !== undefined || minPrice !== undefined) {
    filter.discountedPrice = {};

    if (maxPrice !== undefined) {
      filter.discountedPrice.$lte = maxPrice;
    }

    if (minPrice !== undefined) {
      filter.discountedPrice.$gte = minPrice;
    }
  }

  if (sizes.length > 0) {
    filter["specifications.sizeRange"] = {
      $in: sizes,
    };
  }

  if (colors.length > 0) {
    filter["specifications.color"] = {
      $in: colors,
    };
  }

  if (type != undefined) {
    filter["specifications.type"] = type;
  }

  if (rating != undefined) {
    filter.rating = {
      $gte: rating,
    };
  }

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .select("-createdAt -updatedAt -__v");

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages,
    },
  };
};

export const getProductsBySubCategoryIdService = async (
  subCategoryId: string,
  page: number,
  limit: number,
  minPrice?: number,
  maxPrice?: number,
  sizes: string[] = [],
  colors: string[] = [],
  type?: string,
  rating?: number,
) => {
  const { skip } = getPagination({ page, limit });
  const filter: Record<string, any> = {
    subCategoryId,
  };

  if (maxPrice !== undefined || minPrice !== undefined) {
    filter.discountedPrice = {};

    if (maxPrice !== undefined) {
      filter.discountedPrice.$lte = maxPrice;
    }

    if (minPrice !== undefined) {
      filter.discountedPrice.$gte = minPrice;
    }
  }

  if (sizes.length > 0) {
    filter["specifications.sizeRange"] = {
      $in: sizes,
    };
  }

  if (colors.length > 0) {
    filter["specifications.color"] = {
      $in: colors,
    };
  }

  if (type != undefined) {
    filter["specifications.type"] = type;
  }

  if (rating != undefined) {
    filter.rating = {
      $gte: rating,
    };
  }
  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .select("-createdAt -updatedAt -__v");

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages,
    },
  };
};

export const getProductBySlugService = async (slug: string) => {
  const product = await Product.findOne({ slug: slug.toLowerCase() }).select(
    "-createdAt -updatedAt -__v",
  );

  if (!product) {
    throw new AppError("No product found", 404);
  }

  return product;
};

export const updateProductService = async (
  id: string,
  name?: string,
  slug?: string,
  subCategoryId?: string[],
  description?: string,
  price?: number,
  discountedPrice?: number,
  quantity?: number,
  featured?: boolean,
  isNewArrival?: boolean,
  isSustainable?: boolean,
  isHighTop?: boolean,
  specifications?: {
    type?: string;
    gender?: string;
    material?: string;
    color?: string[];
    sizeRange?: string[];
    features?: string[];
  },
  files?: Express.Multer.File[],
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (slug && slug !== product.slug) {
    const existingProduct = await Product.findOne({ slug, _id: { $ne: id } });
    if (existingProduct) {
      throw new AppError("Product with the given slug already exists", 400);
    }
  }

  if (subCategoryId) {
    const subCategoryObjectIds = subCategoryId.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    const existingSubCategories = await SubCategory.find({
      _id: { $in: subCategoryObjectIds },
    }).select("_id");
    if (existingSubCategories.length !== subCategoryObjectIds.length) {
      throw new AppError(
        "One or more provided subcategories do not exist",
        404,
      );
    }
    product.subCategoryId = subCategoryObjectIds;
  }

  const finalPrice = price ?? product.price;
  const finalDiscountedPrice = discountedPrice ?? product.discountedPrice;

  if (finalDiscountedPrice > finalPrice) {
    throw new AppError(
      "Discounted price cannot be greater than the actual price",
      400,
    );
  }

  if (name !== undefined) product.name = name;
  if (slug !== undefined) product.slug = slug;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (discountedPrice !== undefined) {
    product.discountedPrice = discountedPrice;
  }
  if (quantity !== undefined) product.quantity = quantity;
  if (featured !== undefined) product.featured = featured;
  if (isNewArrival !== undefined) product.isNewArrival = isNewArrival;
  if (isSustainable !== undefined) product.isSustainable = isSustainable;
  if (isHighTop !== undefined) product.isHighTop = isHighTop;
  if (specifications !== undefined) {
    product.specifications = { ...product.specifications, ...specifications };
  }
  if (files && files.length > 0) {
    const uploadedImages = await Promise.all(
      files.map((file) =>
        uploadImageToCloudinary(file.buffer, "zapatos/products"),
      ),
    );
    product.images = uploadedImages.map((image) => image.secure_url);
  }

  await product.save();
  return product;
};

export const deleteProductService = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new AppError("Product with the provided ID does not exist", 404);
  }

  return product;
};
