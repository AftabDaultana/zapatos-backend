import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { createSubCategorySchema } from "../validators/subCategoryValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { createSubCategory } from "../controllers/subCategoryController.js";

const router = Router();

router.post(
  "/admin",
  verifyUser,
  verifyAdmin,
  upload.single("image"),
  validate(createSubCategorySchema),
  asyncHandler(createSubCategory),
);

export default router;
