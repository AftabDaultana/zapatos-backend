import { Router } from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { addToCartSchema } from "../validators/cartValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import { addToCart } from "../controllers/cartController.js";

const router = Router();

router.post(
  "/",
  verifyUser,
  validate(addToCartSchema),
  asyncHandler(addToCart),
);

export default router;
