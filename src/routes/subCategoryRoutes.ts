import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createSubCategorySchema,
  updateSubCategorySchema,
} from "../validators/subCategoryValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategoryId,
  getSubCategoryById,
  updateSubCategory,
} from "../controllers/subCategoryController.js";

const router = Router();

router.post(
  "/admin",
  verifyUser,
  verifyAdmin,
  upload.single("image"),
  validate(createSubCategorySchema),
  asyncHandler(createSubCategory),
);
router.get(
  "/admin",
  verifyUser,
  verifyAdmin,
  asyncHandler(getAllSubCategories),
);
router.put(
  "/admin/:id",
  verifyUser,
  verifyAdmin,
  upload.single("image"),
  validate(updateSubCategorySchema),
  asyncHandler(updateSubCategory),
);
router.delete(
  "/admin/:id",
  verifyUser,
  verifyAdmin,
  asyncHandler(deleteSubCategory),
);
router.get("/category/:categoryId", asyncHandler(getSubCategoriesByCategoryId));
router.get("/:id", asyncHandler(getSubCategoryById));

export default router;
