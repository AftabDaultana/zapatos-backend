import { Router } from "express";
import { optionalVerifyUser } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../validators/orderValidator.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createOrder } from "../controllers/orderController.js";

const router = Router();

router.post(
  "/",
  optionalVerifyUser,
  validate(createOrderSchema),
  asyncHandler(createOrder),
);

export default router;
