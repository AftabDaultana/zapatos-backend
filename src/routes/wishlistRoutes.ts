import { Router } from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getWishlist,
  toggleWishlist,
} from "../controllers/wishlistController.js";

const router = Router();

router.get("/", verifyUser, asyncHandler(getWishlist));
router.put("/", verifyUser, asyncHandler(toggleWishlist));

export default router;
