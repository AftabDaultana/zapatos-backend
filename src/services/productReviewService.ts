import AppError from "../utils/AppError.js";
import ProductReview from "../models/productReview.js";
import Product from "../models/product.js";

export const createProductReviewService = async (
  heading: string,
  content: string,
  customerId: string,
  productId: string,
  rating: 1 | 2 | 3 | 4 | 5,
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const alreadyRated = await ProductReview.findOne({
    customerId,
    productId,
  });

  if (alreadyRated) {
    throw new AppError(
      "You cannot add a new review of this product since you have already added a review of this product. Please select the option to update your review.",
      400,
    );
  }

  const createdProductReview = await ProductReview.create({
    heading,
    content,
    customerId,
    productId,
    rating,
    status: "unapproved",
  });

  return createdProductReview;
};
