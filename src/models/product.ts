import mongoose, { Schema, type Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  subCategoryId: mongoose.Types.ObjectId[];
  description: string;
  rating: number;
  ratingCount: number;
  price: number;
  discountedPrice: number;
  quantity: number;
  featured: boolean;
  isNewArrival: boolean;
  isSustainable: boolean;
  isHighTop: boolean;
  specifications: {
    type: string;
    gender: string;
    material: string;
    color: string[];
    sizeRange: string[];
    features: string[];
  };
  images: string[];
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    subCategoryId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "SubCategory",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isSustainable: {
      type: Boolean,
      default: false,
    },
    isHighTop: {
      type: Boolean,
      default: false,
    },
    specifications: {
      type: {
        type: String,
        required: true,
        trim: true,
      },
      gender: {
        type: String,
        required: true,
        enum: ["men", "women", "unisex", "kids"],
        default: "men",
      },
      material: {
        type: String,
        required: true,
        trim: true,
      },
      color: {
        type: [String],
        required: true,
      },
      sizeRange: {
        type: [String],
        required: true,
      },
      features: {
        type: [String],
        required: true,
      },
    },
    images: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
