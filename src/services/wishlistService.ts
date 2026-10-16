import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import Product from "../models/product.js";
import Wishlist from "../models/wishlist.js";

export const toggleWishlistService = async (
  userId: string,
  productId: string,
) => {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    throw new AppError("Invalid user or product ID.", 400);
  }

  const product = await Product.findById(productId).select("name");

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId,
      items: [{ productId: product._id, name: product.name }],
    });

    return {
      action: "added" as const,
      wishlist,
    };
  }

  const existingItemIndex = wishlist.items.findIndex(
    (item) => item.productId.toString() === productId,
  );

  if (existingItemIndex !== -1) {
    wishlist.items.splice(existingItemIndex, 1);
    await wishlist.save();

    return {
      action: "removed" as const,
      wishlist,
    };
  }

  wishlist.items.push({
    productId: product._id,
    name: product.name,
  });

  await wishlist.save();

  return {
    action: "added" as const,
    wishlist,
  };
};

export const getWishlistService = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID.", 400);
  }

  const wishlist = await Wishlist.findOne({ userId }).populate({
    path: "items.productId",
    select:
      "name slug price discountedPrice images rating ratingCount quantity specifications",
  });

  if (!wishlist) {
    return {
      _id: null,
      userId,
      items: [],
    };
  }

  return wishlist;
};
