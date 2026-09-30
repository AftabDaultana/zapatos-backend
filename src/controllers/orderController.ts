import type { Request, Response } from "express";
import mongoose from "mongoose";
import {
  createOrderService,
  getAllOrdersService,
  getCurentUserOrdersService,
  getOrderByIdService,
} from "../services/orderService.js";

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.userId ? new mongoose.Types.ObjectId(req.userId) : null;

  const order = await createOrderService({ ...req.body, userId });

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  const order = await getOrderByIdService(
    id as string,
    new mongoose.Types.ObjectId(userId),
  );

  return res.status(200).json({
    success: true,
    message: "Order found succesfully",
    data: order,
  });
};

export const getCurrentUserOrders = async (req: Request, res: Response) => {
  const userId = req.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const orders = await getCurentUserOrdersService(
    new mongoose.Types.ObjectId(userId),
    page,
    limit,
  );

  return res.status(200).json({
    success: true,
    message: "Orders found.",
    data: orders,
  });
};

export const getAllOrders = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const search =
    typeof req.query.search === "string" ? req.query.search : undefined;

  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;

  const orders = await getAllOrdersService(page, limit, search, status);

  return res.status(200).json({
    success: true,
    message: "Orders found.",
    data: orders,
  });
};
