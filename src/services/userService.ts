import User from "../models/user.js";
import AppError from "../utils/AppError.js";

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

export const getAllUsersService = async () => {
  const users = await User.find().select(
    "-password -createdAt -updatedAt -__v",
  );

  return users;
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

export const deleteUserService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Admin user cannot be deleted", 403);
  }

  await User.deleteOne({ _id: user._id });

  return user;
};
