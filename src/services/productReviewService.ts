import AppError from "../utils/AppError.js";
import ProductReview from "../models/productReview.js";
import Product from "../models/product.js";
import { getPagination } from "../utils/pagination.js";

export const createProductReviewService = async (
  heading: string,
  content: string,
  customerId: string,
  productId: string,
  rating: 1 | 2 | 3 | 4 | 5,
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const alreadyRated = await ProductReview.findOne({
    customerId,
    productId,
  });

  if (alreadyRated) {
    throw new AppError(
      "You cannot add a new review of this product since you have already added a review of this product. Please select the option to update your review.",
      400,
    );
  }

  const createdProductReview = await ProductReview.create({
    heading,
    content,
    customerId,
    productId,
    rating,
    status: "unapproved",
  });

  return createdProductReview;
};

export const getCurrentUserProductReviewsService = async (
  page: number,
  limit: number,
  customerId: string,
  status?: "unapproved" | "approved" | "rejected",
) => {
  const { skip } = getPagination({ page, limit });
  const filter: Record<string, unknown> = {
    customerId,
  };

  if (status) {
    filter.status = status;
  }
  const customerProductReviews = await ProductReview.find(filter)
    .populate("productId", "name slug")
    .populate("customerId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalProductReviews = await ProductReview.countDocuments(filter);
  const totalPages = Math.ceil(totalProductReviews / limit);

  return {
    customerProductReviews,
    pagination: {
      page,
      limit,
      totalProductReviews,
      totalPages,
    },
  };
};

export const getAllProductReviewsService = async (
  page: number,
  limit: number,
  status?: "unapproved" | "approved" | "rejected",
) => {
  const { skip } = getPagination({ page, limit });
  const filter: Record<string, unknown> = {};

  if (status) {
    filter.status = status;
  }

  const productReviews = await ProductReview.find(filter)
    .populate("productId", "name slug")
    .populate("customerId", "name")
    .skip(skip)
    .limit(limit);

  const totalProductReviews = await ProductReview.countDocuments(filter);
  const totalPages = Math.ceil(totalProductReviews / limit);

  return {
    productReviews,
    pagination: {
      page,
      limit,
      totalProductReviews,
      totalPages,
    },
  };
};

export const getProductReviewsService = async (
  page: number,
  limit: number,
  productId: string,
) => {
  const { skip } = getPagination({ page, limit });

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const productReviews = await ProductReview.find({
    productId,
    status: "approved",
  })
    .populate("productId", "name slug")
    .populate("customerId", "name")
    .skip(skip)
    .limit(limit);

  const totalProductReviews = await ProductReview.countDocuments();
  const totalPages = Math.ceil(totalProductReviews / limit);

  return {
    productReviews,
    pagination: {
      page,
      limit,
      totalProductReviews,
      totalPages,
    },
  };
};
