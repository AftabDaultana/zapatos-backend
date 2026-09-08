import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import { getPagination } from "../utils/pagination.js";
import { sendEmail } from "./emailService.js";

export const verifyAdminService = async (userId: string) => {
  const user = await User.findById(userId).select("role");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role !== "admin") {
    throw new AppError("Admin access required", 403);
  }

  return user;
};

export const getAllUsersService = async (page: number, limit: number) => {
  const { skip } = getPagination({ page, limit });

  const users = await User.find()
    .select("-password -createdAt -updatedAt -__v")
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments();

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    pagination: {
      page,
      limit,
      totalUsers,
      totalPages,
    },
  };
};

export const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId).select(
    "-password -createdAt -updatedAt -__v",
  );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

export const updateUserService = async (
  userId: string,
  profilePicture?: string,
  name?: string,
  email?: string,
  phoneNumber?: string,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (name !== undefined) {
    user.name = name;
  }

  if (email !== undefined && email !== user.email) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("User with this email already exist", 400);
    }

    user.email = email;
  }

  if (phoneNumber !== undefined) {
    user.phoneNumber = phoneNumber;
  }

  if (profilePicture !== undefined) {
    user.profilePicture = profilePicture;
  }

  await user.save();

  return user;
};

export const deactivateUserService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Admin user cannot be deleted", 403);
  }

  if (user.status === "inactive") {
    throw new AppError("User account is already deactivated.", 400);
  }

  user.status = "inactive";
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Zapatos Account Disabled.",
    text: `Hello ${user.name}, your Zapatos account has been disabled. Please contact support for further assistance.`,
  });

  return user;
};
