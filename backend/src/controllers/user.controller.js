import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api.err.js";
import { Product } from "../models/Product.model.js";
import bcrypt from "bcryptjs";
import { Otp } from "../models/otp.model.js";
import { sendEmail } from "../utils/sendMail.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }

  // generate otp
  const otp = Math.floor(100000 + Math.random() * 900000);

  // // hase otp
  // const hashedOtp  = await bcrypt.hash(otp.toString(), 10);

  // save otp
  await Otp.findOneAndUpdate(
    { email },
    { otp: otp, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 },
    { upsert: true },
  );

  // Send Email

  //   const isSend= await sendEmail(
  //     email,
  //     "Your Login OTP",
  //     `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes</p>`,
  // );
  const isSend = await sendEmail(email, "Your Login OTP", {
    otp: otp,
  });

  if (!isSend) {
    throw new ApiError(500, "fail to send otp");
  }
  return res.status(200).json({
    success: true,
    message: "otp send to your email",
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  console.log(`recieve email for verifyOtp is : ${email}`);

  const otpData = await Otp.findOne({ email });
  console.log("otpdata for check is :", otpData);
  if (!otpData) {
    throw new ApiError(400, "OTP not found");
  }

  // check expiry
  if (otpData.expiresAt < Date.now()) {
    throw new ApiError(405, "OTP expired");
  }

  // check attempts
  if (otpData.attempts >= 5) {
    throw new ApiError(407, "Too many attempts");
  }

  // const isMatch = await bcrypt.compare(otp.toString(), otpData.otp);

  const isMatch = otp.toString() === otpData.otp;
  if (!isMatch) {
    otpData.attempts += 1;
    await otpData.save();

    throw new ApiError(400, "Invalid OTP");
  }

  const user = await User.findOne({ email });

  const accessToken = user.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  };

  // delete OTP after success

  await Otp.deleteOne({ email });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json({
      success: true,
      message: "Login successful",
      user: {
        role: user.role,
      },
    });
});

export const LogoutUser = asyncHandler(async (req, res) => {
  return res.status(200).clearCookie("accessToken").json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const getProductByCategory = asyncHandler(async (req, res) => {
  const categoryName = decodeURIComponent(req.params.name);

  const { lastId } = req.query;

  let query = {
    category: categoryName,
  };

  if (lastId) {
    query._id = { $lt: lastId };
  }

  const products = await Product.find(query)
    .sort({ _id: -1 })
    .limit(8)
    .select("-createdAt -updatedAt -totalStock");

  res.status(200).json({
    success: true,
    products,
  });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.json({ products: [] });
  }

  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  })
    .limit(10)
    .select("-totalStock -updatedAt -createdAt");

  res.json({
    success: true,
    products,
  });
});
