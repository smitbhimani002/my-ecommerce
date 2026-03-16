import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import UserRouter from "./routes/user.route.js";
import CartRouter from "./routes/cart.route.js";
import AdminRouter from "./routes/admin.route.js";

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


// last middleware
app.use(errorHandler);

export default app;
