import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import {toast} from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount, finalAmount, couponId }
  const [couponError, setCouponError] = useState("");

  // Shipping Address state
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(new Set()); // For quick lookup

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/wishlist", {
        withCredentials: true,
      });
      const products = res.data.wishlist?.products || [];
      setWishlist(products);
      // Create Set of IDs for quick lookup
      setWishlistIds(new Set(products.map((p) => p._id)));
    } catch {
      setWishlist([]);
      setWishlistIds(new Set());
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/cart", {
        withCredentials: true,
      });
      setCartItems(res.data.items || []);
    } catch {
      setCartItems([]);
    }
  };


  const addToCart = async (product) => {
    try {
      await axios.post(
        "http://localhost:3000/api/cart/add",
        {
          
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: product.size,
          color:product.color,
        },
        { withCredentials: true },
      );

    
      fetchCart(); 
    } catch (error) {
      toast.error("Failed to add product");
      console.log(error);
    }
  };

  const increaseQty = async (id, size,color) => {
    await axios.post(
      "http://localhost:3000/api/cart/update",
      { productId: id, size,color, action: "inc" },
      { withCredentials: true },
    );
    toast.success("Product increased in cart ");
    fetchCart();
    
    if (appliedCoupon) {
      clearCoupon();
    }
  };

  const decreaseQty = async (id,size,color) => {
    await axios.post(
      "http://localhost:3000/api/cart/update",
      { productId: id, size,color, action: "dec" },
      { withCredentials: true },
    );
    toast.success("Product decreased in cart ");
    fetchCart();
    if (appliedCoupon) {
      clearCoupon();
    }
  };

  const removeItem = async (id,size,color) => {
    await axios.post(
      "http://localhost:3000/api/cart/remove",
      { productId: id,size ,color},
      { withCredentials: true },
    );
    toast.success("Product removed from cart ");
    fetchCart();
    if (appliedCoupon) {
      clearCoupon();
    }
  };

  // WISHLIST FUNCTIONS
  const addToWishlist = async (productId) => {
    if (!productId) return;
    setWishlistLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/wishlist/add",
        { productId },
        { withCredentials: true }
      );
      // Update local state optimistically
      const products = res.data.wishlist?.products || [];
      setWishlist(products);
      setWishlistIds(new Set(products.map((p) => p._id)));
      toast.success("Added to Wishlist ");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) return;
    setWishlistLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/wishlist/remove",
        { productId },
        { withCredentials: true }
      );
      // Update local state
      const products = res.data.wishlist?.products || [];
      setWishlist(products);
      setWishlistIds(new Set(products.map((p) => p._id)));
      toast.success("Removed from Wishlist");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove from wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (wishlistIds.has(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlistIds.has(productId);
  };

  //COUPON FUNCTIONS 
  const applyCoupon = async (code) => {
    if (!code || code.trim() === "") {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Only one coupon at a time — clear old one before applying new
    if (appliedCoupon && appliedCoupon.code === code.trim().toUpperCase()) {
      setCouponError("This coupon is already applied");
      return;
    }

    if (appliedCoupon) {
      setAppliedCoupon(null);
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/coupons/apply",
        { code: code.trim(), orderTotal: totalAmount },
        { withCredentials: true }
      );

      setAppliedCoupon({
        code: res.data.couponCode,
        discount: res.data.discount,
        finalAmount: res.data.finalAmount,
        couponId: res.data.couponId,
      });3
      setCouponError("");
      toast.success(`Coupon "${res.data.couponCode}" applied! You save ₹${res.data.discount}`);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to apply coupon";
      setCouponError(msg);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // ==================== CHECKOUT ====================
  const handleFakePayment = async () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/admin/checkout",
          {
            paymentMethod: "Card",
            couponCode: appliedCoupon?.code || null,
            shippingAddress: shippingAddress,
          },
          { withCredentials: true },
        );

        if (res.data.order?.couponDiscount > 0) {
          toast.success(`Payment Successful 🎉 You saved ₹${res.data.order.couponDiscount}!`);
        } else {
          toast.success("Payment Successful 🎉");
        }

        clearCoupon();
        setShippingAddress({
          name: "",
          phone: "",
          address: "",
          city: "",
          pincode: "",
        });
        window.location.reload();
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Payment Failed");
        }
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
      fetchWishlist();
    } else {
      setCartItems([]);
      setWishlist([]);
      setWishlistIds(new Set());
    }
  }, [isLoggedIn]);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const finalAmount = appliedCoupon
    ? Math.round((totalAmount - appliedCoupon.discount) * 100) / 100
    : totalAmount;

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        totalAmount,
        finalAmount,
        cartCount,
        handleFakePayment,
        loading,
        // Coupon
        couponCode,
        setCouponCode,
        couponLoading,
        appliedCoupon,
        couponError,
        applyCoupon,
        clearCoupon,
        // Shipping Address
        shippingAddress,
        setShippingAddress,
        // Wishlist
        wishlist,
        wishlistLoading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isProductInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};;

export const useCart = () => useContext(CartContext);
