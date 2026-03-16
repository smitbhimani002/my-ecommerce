import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  registerUser,
  loginUser,
  LogoutUser,
  getCurrentUser,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, LogoutUser);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
