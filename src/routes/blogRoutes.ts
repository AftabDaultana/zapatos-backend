import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
} from "../controllers/blogController.js";

const router = Router();

router.post(
  "/admin",
  verifyUser,
  verifyAdmin,
  upload.single("image"),
  asyncHandler(createBlog),
);
router.get("/", asyncHandler(getAllBlogs));
router.get("/:slug", asyncHandler(getBlogBySlug));

export default router;
