import type { Request, Response } from "express";
import { addToCartService } from "../services/cartService.js";

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { productId, quantity, color, size } = req.body;

  const cart = await addToCartService(
    userId as string,
    productId as string,
    quantity,
    color,
    size,
  );

  return res.status(201).json({
    success: true,
    message: "Product added to cart successfully",
    data: cart,
  });
};
