import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,
  attempts: { type: Number, default: 0 },
});

export const Otp = mongoose.model("Otp", otpSchema);
