import AppError from "../utils/AppError.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

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
    return cart;
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

  return existingCart;
};
