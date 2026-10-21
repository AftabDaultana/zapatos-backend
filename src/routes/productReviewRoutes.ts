import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createProductReviewSchema } from "../validators/productReviewValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createProductReview,
  getAllProductReviews,
  getUserProductReviews,
} from "../controllers/productReviewController.js";

const router = Router();

router.post(
  "/:productId",
  verifyUser,
  validate(createProductReviewSchema),
  asyncHandler(createProductReview),
);
router.get("/user", verifyUser, asyncHandler(getUserProductReviews));
router.get(
  "/admin",
  verifyUser,
  verifyAdmin,
  asyncHandler(getAllProductReviews),
);

export default router;
