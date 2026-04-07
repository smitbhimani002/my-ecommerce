import asyncHandler from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id, name, price, image, size, color } = req.body;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const productId = id.toString();

  const existingItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.size === size &&
      item.color === color,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({
      productId,
      name,
      price,
      image,
      size,
      color,
      quantity: 1,
    });
  }
  await cart.save();
  console.log("i check color : ", cart);

  res.status(200).json(cart);
});

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  res.status(200).json(cart || { items: [] });
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, size, color, action } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  const item = cart.items.find(
    (i) => i.productId === productId && i.size === size && i.color === color,
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  if (action === "inc") item.quantity += 1;
  if (action === "dec") item.quantity -= 1;

  cart.items = cart.items.filter((i) => i.quantity > 0);

  await cart.save();

  res.status(200).json(cart);
});

export const removeItem = asyncHandler(async (req, res) => {
  const { productId, size, color } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (item) =>
      !(
        item.productId === productId &&
        item.size === size &&
        item.color === color
      ),
  );

  await cart.save();

  res.status(200).json(cart);
});
