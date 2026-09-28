import AppError from "../utils/AppError.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
import { getPagination } from "../utils/pagination.js";
import { number } from "joi";

export const addToCartService = async (
  userId: string,
  productId: string,
  quantity: number,
  color: string,
  size: string,
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (!product.specifications.sizeRange.includes(size)) {
    throw new AppError("Requested size is not available", 400);
  }

  if (!product.specifications.color.includes(color)) {
    throw new AppError("Requested color is not available", 400);
  }

  if (quantity > product.quantity) {
    throw new AppError("Requested quantity is not available", 400);
  }

  const existingCart = await Cart.findOne({ userId });

  if (!existingCart) {
    const cart = await Cart.create({
      userId,
      items: [
        {
          productId,
          quantity,
          color,
          size,
        },
      ],
    });
    return await cart.populate("items.productId");
  }

  const existingItem = existingCart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      item.size === size &&
      item.color === color,
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.quantity) {
      throw new AppError("Requested quantity is not available", 400);
    }

    existingItem.quantity = newQuantity;
  } else {
    existingCart.items.push({
      productId: new mongoose.Types.ObjectId(productId),
      quantity,
      color,
      size,
    });
  }

  await existingCart.save();

  return await existingCart.populate("items.productId");
};

export const getUserCartService = async (userId: string) => {
  const cart = await Cart.findOne({ userId })
    .select("-createdAt -updatedAt -__v")
    .populate("items.productId");

  if (!cart) {
    return {
      userId,
      items: [],
    };
  }

  return cart;
};

export const getCartByIdService = async (id: string) => {
  const cart = await Cart.findById(id)
    .select("-createdAt -updatedAt -__v")
    .populate("items.productId");

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  return cart;
};

export const getAllCartsService = async (page: number, limit: number) => {
  const { skip } = getPagination({ page, limit });

  const carts = await Cart.find()
    .select("-createdAt -updatedAt -__v")
    .populate("userId", "name phoneNumber")
    .populate("items.productId")
    .skip(skip)
    .limit(limit);

  const totalCarts = await Cart.countDocuments();
  const totalPages = Math.ceil(totalCarts / limit);

  return {
    carts,
    pagination: {
      page,
      limit,
      totalCarts,
      totalPages,
    },
  };
};

export const updateCartService = async (
  userId: string,
  productId: string,
  quantity?: number,
) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const cartItem = cart.items.find(
    (item) => item.productId.toString() === productId,
  );

  if (!cartItem) {
    throw new AppError("Cart tiem does not exist", 404);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Products not found", 404);
  }

  if (quantity !== undefined && quantity > product.quantity) {
    throw new AppError("Requested quantity is not available", 400);
  }

  if (quantity !== undefined) {
    cartItem.quantity = quantity;
  }

  await cart.save();

  return await cart.populate("items.productId");
};

export const deleteCartItemService = async (
  userId: string,
  productId: string,
) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId,
  );

  if (itemIndex === -1) {
    throw new AppError("Cart item does not exist", 404);
  }

  cart.items.splice(itemIndex, 1);

  await cart.save();

  return await cart.populate("items.productId");
};

export const clearCartService = async (userId: string) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = [];

  await cart.save();

  return cart;
};
