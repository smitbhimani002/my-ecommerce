import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Ticket,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Percent,
  BadgeIndianRupee,
  Clock,
  ChevronDown,
  ChevronUp,
  Zap,
  XCircle,
} from "lucide-react";

const Cart = () => {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
    totalAmount,
    finalAmount,
    handleFakePayment,
    loading,
    // (Coupon)
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
  } = useCart();

  // Available coupons
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponCardErrors, setCouponCardErrors] = useState({});
  const [applyingCouponId, setApplyingCouponId] = useState(null);
  const [addressError, setAddressError] = useState("");

  // Fetch available coupons
  const fetchAvailableCoupons = async () => {
    setCouponsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/coupons/user/available`,
        {
          withCredentials: true,
        },
      );
      setAvailableCoupons(res.data.coupons || []);
    } catch {
      setAvailableCoupons([]);
    } finally {
      setCouponsLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchAvailableCoupons();
    }
  }, [cartItems.length]);

  // Handle click on a coupon card
  const handleCouponCardClick = async (coupon) => {
    // Clear previous card errors
    setCouponCardErrors((prev) => ({ ...prev, [coupon._id]: "" }));

    // check  alredy applied same coupon
    if (appliedCoupon?.code === coupon.code) return;

    // different coupon is already applied
    if (appliedCoupon) {
      clearCoupon();
    }

    // Check eligibility
    if (!coupon.isEligible) {
      setCouponCardErrors((prev) => ({
        ...prev,
        [coupon._id]: coupon.reason || "You are not eligible for this coupon",
      }));
      return;
    }

    //  minimum order amount
    if (totalAmount < coupon.minimumOrderAmount) {
      setCouponCardErrors((prev) => ({
        ...prev,
        [coupon._id]: `Minimum order of ₹${coupon.minimumOrderAmount} required. Your cart is ₹${totalAmount}.`,
      }));
      return;
    }

    // Valid — auto-fill and apply
    setApplyingCouponId(coupon._id);
    setCouponCode(coupon.code);

    try {
      await applyCoupon(coupon.code);
    } finally {
      setApplyingCouponId(null);
    }
  };

  // Format remaining time
  const getTimeLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    if (days > 0) return `${days}d ${hours}h left`;
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours}h ${mins}m left`;
  };

  // Validate address
  const validateAddress = () => {
    if (!shippingAddress.name.trim()) {
      setAddressError("Please enter your name");
      return false;
    }
    if (!shippingAddress.phone.trim()) {
      setAddressError("Please enter your phone number");
      return false;
    }
    if (!/^[0-9]{10}$/.test(shippingAddress.phone.replace(/\D/g, ""))) {
      setAddressError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!shippingAddress.address.trim()) {
      setAddressError("Please enter your address");
      return false;
    }
    if (!shippingAddress.city.trim()) {
      setAddressError("Please enter your city");
      return false;
    }
    if (!shippingAddress.pincode.trim()) {
      setAddressError("Please enter your pincode");
      return false;
    }
    if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) {
      setAddressError("Please enter a valid 6-digit pincode");
      return false;
    }
    setAddressError("");
    return true;
  };

  // Handle address input change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    setAddressError("");
  };

  // Handle payment click with validation
  const handlePaymentClick = () => {
    if (validateAddress()) {
      handleFakePayment();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag className="w-20 h-20 text-gray-300" strokeWidth={1.2} />
        <h2 className="text-2xl font-semibold text-gray-400">
          Your cart is empty
        </h2>
        <p className="text-gray-400 text-sm">
          Add some products to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* cart item  */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 md:gap-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl"
              />

              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-800 text-lg truncate">
                  {item.name}
                </h2>
                <p className="text-indigo-600 font-bold text-lg mt-1">
                  ₹{item.price}
                </p>
                <div className="flex gap-3 mt-1">
                  {item.size && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      Size: {item.size}
                    </span>
                  )}
                  {item.color && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      Color: {item.color}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      decreaseQty(item.productId, item.size, item.color)
                    }
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-gray-800 w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      increaseQty(item.productId, item.size, item.color)
                    }
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="font-bold text-gray-800 text-lg">
                  ₹{item.price * item.quantity}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      removeItem(item.productId, item.size, item.color)
                    }
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/*AVAILABLE COUPONS SECTION*/}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowCoupons(!showCoupons)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Available Coupons
                  </h3>
                  <p className="text-xs text-gray-400">
                    {availableCoupons.length} coupon
                    {availableCoupons.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>
              {showCoupons ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {showCoupons && (
              <div className="border-t border-gray-100 p-4 space-y-3">
                {couponsLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  </div>
                ) : availableCoupons.length === 0 ? (
                  <div className="text-center py-6">
                    <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      No coupons available right now
                    </p>
                  </div>
                ) : (
                  availableCoupons.map((coupon) => {
                    const isApplied = appliedCoupon?.code === coupon.code;
                    const hasError = couponCardErrors[coupon._id];
                    const isApplying = applyingCouponId === coupon._id;
                    const meetsMinOrder =
                      totalAmount >= coupon.minimumOrderAmount;
                    const isClickable =
                      coupon.isEligible && meetsMinOrder && !isApplied;

                    return (
                      <div key={coupon._id}>
                        <div
                          onClick={() =>
                            !isApplied &&
                            !isApplying &&
                            handleCouponCardClick(coupon)
                          }
                          className={`relative rounded-xl border-2 p-4 transition-all duration-200 ${
                            isApplied
                              ? "border-emerald-400 bg-emerald-50/60 shadow-sm"
                              : hasError
                                ? "border-red-200 bg-red-50/30"
                                : isClickable
                                  ? "border-gray-100 bg-white hover:border-indigo-300 hover:shadow-md cursor-pointer"
                                  : "border-gray-100 bg-gray-50/50 opacity-70"
                          }`}
                        >
                          {/* Applied badge */}
                          {isApplied && (
                            <div className="absolute -top-2.5 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Applied
                            </div>
                          )}

                          <div className="flex items-start gap-3">
                            {/* Discount Badge */}
                            <div
                              className={`shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                                isApplied
                                  ? "bg-emerald-500"
                                  : coupon.discountType === "percentage"
                                    ? "bg-linear-to-br from-indigo-500 to-purple-600"
                                    : "bg-linear-to-br from-amber-500 to-orange-600"
                              }`}
                            >
                              <span className="text-white font-bold text-lg leading-none">
                                {coupon.discountType === "percentage"
                                  ? `${coupon.discountValue}%`
                                  : `₹${coupon.discountValue}`}
                              </span>
                              <span className="text-white/80 text-[9px] uppercase tracking-wider mt-0.5">
                                {coupon.discountType === "percentage"
                                  ? "off"
                                  : "flat"}
                              </span>
                            </div>

                            {/* Coupon Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono font-bold text-sm text-gray-800 tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                                  {coupon.code}
                                </span>
                                {isApplying && (
                                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                )}
                              </div>

                              {coupon.description && (
                                <p className="text-sm text-gray-600 mb-1.5 line-clamp-1">
                                  {coupon.description}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                {coupon.minimumOrderAmount > 0 && (
                                  <span
                                    className={`text-[11px] flex items-center gap-1 ${
                                      meetsMinOrder
                                        ? "text-gray-400"
                                        : "text-red-400 font-medium"
                                    }`}
                                  >
                                    <BadgeIndianRupee className="w-3 h-3" />
                                    Min ₹{coupon.minimumOrderAmount}
                                  </span>
                                )}
                                {coupon.maximumDiscount && (
                                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                    <Percent className="w-3 h-3" />
                                    Max save ₹{coupon.maximumDiscount}
                                  </span>
                                )}
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {getTimeLeft(coupon.endDate)}
                                </span>
                              </div>
                            </div>

                            {/*apply button*/}
                            <div className="shrink-0 self-center">
                              {isApplied ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                              ) : isClickable ? (
                                <div className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  Apply
                                </div>
                              ) : (
                                <XCircle className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Error below  coupon card */}
                        {hasError && (
                          <div className="flex items-start gap-1.5 mt-1.5 ml-1 text-red-500 animate-in slide-in-from-top-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <p className="text-xs leading-relaxed">
                              {hasError}
                            </p>
                          </div>
                        )}

                        {/* Not eligible message */}
                        {!coupon.isEligible && !hasError && (
                          <div className="flex items-start gap-1.5 mt-1.5 ml-1 text-gray-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <p className="text-xs leading-relaxed">
                              {coupon.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/*Order Summary*/}
        <div className="lg:w-95 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Order Summary
            </h2>

            {/* Subtotal */}
            <div className="flex justify-between text-gray-600 mb-3">
              <span>
                Subtotal ({cartItems.reduce((c, i) => c + i.quantity, 0)} items)
              </span>
              <span className="font-medium">₹{totalAmount}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-4">
              <span>Shipping</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>

            <hr className="border-gray-100 mb-4" />

            {/*COUPON INPUT SECTION */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-2">
                <Ticket className="w-4 h-4 text-indigo-500" />
                Discount Code
              </label>

              {appliedCoupon ? (
                /* Applied Coupon View*/
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="font-mono font-bold text-emerald-700 text-sm tracking-wider">
                          {appliedCoupon.code}
                        </span>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          You save ₹{appliedCoupon.discount}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearCoupon}
                      className="text-emerald-400 hover:text-red-500 p-1 rounded-md hover:bg-white transition-colors cursor-pointer"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyCoupon(couponCode);
                        }
                      }}
                      className={`flex-1 border px-3 py-2.5 rounded-xl text-sm font-mono tracking-wider uppercase focus:outline-none focus:ring-2 transition-all ${
                        couponError
                          ? "border-red-300 focus:ring-red-200 bg-red-50/50"
                          : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                      }`}
                    />
                    <button
                      onClick={() => applyCoupon(couponCode)}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {couponLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>

                  {/* Error Message */}
                  {couponError && (
                    <div className="flex items-start gap-1.5 mt-2 text-red-500">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed">{couponError}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <hr className="border-gray-100 mb-4" />

            {appliedCoupon && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Cart Total</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-600 text-sm">
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    Coupon Discount
                  </span>
                  <span className="font-medium">
                    - ₹{appliedCoupon.discount}
                  </span>
                </div>
                <hr className="border-dashed border-gray-200" />
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <div className="text-right">
                {appliedCoupon && (
                  <p className="text-sm text-gray-400 line-through mb-0.5">
                    ₹{totalAmount}
                  </p>
                )}
                <p className="text-2xl font-bold text-gray-800">
                  ₹{finalAmount}
                </p>
              </div>
            </div>

            {/* Savings badge */}
            {appliedCoupon && (
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-4 text-center">
                <p className="text-emerald-700 text-sm font-medium">
                  You're saving{" "}
                  <span className="font-bold">₹{appliedCoupon.discount}</span>{" "}
                  on this order!
                </p>
              </div>
            )}

            {/* Shipping Address Section */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                  📍
                </span>
                Delivery Address
              </h3>

              <div className="space-y-3">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="Enter 10-digit phone number"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    placeholder="Enter street address, apartment, etc."
                    rows="3"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    placeholder="Enter city name"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleAddressChange}
                    placeholder="Enter 6-digit pincode"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Address Error */}
                {addressError && (
                  <div className="flex items-start gap-1.5 mt-2 text-red-500 bg-red-50 p-2.5 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed">{addressError}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handlePaymentClick}
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3.5 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>Buy Now — ₹{finalAmount}</>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Secure checkout • Free shipping
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
