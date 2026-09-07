import type { Response, Request } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import {
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} from "../services/userService.js";
import { uploadImageToCloudinary } from "../services/cloudinaryService.js";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await getAllUsersService();

  return res.status(200).json({
    success: true,
    message: "Users found",
    data: users,
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await getUserByIdService(req.userId!);

  return res.status(200).json({
    success: true,
    message: "User found successfully",
    data: user,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getUserByIdService(id as string);

  return res.status(200).json({
    success: true,
    message: "User found successfully",
    data: user,
  });
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { name, email, phoneNumber } = req.body;

  let profilePicture: string | undefined;

  if (req.file) {
    const result = await uploadImageToCloudinary(
      req.file.buffer,
      "zapatos/profile-pictures",
    );

    profilePicture = result.secure_url;
  }

  const user = await updateUserService(
    userId!,
    profilePicture,
    name,
    email,
    phoneNumber,
  );

  return res.status(200).json({
    success: true,
    message: "User data updated successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
    },
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteUserService(id as string);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};
