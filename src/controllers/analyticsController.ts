import type { Request, Response } from "express";
import {
  annualRevenueService,
  bestSellingCategoriesService,
  monthlyRevenueService,
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

export const annualRevenue = async (req: Request, res: Response) => {
  const result = await annualRevenueService();
  return res.status(200).json({
    success: true,
    message: "Annual revenue data fetched successfullty.",
    data: result,
  });
};

export const monthlyRevenue = async (req: Request, res: Response) => {
  const year = Number(req.query.year) || new Date().getFullYear();
  const result = await monthlyRevenueService(year);

  return res.status(200).json({
    success: true,
    message: "Monthly revenue data fetched successfully",
    data: result,
  });
};
