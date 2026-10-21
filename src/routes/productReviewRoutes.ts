import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createProductReviewSchema } from "../validators/productReviewValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createProductReview,
  getAllProductReviews,
  getCurrentUserProductReviews,
  getProductReviews,
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

export default router;
