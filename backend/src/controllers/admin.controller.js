import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api.err.js";
import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";

import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";
import { Product } from "../models/Product.model.js";
import { Coupon } from "../models/coupon.model.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import mongoose from "mongoose";
dayjs.extend(relativeTime);

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCarts = await Cart.countDocuments();
  const totalProducts = await Product.countDocuments();

  res.status(202).json({
    success: true,
    stats: {
      totalUsers,
      totalCarts,
      totalProducts,
    },
  });
});

export const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, totalStock } = req.body;

  if (!name || !description || !price || !category) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // ✅ CATEGORY CHECK (case safe)
  const isClothingCategory =
    category.toLowerCase() === "mens wear" ||
    category.toLowerCase() === "kids wear";

  let variants = []; // ✅ default empty
  let finalStock = 0; // ✅ final stock variable

  if (isClothingCategory) {
    // ❗ variants required
    if (!req.body.variants) {
      throw new ApiError(400, "Variants are required for clothing");
    }

    // ✅ parse variants safely
    variants = JSON.parse(req.body.variants);

    // ✅ calculate stock from variants
    finalStock = variants.reduce((sum, item) => sum + Number(item.stock), 0);
  }

  // ================= OTHER CATEGORY =================
  else {
    // ❗ totalStock required
    if (!totalStock) {
      throw new ApiError(400, "Stock is required");
    }

    // ✅ direct stock
    finalStock = Number(totalStock);

    // ✅ no variants
    variants = [];
  }

  if (!req.file) {
    throw new ApiError(400, "Product image is required");
  }

  // const totalStock = variants.reduce(
  //   (sum, item) => sum + Number(item.stock),
  //   0,
  // );

  const uploadFromBuffer = () => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) {
            reject(new ApiError(500, "Cloudinary upload failed"));
          } else {
            resolve(result);
          }
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  const result = await uploadFromBuffer();

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    variants,
    totalStock: finalStock,
    category,
    image: result.secure_url,
  });

  return res.status(201).json({
    success: true,
    message: "Product added successfully",
    product,
  });
});

// export const Getproduct = asyncHandler(async (req, res) => {
//   const products = await Product.find ().select("-createdAt -updatedAt -totalStock");
//   console.log(products);

//   res.status(200).json({
//     success: true,
//     products,
//   });
// });

export const Getproduct = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const { category, search } = req.query;

  let filter = {};

  if (category && category !== "All") {
    filter.category = category;
  }

  if (search && search.trim() !== "") {
    filter.name = { $regex: search, $options: "i" };
  }

  const totalProducts = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .select("-createdAt -updatedAt -totalStock")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    products,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit),
    totalProducts,
  });
});

// delet product
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  let updateData = { ...req.body };

  if (updateData.variants) {
    updateData.variants = JSON.parse(updateData.variants);

    updateData.totalStock = updateData.variants.reduce(
      (sum, item) => sum + Number(item.stock),
      0,
    );
  }

  if (updateData.color) {
    updateData.color = JSON.parse(updateData.color);
  }
  // image
  if (req.file) {
    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) {
              reject(new ApiError(500, "Cloudinary upload failed"));
            } else {
              resolve(result);
            }
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await uploadFromBuffer();

    updateData.image = result.secure_url;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true },
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

export const paymentcheckout = asyncHandler(async (req, res) => {
  const { paymentMethod, couponCode } = req.body;

  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  //  STOCK VALIDATION
  for (const item of cart.items) {
    const product = await Product.findById(
      new mongoose.Types.ObjectId(item.productId),
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const variant = product.variants.find(
      (v) =>
        v.size === item.size &&
        v.color.toLowerCase().trim() === item.color.toLowerCase().trim(),
    );

    if (!variant) {
      throw new ApiError(400, "Product variant not found");
    }

    if (variant.stock < item.quantity) {
      throw new ApiError(
        400,
        `this ${product.name} only ${variant.stock} left in stock`,
      );
    }
  }

  // calculate subtotal
  const subtotal = cart.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // ==================== COUPON VALIDATION ====================
  let discount = 0;
  let appliedCouponCode = null;
  let coupon = null;

  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

    if (!coupon) {
      throw new ApiError(404, "Invalid coupon code");
    }

    if (!coupon.isActive) {
      throw new ApiError(400, "This coupon is currently inactive");
    }

    const now = new Date();
    if (now < coupon.startDate) {
      throw new ApiError(400, "This coupon is not yet active");
    }
    if (now > coupon.endDate) {
      throw new ApiError(400, "This coupon has expired");
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new ApiError(400, "This coupon has reached its usage limit");
    }

    const userUsage = coupon.usedBy.find(
      (u) => u.user.toString() === userId.toString(),
    );
    if (userUsage && userUsage.count >= coupon.perUserLimit) {
      throw new ApiError(
        400,
        "You have already used this coupon the maximum number of times",
      );
    }

    if (subtotal < coupon.minimumOrderAmount) {
      throw new ApiError(
        400,
        `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon`,
      );
    }

    // Calculate discount
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    if (discount > subtotal) {
      discount = subtotal;
    }

    discount = Math.round(discount * 100) / 100;
    appliedCouponCode = coupon.code;
  }

  const totalAmount = Math.round((subtotal - discount) * 100) / 100;

  // create order
  const order = await Order.create({
    user: userId,
    items: cart.items,
    subtotal,
    couponCode: appliedCouponCode,
    couponDiscount: discount,
    totalAmount,
    paymentMethod,
    paymentStatus: "Paid",
    shippingAddress: req.body.shippingAddress,

    statusTimeline: [{ status: "Processing", date: new Date() }],
  });

  console.log("User ID:", userId);
  console.log("Order saved:", order);

  // ==================== UPDATE COUPON USAGE ====================
  if (coupon) {
    coupon.usedCount += 1;

    const existingUser = coupon.usedBy.find(
      (u) => u.user.toString() === userId.toString(),
    );
    if (existingUser) {
      existingUser.count += 1;
    } else {
      coupon.usedBy.push({ user: userId, count: 1 });
    }

    await coupon.save();
  }

  // ==================== UPDATE STOCK ====================
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

    if (!product) continue;

    const variant = product.variants.find(
      (v) => v.size === item.size && v.color === item.color,
    );

    if (variant) {
      variant.stock -= item.quantity;
      product.totalStock = product.variants.reduce(
        (total, v) => total + v.stock,
        0,
      );

      await product.save();
    }
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: "payment successful",
    order: {
      subtotal,
      couponCode: appliedCouponCode,
      couponDiscount: discount,
      totalAmount,
    },
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "email username")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// export const updateOrderStatus = asyncHandler(async (req, res) => {
//   const { status } = req.body;

//   const order = await Order.findByIdAndUpdate(
//     req.params.id,
//     { orderStatus: status },
//     { new: true },
//   );

//   res.status(200).json({
//     success: true,
//     order,
//   });
// });

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  order.orderStatus = status;

  order.statusTimeline.push({
    status,
    date: new Date(),
  });

  await order.save();

  res.status(200).json({
    success: true,
    order,
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus !== "Processing") {
    return res.status(400).json({
      message: "Order cannot be cancelled",
    });
  }

  order.orderStatus = "Cancelled";
  order.statusTimeline.push({
    status: "Cancelled",
    date: new Date(),
  });

  await order.save();

  res.json({
    success: true,
    message: "Order cancelled",
  });
});

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const now = dayjs();

  // ranges

  const startOfDay = now.startOf("day").toDate();
  const startOfMonth = now.startOf("month").toDate();
  const startOfYear = now.startOf("year").toDate();

  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  // dailysale
  const dailySales = await Order.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
        createdAt: { $gte: startOfDay },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  // monthly sales
  const monthlySales = await Order.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
        createdAt: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  // yearly sales
  const yearlySales = await Order.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
        createdAt: { $gte: startOfYear },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  // last 7 days sales chart
  const sevenDaysAgo = now.subtract(6, "day").startOf("day").toDate();

  const weeklySales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        paymentStatus: "Paid",
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id.day": 1 } },
  ]);

  // top selling products
  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          name: "$items.name",
          category: "$items.category",
        },
        sold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 3 },
  ]);

  // total revenue
  const totalRevenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "email username");

  const formattedOrders = recentOrders.map((order) => ({
    ...order.toObject(),
    timeAgo: dayjs(order.createdAt).fromNow(),
  }));

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      dailySales: dailySales[0]?.revenue || 0,
      monthlySales: monthlySales[0]?.revenue || 0,
      yearlySales: yearlySales[0]?.revenue || 0,
    },
    weeklySales,
    topProducts,
    recentOrders: formattedOrders,
  });
});

// to view order in dashboard

export const getSingleOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "email username",
  );

  res.json({
    success: true,
    order,
  });
};

// GET logged in user's orders
export const getMyOrders = asyncHandler(async (req, res) => {
  // find orders of current logged in user
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export const getNumberOfProduct = asyncHandler(async (req, res) => {
  const totalNUmberOfProduct = await Product.findById(categpry);
  totalNUmberOfProduct;
});
