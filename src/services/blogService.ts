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

export const getAllBlogsService = async (page: number, limit: number) => {
  const blogs = await Blog.find()
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Blog.countDocuments();

  return {
    blogs,
    total,
    page,
    hasMore: page * limit < total,
  };
};

export const getBlogBySlugService = async (slug: string) => {
  const blog = await Blog.findOne({ slug });

  if (!blog) {
    throw new AppError("Blog with the provided slug does not exist", 404);
  }

  return blog;
};
