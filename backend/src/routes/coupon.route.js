import express from "express";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";
import {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  applyCoupon,
  getAvailableCoupons,
} from "../controllers/coupon.controller.js";

const router = express.Router();

// User routes (must be before /:id to avoid route conflicts)
router.get("/user/available", verifyJWT, getAvailableCoupons);
router.post("/apply", verifyJWT, applyCoupon);

// Admin routes
router.post("/", verifyJWT, isAdmin, createCoupon);
router.get("/", verifyJWT, isAdmin, getAllCoupons);
router.get("/:id", verifyJWT, isAdmin, getSingleCoupon);
router.put("/:id", verifyJWT, isAdmin, updateCoupon);
router.delete("/:id", verifyJWT, isAdmin, deleteCoupon);
router.patch("/:id/toggle", verifyJWT, isAdmin, toggleCouponStatus);

export default router;
