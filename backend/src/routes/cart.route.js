import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", verifyJWT, getCart);
router.post("/add", verifyJWT, addToCart);
router.post("/update", verifyJWT, updateQuantity);
router.post("/remove", verifyJWT, removeItem);

export default router;
