import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/admin/my-orders", {
          withCredentials: true,
        });

        // set orders from API
        setOrders(res.data.orders || []);
        
console.log(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  
 

  // if no orders
  if (orders.length === 0) {
    return <p className="text-center mt-10">loading....</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 rounded mb-4 flex justify-between items-center"
        >
          <div>
            {/* Order ID */}
            <p className="font-semibold">Order ID: {order._id}</p>

            {/* Order Status */}
            <p className="text-gray-500">Status: {order.orderStatus}</p>

            {/* Total Amount */}
            <p className="text-gray-700">Total: ₹{order.totalAmount}</p>
          </div>

          {/* Open Order Detail Page */}
          <button
            onClick={() => navigate(`/order-status/${order._id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}
