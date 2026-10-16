import mongoose, { Schema, type Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  image: string;
  author: mongoose.Types.ObjectId;
}

const blog = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Blog = mongoose.model("Blog", blog);
export default Blog;
