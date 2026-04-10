import asyncHandler from "../utils/asyncHandler.js";
import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/api.err.js";

// Add to Wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Find or create wishlist for user
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [productId],
    });
  } else {
    // Use $addToSet to avoid duplicates
    wishlist = await Wishlist.findByIdAndUpdate(
      wishlist._id,
      { $addToSet: { products: productId } },
      { new: true }
    ).populate("products", "name price image category");
  }

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    wishlist: wishlist || (await Wishlist.findOne({ user: userId }).populate("products", "name price image category")),
  });
});

// Get Wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "products",
    "name price image category description"
  );

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      wishlist: {
        products: [],
      },
    });
  }

  res.status(200).json({
    success: true,
    wishlist: wishlist,
  });
});

// Remove from Wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  // Use $pull to remove the product
  const updatedWishlist = await Wishlist.findByIdAndUpdate(
    wishlist._id,
    { $pull: { products: productId } },
    { new: true }
  ).populate("products", "name price image category");

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlist: updatedWishlist,
  });
});

// Check if product is in wishlist
export const isInWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const wishlist = await Wishlist.findOne({
    user: userId,
    products: productId,
  });

  res.status(200).json({
    success: true,
    isInWishlist: !!wishlist,
  });
});

// Clear entire wishlist
export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Wishlist.findOneAndUpdate(
    { user: userId },
    { products: [] },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Wishlist cleared",
  });
});
