import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductbyId,
  getProductBySlug,
  getProductsByCategoryId,
  getProductsBySubCategoryId,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import { normalizeProduct } from "../middleware/normalizeProduct.js";

const router = Router();

router.post(
  "/admin",
  verifyUser,
  verifyAdmin,
  upload.array("images"),
  normalizeProduct,
  validate(createProductSchema),
  asyncHandler(createProduct),
);
router.put(
  "/admin/:id",
  verifyUser,
  verifyAdmin,
  upload.array("images"),
  normalizeProduct,
  validate(updateProductSchema),
  asyncHandler(updateProduct),
);
router.delete(
  "/admin/:id",
  verifyUser,
  verifyAdmin,
  asyncHandler(deleteProduct),
);

router.get("/", asyncHandler(getAllProducts));
router.get("/slug/:slug", asyncHandler(getProductBySlug));
router.get("/:id", asyncHandler(getProductbyId));
router.get("/category/:categoryId", asyncHandler(getProductsByCategoryId));
router.get(
  "/subcategory/:subCategoryId",
  asyncHandler(getProductsBySubCategoryId),
);

export default router;
