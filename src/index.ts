import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

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
