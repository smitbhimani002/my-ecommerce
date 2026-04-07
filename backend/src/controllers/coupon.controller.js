import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api.err.js";
import { Coupon } from "../models/coupon.model.js";

//ADMIN: CREATE COUPON
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minimumOrderAmount,
    maximumDiscount,
    usageLimit,
    perUserLimit,
    startDate,
    endDate,
    isActive,
  } = req.body;

  if (!code || !discountType || !discountValue || !startDate || !endDate) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Validate discount value
  if (
    discountType === "percentage" &&
    (discountValue < 1 || discountValue > 100)
  ) {
    throw new ApiError(400, "Percentage discount must be between 1 and 100");
  }

  if (discountType === "fixed" && discountValue < 1) {
    throw new ApiError(400, "Fixed discount must be at least 1");
  }

  // Validate dates
  if (new Date(endDate) <= new Date(startDate)) {
    throw new ApiError(400, "End date must be after start date");
  }

  // Check for duplicate code
  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    throw new ApiError(400, "Coupon code already exists");
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    description,
    discountType,
    discountValue,
    minimumOrderAmount: minimumOrderAmount || 0,
    maximumDiscount: maximumDiscount || null,
    usageLimit: usageLimit || null,
    perUserLimit: perUserLimit || 1,
    startDate,
    endDate,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
});

//ADMIN: GET ALL COUPONS
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    coupons,
  });
});

// ADMIN: GET SINGLE COUPON
export const getSingleCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});

// UPDATE COUPON
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  const {
    code,
    description,
    discountType,
    discountValue,
    minimumOrderAmount,
    maximumDiscount,
    usageLimit,
    perUserLimit,
    startDate,
    endDate,
    isActive,
  } = req.body;

  // Validate discount value if changed
  if (
    discountType === "percentage" &&
    discountValue &&
    (discountValue < 1 || discountValue > 100)
  ) {
    throw new ApiError(400, "Percentage discount must be between 1 and 100");
  }

  // Validate dates if changed
  const newStart = startDate || coupon.startDate;
  const newEnd = endDate || coupon.endDate;
  if (new Date(newEnd) <= new Date(newStart)) {
    throw new ApiError(400, "End date must be after start date");
  }

  // Check for duplicate code if code is being changed
  if (code && code.toUpperCase() !== coupon.code) {
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      throw new ApiError(400, "Coupon code already exists");
    }
  }

  coupon.code = code ? code.toUpperCase() : coupon.code;
  coupon.description =
    description !== undefined ? description : coupon.description;
  coupon.discountType = discountType || coupon.discountType;
  coupon.discountValue = discountValue || coupon.discountValue;
  coupon.minimumOrderAmount =
    minimumOrderAmount !== undefined
      ? minimumOrderAmount
      : coupon.minimumOrderAmount;
  coupon.maximumDiscount =
    maximumDiscount !== undefined ? maximumDiscount : coupon.maximumDiscount;
  coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
  coupon.perUserLimit =
    perUserLimit !== undefined ? perUserLimit : coupon.perUserLimit;
  coupon.startDate = startDate || coupon.startDate;
  coupon.endDate = endDate || coupon.endDate;
  coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

  await coupon.save();

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    coupon,
  });
});

//ADMIN: DELETE COUPON
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

//ADMIN: TOGGLE COUPON STATUS
export const toggleCouponStatus = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  res.status(200).json({
    success: true,
    message: `Coupon ${coupon.isActive ? "enabled" : "disabled"} successfully`,
    coupon,
  });
});

//  USER: GET AVAILABLE COUPONS
export const getAvailableCoupons = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  // Find all active coupons
  const coupons = await Coupon.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ createdAt: -1 });

  // check limit

  const availableCoupons = coupons
    .filter((c) => c.usageLimit === null || c.usedCount < c.usageLimit)
    .map((coupon) => {
      const userUsage = coupon.usedBy.find(
        (u) => u.user.toString() === userId.toString(),
      );
      const userUsedCount = userUsage ? userUsage.count : 0;
      const isEligible = userUsedCount < coupon.perUserLimit;

      return {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount,
        maximumDiscount: coupon.maximumDiscount,
        endDate: coupon.endDate,
        isEligible,
        reason: !isEligible
          ? "You have already used this coupon the maximum number of times"
          : null,
      };
    });

  res.status(200).json({
    success: true,
    coupons: availableCoupons,
  });
});

//USER: VALIDATE / APPLY COUPON
export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;
  const userId = req.user._id;

  if (!code) {
    throw new ApiError(400, "Coupon code is required");
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    throw new ApiError(404, "Invalid coupon code");
  }

  // Check if active
  if (!coupon.isActive) {
    throw new ApiError(400, "This coupon is currently inactive");
  }

  // Check date validity
  const now = new Date();
  if (now < coupon.startDate) {
    throw new ApiError(400, "This coupon is not yet active");
  }
  if (now > coupon.endDate) {
    throw new ApiError(400, "This coupon has expired");
  }

  // Check overall usage limit
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, "This coupon has reached its usage limit");
  }

  // Check per-user limit
  const userUsage = coupon.usedBy.find(
    (u) => u.user.toString() === userId.toString(),
  );
  if (userUsage && userUsage.count >= coupon.perUserLimit) {
    throw new ApiError(
      400,
      "You have already used this coupon the maximum number of times",
    );
  }

  // Check minimum order amount
  if (orderTotal < coupon.minimumOrderAmount) {
    throw new ApiError(
      400,
      `Minimum order amount of ₹${coupon.minimumOrderAmount} required`,
    );
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (orderTotal * coupon.discountValue) / 100;
    // Apply max discount cap
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  // Make sure discount doesn't exceed order total
  if (discount > orderTotal) {
    discount = orderTotal;
  }

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    // discount: Math.round(discount * 100) / 100,
    discount: Math.round(discount),
    couponId: coupon._id,
    couponCode: coupon.code,
    finalAmount: Math.round(orderTotal - discount),
  });
});
