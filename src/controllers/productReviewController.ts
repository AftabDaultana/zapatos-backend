import type { Request, Response } from "express";
import {
  createProductReviewService,
  deleteProductReviewService,
  getAllProductReviewsService,
  getCurrentUserProductReviewsService,
  getProductReviewsService,
  updateProductReviewService,
  updateProductReviewStatusService,
} from "../services/productReviewService.js";
import AppError from "../utils/AppError.js";

export const createProductReview = async (req: Request, res: Response) => {
  const customerId = req.userId;
  const { productId } = req.params;
  const { heading, content, rating } = req.body;

  const createdProductReview = await createProductReviewService(
    heading,
    content,
    customerId as string,
    productId as string,
    rating,
  );

  return res.status(201).json({
    success: true,
    message: "Product review added successfully.",
    data: createdProductReview,
  });
};

export const getCurrentUserProductReviews = async (
  req: Request,
  res: Response,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const customerId = req.userId;

  const allowedStatuses = ["unapproved", "approved", "rejected"] as const;

  const queryStatus = req.query.status;

  if (queryStatus !== undefined) {
    if (
      typeof queryStatus !== "string" ||
      !allowedStatuses.includes(queryStatus as (typeof allowedStatuses)[number])
    ) {
      throw new AppError(
        "Invalid review status. Allowed values are unapproved, approved, and rejected.",
        400,
      );
    }
  }

  const status = queryStatus as (typeof allowedStatuses)[number] | undefined;

  const customerProductReviews = await getCurrentUserProductReviewsService(
    page,
    limit,
    customerId as string,
    status,
  );

  return res.status(200).json({
    success: true,
    message: "Product reviews fetched successfully",
    data: customerProductReviews,
  });
};

export const getAllProductReviews = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const allowedStatuses = ["unapproved", "approved", "rejected"] as const;

  const queryStatus = req.query.status;

  if (queryStatus !== undefined) {
    if (
      typeof queryStatus !== "string" ||
      !allowedStatuses.includes(queryStatus as (typeof allowedStatuses)[number])
    ) {
      throw new AppError(
        "Invalid review status. Allowed values are unapproved, approved, and rejected.",
        400,
      );
    }
  }

  const status = queryStatus as (typeof allowedStatuses)[number] | undefined;

  const productReviews = await getAllProductReviewsService(page, limit, status);

  return res.status(200).json({
    success: true,
    message: "Product reviews fetched successfully",
    data: productReviews,
  });
};

export const getProductReviews = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { productId } = req.params;

  const productReviews = await getProductReviewsService(
    page,
    limit,
    productId as string,
  );

  return res.status(200).json({
    success: true,
    message: `Product reviews for product ID: ${productId} fetched successfully`,
    data: productReviews,
  });
};

export const updateProductReviewStatus = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedProductReview = await updateProductReviewStatusService(
    id as string,
    status,
  );

  return res.status(200).json({
    success: true,
    message: "Status of product review updated sccessfully.",
    data: updateProductReviewStatus,
  });
};

export const updateProductReview = async (req: Request, res: Response) => {
  const customerId = req.userId;
  const { id } = req.params;
  const { heading, content, rating } = req.body;

  const updatedProductReview = await updateProductReviewService(
    id as string,
    customerId as string,
    heading,
    content,
    rating,
  );

  return res.status(200).json({
    success: true,
    message: "Product review updated successfully",
    data: updatedProductReview,
  });
};

export const deleteProductReview = async (req: Request, res: Response) => {
  const customerId = req.userId;
  const { id } = req.params;

  const deletedProductReview = await deleteProductReviewService(
    id as string,
    customerId as string,
  );

  return res.status(200).json({
    success: true,
    message: "Product review deleted successfully.",
    data: deletedProductReview,
  });
};
