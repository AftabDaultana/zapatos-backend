import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createProductReviewSchema } from "../validators/productReviewValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createProductReview,
  deleteProductReview,
  getAllProductReviews,
  getCurrentUserProductReviews,
  getProductReviews,
  updateProductReview,
  updateProductReviewStatus,
} from "../controllers/productReviewController.js";

const router = Router();

router.post(
  "/:productId",
  verifyUser,
  validate(createProductReviewSchema),
  asyncHandler(createProductReview),
);
router.get("/user", verifyUser, asyncHandler(getCurrentUserProductReviews));
router.put("/user/:id", verifyUser, asyncHandler(updateProductReview));
router.get(
  "/admin",
  verifyUser,
  verifyAdmin,
  asyncHandler(getAllProductReviews),
);
router.get("/:productId", asyncHandler(getProductReviews));
router.patch(
  "/status/:id",
  verifyUser,
  verifyAdmin,
  asyncHandler(updateProductReviewStatus),
);
router.delete("/:id", verifyUser, asyncHandler(deleteProductReview));

export default router;
