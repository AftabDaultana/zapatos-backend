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
  getAllProducts,
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

router.get("/", asyncHandler(getAllProducts));

export default router;
