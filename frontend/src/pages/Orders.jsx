import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setError("Please login to view your orders");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/admin/my-orders",
          {
            withCredentials: true,
          },
        );

        console.log("API Response:", res.data);
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load orders",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isLoggedIn]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin">
            <ShoppingBag className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          </div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            {!isLoggedIn && (
              <button
                onClick={() => navigate("/login")}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No orders state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start shopping to place your first order!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    if (status === "Delivered")
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (status === "Processing")
      return <Clock className="w-5 h-5 text-blue-500" />;
    if (status === "Shipped")
      return <Clock className="w-5 h-5 text-orange-500" />;
    return <AlertCircle className="w-5 h-5 text-gray-500" />;
  };

  const getStatusColor = (status) => {
    if (status === "Delivered")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "Processing")
      return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "Shipped")
      return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <ShoppingBag className="w-5 h-5 text-orange-500 shrink-0" />
                    <p className="text-sm text-gray-600">
                      Order ID:{" "}
                      <span className="font-mono text-gray-900">
                        {order._id?.slice(-8)}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Date
                      </p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Amount
                      </p>
                      <p className="font-semibold text-gray-900">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Items
                      </p>
                      <p className="font-semibold text-gray-900">
                        {order.items?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Status
                      </p>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.orderStatus)}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/order-status/${order._id}`)}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-lg hover:from-orange-600 hover:to-amber-600 font-semibold transition-all whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
