import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/error.middleware.js";
import UserRouter from "./routes/user.route.js";
import CartRouter from "./routes/cart.route.js";
import AdminRouter from "./routes/admin.route.js";
import ProductRouter from "./routes/product.route.js";
import CouponRouter from "./routes/coupon.route.js";
import WishlistRouter from "./routes/wishlist.route.js";
import chatRoutes from "./routes/chat.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// middlewares

app.use(
  cors({
    origin: [
      "http://localhost:5173", // dev
      "http://localhost:3000", // local testing
      "https://my-ecommerce-51mu.onrender.com", // ✅ Render frontend URL
      "https://my-ecommerce-gbmb.vercel.app", // ✅ Vercel frontend URL
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

// routes

app.use("/api/auth", UserRouter);
app.use("/api/cart", CartRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/products", ProductRouter);
app.use("/api/coupons", CouponRouter);
app.use("/api/wishlist", WishlistRouter);
app.use("/api/chat", chatRoutes);

// ============================================
// SERVE STATIC FILES FROM FRONTEND BUILD
// ============================================
const frontendDistPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDistPath));

// ============================================
// CATCH-ALL ROUTE FOR SPA (MUST BE LAST)
// ============================================
app.get(/^\/(?!api\/).*$/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// last middleware
app.use(errorHandler);

export default app;
