import express from "express";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";
import {
  cancelOrder,
  deleteProduct,
  getAllOrders,
  getDashboardAnalytics,
  getDashboardStats,
  Getproduct,
  getSingleOrder,
  getSingleProduct,
  paymentcheckout,
  updateOrderStatus,
  updateProduct,
} from "../controllers/admin.controller.js";
import { uplode } from "../middleware/upload.middleware.js";
import { addProduct } from "../controllers/admin.controller.js";
import { getMyOrders } from "../controllers/admin.controller.js";
import {
  addCategory,
  deleteCategory,
  getcategories,
  getCategoryChart,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post(
  "/add-product",
  verifyJWT,
  isAdmin,
  uplode.single("image"),
  addProduct,
);
router.get("/getproducts", Getproduct);
router.get("/product/:id", getSingleProduct);
router.delete("/product/:id", verifyJWT, isAdmin, deleteProduct);
router.put(
  "/product/:id",
  verifyJWT,
  isAdmin,
  uplode.single("image"),
  updateProduct,
);

router.post("/checkout", verifyJWT, paymentcheckout);
router.get("/orders", verifyJWT, getAllOrders);
router.put("/orders/:id", verifyJWT, updateOrderStatus);
router.get("/order/:id", verifyJWT, getSingleOrder);
router.put("/cancel-order/:id", verifyJWT, cancelOrder);

router.get("/dashboard", getDashboardAnalytics);
// user orders
router.get("/my-orders", verifyJWT, getMyOrders);

// category
router.post("/category", verifyJWT, isAdmin, addCategory);
router.get("/categories", getcategories);
router.delete("/category/:id", verifyJWT, isAdmin, deleteCategory);
router.put("/category/:id", verifyJWT, isAdmin, updateCategory);
router.get("/category-chart", getCategoryChart);
export default router;
