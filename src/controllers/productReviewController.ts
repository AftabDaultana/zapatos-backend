import type { Request, Response } from "express";
import { createProductReviewService } from "../services/productReviewService.js";

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
