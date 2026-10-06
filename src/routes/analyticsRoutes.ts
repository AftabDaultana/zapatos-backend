import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import {
  bestSelingCategories,
  orders,
  sales,
  weeklyOrders,
} from "../controllers/analyticsController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/sales-summary", verifyUser, verifyAdmin, asyncHandler(sales));
router.get("/order-summary", verifyUser, verifyAdmin, asyncHandler(orders));
router.get(
  "/weekly-orders",
  verifyUser,
  verifyAdmin,
  asyncHandler(weeklyOrders),
);
router.get(
  "/best-selling-categories",
  verifyUser,
  verifyAdmin,
  asyncHandler(bestSelingCategories),
);

export default router;
