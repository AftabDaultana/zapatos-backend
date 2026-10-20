import mongoose, { Schema, type Document } from "mongoose";

export interface IProductReview extends Document {
  heading: string;
  content: string;
  status: "unapproved" | "approved" | "rejected";
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  rating: 1 | 2 | 3 | 4 | 5;
}

const productReviewSchema = new Schema<IProductReview>(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["unapproved", "approved", "rejected"],
      default: "unapproved",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer between 1 and 5.",
      },
    },
  },
  {
    timestamps: true,
  },
);

productReviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

const ProductReview = mongoose.model("ProductReview", productReviewSchema);
export default ProductReview;
