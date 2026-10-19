import type { Response, Request } from "express";
import {
  createBlogService,
  getAllBlogsService,
} from "../services/blogService.js";
import AppError from "../utils/AppError.js";
import { uploadImageToCloudinary } from "../services/cloudinaryService.js";

export const createBlog = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { title, slug, content } = req.body;

  if (!req.file) {
    throw new AppError("Blog image is required", 400);
  }

  const uploadedImage = await uploadImageToCloudinary(
    req.file.buffer,
    "zapatos/blogs",
  );

  const blog = await createBlogService({
    title,
    slug,
    content,
    image: uploadedImage.secure_url,
    author: userId as string,
  });

  return res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
};

export const getAllBlogs = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(6, Math.max(1, Number(req.query.limit) || 6));

  const result = await getAllBlogsService(page, limit);

  return res.status(200).json({
    success: true,
    message: "Blogs retrieved successfully.",
    data: result.blogs,
    pagination: {
      page: result.page,
      limit,
      total: result.total,
      hasMore: result.hasMore,
    },
  });
};
