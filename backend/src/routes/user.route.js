import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {getProductByCategory, verifyOtp} from "../controllers/user.controller.js"
import {
  registerUser,
  loginUser,
  LogoutUser,
  getCurrentUser,
  updateProfile,
  removeProfilePic,
} from "../controllers/user.controller.js";
import { uplode } from "../middleware/upload.middleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/logout", verifyJWT, LogoutUser);
router.get("/me", verifyJWT, getCurrentUser);
router.put("/update-profile", verifyJWT, uplode.single("profilePic"), updateProfile);
router.delete("/remove-profile-pic", verifyJWT, removeProfilePic);


export default router;
