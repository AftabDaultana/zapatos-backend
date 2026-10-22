import AppError from "../utils/AppError.js";
import ProductReview from "../models/productReview.js";
import Product from "../models/product.js";
import { getPagination } from "../utils/pagination.js";
import mongoose from "mongoose";

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

  const totalProductReviews = await ProductReview.countDocuments({
    productId,
    status: "approved",
  });
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

export const updateProductReviewStatusService = async (
  id: string,
  status: "unapproved" | "approved" | "rejected",
) => {
  const session = await mongoose.startSession();
  let result:
    | {
        productReview: InstanceType<typeof ProductReview>;
        product: InstanceType<typeof Product>;
      }
    | undefined;

  try {
    await session.withTransaction(async () => {
      const productReview = await ProductReview.findById(id).session(session);

      if (!productReview) {
        throw new AppError("Product review not found", 404);
      }

      const product = await Product.findById(productReview.productId)
        .select("_id name slug rating ratingCount")
        .session(session);

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      if (productReview.status === "approved") {
        if (status === "rejected" || status === "unapproved") {
          const updatedStatus = status;
          if (product.ratingCount > 1) {
            const updatedRating = Number(
              (
                (product.rating * product.ratingCount - productReview.rating) /
                (product.ratingCount - 1)
              ).toFixed(1),
            );
            const updatedRatingCount = product.ratingCount - 1;

            productReview.status = updatedStatus;
            await productReview.save({ session });

            product.rating = updatedRating;
            product.ratingCount = updatedRatingCount;

            await product.save({ session });

            result = {
              productReview,
              product,
            };
          } else {
            const updatedRating = 0;
            const updatedRatingCount = 0;

            productReview.status = updatedStatus;
            await productReview.save({ session });

            product.rating = updatedRating;
            product.ratingCount = updatedRatingCount;

            await product.save({ session });

            result = {
              productReview,
              product,
            };
          }
        } else {
          result = {
            productReview,
            product,
          };
        }
      } else if (
        productReview.status === "unapproved" ||
        productReview.status === "rejected"
      ) {
        if (status === "approved") {
          const updatedStatus = status;
          const updatedRating = Number(
            (
              (product.rating * product.ratingCount + productReview.rating) /
              (product.ratingCount + 1)
            ).toFixed(1),
          );
          const updatedRatingCount = product.ratingCount + 1;

          productReview.status = updatedStatus;
          await productReview.save({ session });

          product.rating = updatedRating;
          product.ratingCount = updatedRatingCount;

          await product.save({ session });

          result = {
            productReview,
            product,
          };
        } else {
          result = {
            productReview,
            product,
          };
        }
      } else {
        productReview.status = status;
        await productReview.save({ session });
        result = {
          productReview,
          product,
        };
      }
    });
    return result;
  } finally {
    await session.endSession();
  }
};

export const updateProductReviewService = async (
  id: string,
  customerId: string,
  heading?: string,
  content?: string,
  rating?: 1 | 2 | 3 | 4 | 5,
) => {
  const session = await mongoose.startSession();

  try {
    let result:
      | {
          product: InstanceType<typeof Product>;
          productReview: InstanceType<typeof ProductReview>;
        }
      | undefined;

    await session.withTransaction(async () => {
      const productReview = await ProductReview.findById(id).session(session);

      if (!productReview) {
        throw new AppError("Product review does not exist", 404);
      }

      if (productReview.customerId.toString() !== customerId) {
        throw new AppError(
          "You are not allowed to update this product review.",
          403,
        );
      }

      const previousStatus = productReview.status;
      const previousRating = productReview.rating;

      const product = await Product.findById(productReview.productId)
        .select("_id name rating ratingCount")
        .session(session);

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      if (heading !== undefined) {
        productReview.heading = heading;
      }

      if (content !== undefined) {
        productReview.content = content;
      }

      if (rating !== undefined) {
        productReview.rating = rating;
      }

      if (previousStatus === "approved") {
        const updatedRatingCount = product.ratingCount - 1;

        if (updatedRatingCount <= 0) {
          product.rating = 0;
          product.ratingCount = 0;
        } else {
          product.rating = Number(
            (
              (product.rating * product.ratingCount - previousRating) /
              updatedRatingCount
            ).toFixed(1),
          );

          product.ratingCount = updatedRatingCount;
        }

        await product.save({ session });
      } else if (
        previousStatus === "unapproved" ||
        previousStatus === "rejected"
      ) {
        // No product rating changes are needed.
      }

      productReview.status = "unapproved";

      await productReview.save({ session });

      result = {
        product,
        productReview,
      };
    });

    if (!result) {
      throw new AppError("Failed to update product review", 500);
    }

    return result;
  } finally {
    await session.endSession();
  }
};

export const deleteProductReviewService = async (
  id: string,
  customerId: string,
) => {
  const session = await mongoose.startSession();

  try {
    let deletedProductReview: InstanceType<typeof ProductReview> | undefined;

    await session.withTransaction(async () => {
      const productReview = await ProductReview.findById(id).session(session);

      if (!productReview) {
        throw new AppError("Product review does not exist", 404);
      }

      if (productReview.customerId.toString() !== customerId) {
        throw new AppError(
          "You are not allowed to delete this product review.",
          403,
        );
      }

      if (productReview.status === "approved") {
        const product = await Product.findById(productReview.productId)
          .select("_id rating ratingCount")
          .session(session);

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        const updatedRatingCount = product.ratingCount - 1;

        if (updatedRatingCount <= 0) {
          product.rating = 0;
          product.ratingCount = 0;
        } else {
          product.rating = Number(
            (
              (product.rating * product.ratingCount - productReview.rating) /
              updatedRatingCount
            ).toFixed(1),
          );

          product.ratingCount = updatedRatingCount;
        }

        await product.save({ session });
      }

      deletedProductReview = productReview;

      await ProductReview.deleteOne({ _id: id }).session(session);
    });

    if (!deletedProductReview) {
      throw new AppError("Failed to delete product review", 500);
    }

    return deletedProductReview;
  } finally {
    await session.endSession();
  }
};
