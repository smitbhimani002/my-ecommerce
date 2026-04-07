import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import UserRouter from "./routes/user.route.js";
import CartRouter from "./routes/cart.route.js";
import AdminRouter from "./routes/admin.route.js";
import ProductRouter from "./routes/product.route.js";
import CouponRouter from "./routes/coupon.route.js";



const app = express();

// middlewares

app.use(
  cors({
    origin: "http://localhost:5173",
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


// last middleware
app.use(errorHandler);

export default app;
