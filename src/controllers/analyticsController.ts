import type { Request, Response } from "express";
import {
  bestSellingCategoriesService,
  orderSummaryService,
  salesService,
  weeklyOrdersService,
} from "../services/analyticsService.js";

export const sales = async (req: Request, res: Response) => {
  const result = await salesService();

  return res.status(200).json({
    success: true,
    message: "Sales summary retrieved successfully.",
    data: result,
  });
};

export const orders = async (req: Request, res: Response) => {
  const result = await orderSummaryService();

  return res.status(200).json({
    success: true,
    message: "Orders summary retrieved successfully",
    data: result,
  });
};

export const weeklyOrders = async (req: Request, res: Response) => {
  const result = await weeklyOrdersService();

  return res.status(200).json({
    success: true,
    message: "Weekly orders summary retrieved successfully",
    data: result,
  });
};

export const bestSelingCategories = async (req: Request, res: Response) => {
  const result = await bestSellingCategoriesService();

  return res.status(200).json({
    success: true,
    message: "Best selling categories percentage calculated successfully",
    data: result,
  });
};
