import type { Request, Response } from "express";
import {
  createProductReviewService,
  getAllProductReviewsService,
  getUserProductReviewsService,
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

export const getUserProductReviews = async (req: Request, res: Response) => {
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

  const customerProductReviews = await getUserProductReviewsService(
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
