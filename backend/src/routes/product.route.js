import express from "express";
import {
  getProductByCategory,
  searchProducts,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/category/:name", getProductByCategory);
router.get("/search", searchProducts);

export default router;
