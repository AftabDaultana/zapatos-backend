import type { Request, Response } from "express";
import mongoose from "mongoose";
import { createOrderService } from "../services/orderService.js";

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.userId ? new mongoose.Types.ObjectId(req.userId) : null;

  const order = await createOrderService({ ...req.body, userId });

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
};
