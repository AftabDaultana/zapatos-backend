import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  addToCartSchema,
  deleteCartItemSchema,
  updateCartSchema,
} from "../validators/cartValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  addToCart,
  deleteCartItem,
  getAllCarts,
  getCartById,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";

const router = Router();

router.post(
  "/",
  verifyUser,
  validate(addToCartSchema),
  asyncHandler(addToCart),
);
router.get("/user", verifyUser, asyncHandler(getUserCart));
router.put(
  "/",
  verifyUser,
  validate(updateCartSchema),
  asyncHandler(updateCart),
);
router.delete(
  "/",
  verifyUser,
  validate(deleteCartItemSchema),
  asyncHandler(deleteCartItem),
);
router.get("/admin/:id", verifyUser, verifyAdmin, asyncHandler(getCartById));
router.get("/admin", verifyUser, verifyAdmin, asyncHandler(getAllCarts));

export default router;
