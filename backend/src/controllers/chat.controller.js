import Groq from "groq-sdk";
import asyncHandler from "../utils/asyncHandler.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/api.err.js";
import dotenv from "dotenv";
dotenv.config();

export const chatWithAI = asyncHandler(async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    throw new ApiError(500, "GROQ_API_KEY is not configured");
  }

  const { message } = req.body;

  if (!message) {
    throw new ApiError(400, "Message is required");
  }

  const priceMatch = message.match(/\d+/);
  const maxPrice = priceMatch ? parseInt(priceMatch[0]) : 5000;

  let category = "";
  if (message.toLowerCase().includes("shirt")) category = "Mens Wear";
  if (message.toLowerCase().includes("kids")) category = "Kids Wear";
  if (message.toLowerCase().includes("electronic")) category = "Electronics";

  const products = await Product.find({
    ...(category && { category }),
    price: { $lte: maxPrice },
  }).limit(5);

  const prompt = `
User query: ${message}

Available products:
${products.map((p) => `${p.name} - ₹${p.price}`).join("\n")}

Suggest best products in friendly way.
`;

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    const reply = completion.choices[0].message.content;

    res.json({
      reply,
      products,
    });
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new ApiError(500, `AI Service Error: ${error.message}`);
  }
});
