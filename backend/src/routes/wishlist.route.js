import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

// Protected routes - all require user authentication
router.post("/add", verifyJWT, addToWishlist);
router.get("/", verifyJWT, getWishlist);
router.post("/remove", verifyJWT, removeFromWishlist);
router.get("/check/:productId", verifyJWT, isInWishlist);
router.delete("/clear", verifyJWT, clearWishlist);

export default router;
