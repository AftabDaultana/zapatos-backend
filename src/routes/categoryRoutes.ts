import Router from "express";
import { validate } from "../middleware/validate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import {
  createCatgorySchema,
  updateCategorySchema,
} from "../validators/categoryValidators.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getAllPaginatedCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", asyncHandler(getAllCategories));

router.post(
  "/admin",
  verifyUser,
  verifyAdmin,
  validate(createCatgorySchema),
  asyncHandler(createCategory),
);
router.get(
  "/admin",
  verifyUser,
  verifyAdmin,
  asyncHandler(getAllPaginatedCategories),
);
router.put(
  "/admin/:id",
  verifyUser,
  verifyAdmin,
  validate(updateCategorySchema),
  asyncHandler(updateCategory),
);
router.delete(
  "/admin/:id",
  verifyUser,
  verifyAdmin,
  asyncHandler(deleteCategory),
);
export default router;
