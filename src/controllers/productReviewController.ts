import type { Request, Response } from "express";
import {
  createProductReviewService,
  getUserProductReviewsService,
} from "../services/productReviewService.js";

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

  const status =
    typeof req.query.status === "string" &&
    allowedStatuses.includes(
      req.query.status as (typeof allowedStatuses)[number],
    )
      ? (req.query.status as (typeof allowedStatuses)[number])
      : undefined;

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
