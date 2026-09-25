import type { Request, Response } from "express";
import {
  addToCartService,
  deleteCartItemService,
  getAllCartsService,
  getCartByIdService,
  getUserCartService,
  updateCartService,
} from "../services/cartService.js";

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

export const getUserCart = async (req: Request, res: Response) => {
  const userId = req.userId;

  const cart = await getUserCartService(userId as string);

  return res.status(200).json({
    success: true,
    message: "Cart found",
    data: cart,
  });
};

export const getCartById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const cart = await getCartByIdService(id as string);

  return res.status(200).json({
    success: true,
    message: "Cart found",
    data: cart,
  });
};

export const getAllCarts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const carts = await getAllCartsService(page, limit);

  return res.status(200).json({
    success: true,
    message: "Carts found",
    data: carts,
  });
};

export const updateCart = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { productId, quantity, color, size } = req.body;

  const updatedCart = await updateCartService(
    userId as string,
    productId as string,
    quantity,
    color,
    size,
  );

  return res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: updatedCart,
  });
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { productId } = req.body;

  const cart = await deleteCartItemService(userId, productId);

  return res.status(200).json({
    success: true,
    message: "Cart item deleted successfully",
    data: cart,
  });
};
