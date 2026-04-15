import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const res = await axios.get("process.env.BASE_URL/api/admin/orders", {
      withCredentials: true,
    });

    setOrders(res.data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(
      `process.env.BASE_URL/api/admin/orders/${id}`,
      { status },
      { withCredentials: true },
    );

    fetchOrders();
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

      <div className="mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Orders</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Products</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update</th>
              <th className="p-3">viwe details</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">{order.user?.email}</td>

                <td className="p-3">
                  {order.items.map((item) => (
                    <div key={item.productId}>
                      {item.name} ({item.size}/{item.color}) x{item.quantity}
                    </div>
                  ))}
                </td>

                <td className="p-3 font-semibold">${order.totalAmount}</td>

                <td className="p-3">{order.paymentMethod}</td>

                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-200 rounded">
                    {order.orderStatus}
                  </span>
                </td>

                <td className="p-3">
                  <select
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    defaultValue={order.orderStatus}
                    className="border p-1 rounded"
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => navigate(`/admin/order/${order._id}`)}>
                    VIEW DETAIL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
