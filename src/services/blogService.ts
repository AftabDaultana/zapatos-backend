import Blog from "../models/blog.js";
import AppError from "../utils/AppError.js";

interface CreateBlogData {
  title: string;
  slug: string;
  image: string;
  content: string;
  author: string;
}

export const createBlogService = async (data: CreateBlogData) => {
  const existingBlog = await Blog.findOne({
    $or: [{ title: data.title }, { slug: data.slug }],
  });

  if (existingBlog) {
    throw new AppError("Blog with the title or slug already exist", 400);
  }

  const blog = await Blog.create({
    title: data.title,
    slug: data.slug,
    content: data.content,
    image: data.image,
    author: data.author,
  });

  return blog;
};
