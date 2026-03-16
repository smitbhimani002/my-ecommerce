import express from "express";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";
import { cancelOrder, deleteProduct, getAllOrders, getDashboardAnalytics, getDashboardStats, Getproduct, getSingleOrder, paymentcheckout, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js";
import { uplode } from "../middleware/upload.middleware.js";
import { addProduct } from "../controllers/admin.controller.js";

const router = express.Router();


router.post(
  "/add-product",
  verifyJWT,
  isAdmin,
  uplode.single("image"),
  addProduct,
);
router.get("/getproducts",  Getproduct);
router.delete("/product/:id", verifyJWT, isAdmin, deleteProduct);
router.put("/product/:id", verifyJWT, isAdmin, uplode.single("image"),updateProduct);

router.post("/checkout", verifyJWT, paymentcheckout);
router.get("/orders", verifyJWT, getAllOrders);
router.put("/orders/:id", verifyJWT, updateOrderStatus);
router.get("/order/:id", verifyJWT, getSingleOrder);
router.put("cancle-order/:id", cancelOrder);

router.get("/dashboard", getDashboardAnalytics);



export default router;
