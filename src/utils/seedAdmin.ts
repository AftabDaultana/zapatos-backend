import bcrypt from "bcrypt";
import User from "../models/user.js";
import AppError from "./AppError.js";

export const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const name = process.env.ADMIN_NAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new AppError("Admin email is not provided", 400);
  }

  if (!name) {
    throw new AppError("Admin name is not provided", 400);
  }

  if (!password) {
    throw new AppError("Admin password is not provided", 400);
  }

  const adminUser = await User.findOne({ email });

  if (adminUser) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin user created");
};
