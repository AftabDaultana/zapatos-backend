import type { Profile } from "passport-google-oauth20";

import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import { uploadRemoteImageToCloudinary } from "./cloudinaryService.js";

const getGoogleProfilePicture = async (imageUrl?: string) => {
  if (!imageUrl) {
    return undefined;
  }

  try {
    const uploadedImage = await uploadRemoteImageToCloudinary(
      imageUrl,
      "profile-pictures",
    );

    return uploadedImage.secure_url;
  } catch (error) {
    console.error("Google profile picture upload failed:", error);

    return imageUrl;
  }
};

export const googleAuthService = async (profile: Profile) => {
  const email = profile.emails?.[0]?.value?.toLowerCase().trim();
  const isEmailVerified = profile.emails?.[0]?.verified;

  if (!email || !isEmailVerified) {
    throw new AppError("Google email could not be verified.", 401);
  }

  const googleProfilePicture = profile.photos?.[0]?.value;

  let user = await User.findOne({ googleId: profile.id });

  if (user) {
    if (user.status !== "active") {
      throw new AppError(
        "Your account is disabled. Please contact support.",
        403,
      );
    }

    if (
      googleProfilePicture &&
      (!user.profilePicture ||
        user.profilePicture.includes("googleusercontent.com"))
    ) {
      user.profilePicture =
        (await getGoogleProfilePicture(googleProfilePicture)) ??
        user.profilePicture;

      await user.save();
    }

    return user;
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(
      "An account with this email already exists. Please log in using your password first.",
      409,
    );
  }

  const profilePicture = await getGoogleProfilePicture(googleProfilePicture);

  user = await User.create({
    name: profile.displayName,
    email,
    googleId: profile.id,
    profilePicture,
  });

  return user;
};
