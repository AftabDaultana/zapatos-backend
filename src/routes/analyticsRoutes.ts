import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import {
  annualRevenue,
  bestSelingCategories,
  monthlyRevenue,
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
router.get(
  "/annual-revenue",
  verifyUser,
  verifyAdmin,
  asyncHandler(annualRevenue),
);
router.get(
  "/monthly-revenue",
  verifyUser,
  verifyAdmin,
  asyncHandler(monthlyRevenue),
);

export default router;
