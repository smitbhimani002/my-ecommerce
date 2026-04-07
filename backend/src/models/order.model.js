import mongoose, { Mongoose } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        image: String,
        size: String,
        color: String,
        quantity: Number,
      },
    ],

    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },

    couponCode: {
      type: String,
      default: null,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Card", "UPI", "COD"],
      default: "Card",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Paid",
    },

    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    statusTimeline: [
      {
        status: String,
        date: Date,
      },
    ],
  },

  { timestamps: true },
);
export const Order = mongoose.model("Order", orderSchema);
