import { Category } from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api.err.js";
import { Product } from "../models/Product.model.js";

// add category

export const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "category name require ");
  }
  const exists = await Category.findOne({ name });
  if (exists) {
    throw new ApiError(400, "category already exists ");
  }
  const category = await Category.create({ name });
  res.status(201).json({
    success: true,
    message: "category add successfull",
    category: category,
  });
});

export const getcategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    categories,
  });
});

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoryChart = async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
        },
      },
    ]);

    const formatted = data.map((item) => ({
      name: item._id,
      count: item.totalProducts,
    }));

    const total = formatted.reduce((acc, item) => acc + item.count, 0);

    res.json({
      success: true,
      categories: formatted,
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
