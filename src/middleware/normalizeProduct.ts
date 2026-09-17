import { Request, Response, NextFunction } from "express";

export const normalizeProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body = req.body || {};

  if (req.body.subCategoryId) {
    req.body.subCategoryId = Array.isArray(req.body.subCategoryId)
      ? req.body.subCategoryId
      : [req.body.subCategoryId];
  }

  if (typeof req.body.specifications === "string") {
    try {
      req.body.specifications = JSON.parse(req.body.specifications);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid specifications JSON format.",
      });
    }
  }

  next();
};
