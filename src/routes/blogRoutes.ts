import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createBlog } from "../controllers/blogController.js";

const router = Router();

router.post(
  "/admin",
  verifyUser,
  verifyAdmin,
  upload.single("image"),
  asyncHandler(createBlog),
);

export default router;
