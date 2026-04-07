import mongoose from "mongoose";
const productschema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },

    description: {
      type: String,
      require: true,
    },

    price: {
      type: Number,
      required: true,
    },

    variants: [
      {
        size: {
          type: String,
          enum: ["S", "M", "L", "XL", "XXL", "NA"],
          required: true,
        },

        color: {
          type: String,
          required: true,
        },

        stock: {
          type: Number,
          required: true,
        },
      },
    ],

    totalStock: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      // enum: ["Mens Wear", "Kids Wear", "Electronics", "Beauty", "Top Rated"],
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productschema);
