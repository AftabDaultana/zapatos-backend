import Router from "express";
import {
  deactivateUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateCurrentUser,
} from "../controllers/userController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";
import { updateUSerSchema } from "../validators/userValidator.js";

const router = Router();

router.get("/me", verifyUser, asyncHandler(getCurrentUser));
router.put(
  "/",
  verifyUser,
  upload.single("profilePicture"),
  validate(updateUSerSchema),
  asyncHandler(updateCurrentUser),
);

router.get("/admin", verifyUser, verifyAdmin, asyncHandler(getAllUsers));
router.get("/admin/:id", verifyUser, verifyAdmin, asyncHandler(getUserById));
router.delete(
  "/admin/:id",
  verifyUser,
  verifyAdmin,
  asyncHandler(deactivateUser),
);
export default router;
