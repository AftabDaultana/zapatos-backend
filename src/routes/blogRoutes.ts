import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
} from "../controllers/blogController.js";
import {
  createBlogSchema,
  updateBlogSchema,
} from "../validators/blogValidator.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/admin",
  verifyUser,
  verifyAdmin,
  upload.single("image"),
  validate(createBlogSchema),
  asyncHandler(createBlog),
);
router.get("/", asyncHandler(getAllBlogs));
router.get("/:slug", asyncHandler(getBlogBySlug));
router.put(
  "/admin/:id",
  verifyUser,
  verifyAdmin,
  upload.single("image"),
  validate(updateBlogSchema),
  asyncHandler(updateBlog),
);

export default router;
