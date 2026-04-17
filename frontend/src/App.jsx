import Navbar from "./components/Navbar";
import Hero1 from "./components/hero1.jsx";
import Product from "./components/product.jsx";
import TopProduct from "./components/topproduct.jsx";
import Banner from "./components/Banner.jsx";
import Subscrib from "./components/Subscrib.jsx";
import Testmonial from "./components/Testmonial.jsx";
import Footern from "./components/Footern.jsx";
import { Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Electronic from "./components/Electonic.jsx";
import Cart from "./pages/Cart";

import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

import MainLayout from "./layouts/MainLayout..jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProduct from "./components/admin/AddProduct.jsx";
import ProductList from "./components/admin/ProductList.jsx";
import EditProduct from "./components/admin/EditProduct.jsx";
import ManageOrders from "./components/admin/ManageOrders.jsx";
import AdminDashboard from "./components/admin/AdminAnalytics.jsx";
import OrderDetail from "./components/admin/AdminOrderDetails.jsx";
import OrderStatus from "./pages/OrderDetail.jsx";
import Orders from "./pages/Orders.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CategoryUpadat from "./components/admin/CategoryUpdate.jsx";
import SearchPage from "./components/SearchPage.jsx";
import VerifyOtp from "./pages/Verifyotp.jsx";
import ManageCoupons from "./components/admin/ManageCoupons.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* user layout */}

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <>
                <Hero1 />
                <Product />
                <TopProduct />
                <Banner />
                <Subscrib />
                <Testmonial />
              </>
            }
          />
          <Route path="/category/:name" element={<CategoryPage />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-status/:id" element={<OrderStatus />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<AboutUs />} />

        {/* ADMIN LAYOUT */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="addProduct" element={<AddProduct />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/edit/:id" element={<EditProduct />} />
            <Route path="order" element={<ManageOrders />} />
            <Route path="order/:id" element={<OrderDetail />} />
            <Route path="analitics" element={<AdminDashboard />} />
            <Route path="OrderStatus" element={<OrderStatus />} />
            <Route path="manageCategory" element={<CategoryUpadat />} />
            <Route path="coupons" element={<ManageCoupons />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
