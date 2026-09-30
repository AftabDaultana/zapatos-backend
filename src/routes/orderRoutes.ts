import { Router } from "express";
import {
  optionalVerifyUser,
  verifyAdmin,
  verifyUser,
} from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../validators/orderValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getOrderById,
} from "../controllers/orderController.js";

const router = Router();

router.post(
  "/",
  optionalVerifyUser,
  validate(createOrderSchema),
  asyncHandler(createOrder),
);
router.get("/user", verifyUser, asyncHandler(getCurrentUserOrders));
router.get("/admin", verifyUser, verifyAdmin, asyncHandler(getAllOrders));
router.get("/:id", verifyUser, asyncHandler(getOrderById));

export default router;
