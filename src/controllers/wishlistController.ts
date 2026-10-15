import type { Request, Response } from "express";
import {
  getWishlistService,
  toggleWishlistService,
} from "../services/wishlistService.js";

export const toggleWishlist = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { productId } = req.body;

  const result = await toggleWishlistService(
    userId as string,
    productId as string,
  );

  return res.status(200).json({
    success: true,
    message:
      result.action === "added"
        ? "Product added to wishlist successfully."
        : "Product removed from wishlist successfully.",
    data: result,
  });
};

export const getWishlist = async (req: Request, res: Response) => {
  const userId = req.userId;

  const wishlist = await getWishlistService(userId as string);

  return res.status(200).json({
    success: true,
    message: "Wishlist retrieved successfully.",
    data: wishlist,
  });
};
