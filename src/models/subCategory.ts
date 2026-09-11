import mongoose, { Schema, type Document } from "mongoose";

export interface ISubCategory extends Document {
  categoryId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image: string;
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const SubCategory = mongoose.model("subCategory", subCategorySchema);

export default SubCategory;
