import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";

import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";

import "./services/emailService.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subcategories", subCategoryRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();

    app.listen(port, () => {
      console.log(`Zapatos API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
