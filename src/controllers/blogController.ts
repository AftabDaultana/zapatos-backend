import type { Response, Request } from "express";
import { createBlogService } from "../services/blogService.js";

export const createBlog = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { title, slug, content, image } = req.body;

  const blog = await createBlogService({
    title,
    slug,
    content,
    image,
    author: userId as string,
  });

  return res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
};
