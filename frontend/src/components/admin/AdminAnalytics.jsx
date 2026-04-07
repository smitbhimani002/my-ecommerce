import { useEffect, useState } from "react";
import axios from "axios";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  
} from "recharts";



export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3000/api/admin/dashboard", {
        withCredentials: true,
      });

      setData(res.data);
    }

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  const stats = data.stats;

  // Weekly Sales Format
  const weeklySales = data.weeklySales.map((item) => ({
  date : `${item._id.day}/${item._id.month}`,
    revenue: item.revenue,
    
  }));

  // Top Products Format
  const topProducts = data.topProducts.map((item) => ({
    name: item._id,
    sold: item.sold,
  }));



  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-3xl font-bold text-black">
              {stats.totalUsers}
            </h2>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-bold text-black">
              {stats.totalOrders}
            </h2>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <p className="text-gray-500">Total Products</p>
            <h2 className="text-3xl font-bold text-black">
              {stats.totalProducts}
            </h2>
          </div>

          {/* <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <p className="text-gray-500">Total Revenue</p>
            <h2 className="text-3xl font-bold text-orange-500">
              ${stats.totalRevenue}
            </h2>
          </div> */}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-5 mt-6">
        <h2 className="text-lg font-bold mb-4">Sales Summary</h2>

        <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold mb-6">Sales Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
              <p className="text-gray-500 text-sm">Today</p>
              <h3 className="text-2xl font-bold text-black">
                ${stats.dailySales}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
              <p className="text-gray-500 text-sm">This Month</p>
              <h3 className="text-2xl font-bold text-black">
                ${stats.monthlySales}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
              <p className="text-gray-500 text-sm">This Year</p>
              <h3 className="text-2xl font-bold text-black">
                ${stats.yearlySales}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-black">
                ${stats.monthlySales}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2">Sales daily Overview</h2>

        <LineChart width={800} height={300} data={weeklySales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" />
        </LineChart>
      </div>

      {/* top selling product */}

      <h2 className="mt-8 text-xl font-bold">Top Selling Products</h2>
      {data.topProducts.map((p, i) => (
        <div
          key={i}
          className="flex justify-between items-center border-b py-3"
        >
          <div>
            <p className="font-semibold">{p._id.name}</p>
           
          </div>

          <span className="font-bold text-black">{p.sold} sold</span>
        </div>
      ))}

      {/* recent order */}
      <h2 className="mt-10 text-xl font-bold">Recent Orders</h2>

      <div className="grid grid-cols-5 font-semibold border-b py-2">
        <span>Customer</span>
        <span>Product</span>
        <span>Qty</span>
        <span>Amount</span>
        <span>Time</span>
      </div>

      {data.recentOrders.map((order) => (
        <div key={order._id} className="grid grid-cols-5 border-b py-2">
          <span>{order.user?.username}</span>
          <span>{order.items[0]?.name}</span>
          <span>{order.items[0]?.quantity}</span>
          <span>${order.totalAmount}</span>
          <span>{order.timeAgo}</span>
        </div>
      ))}
    </div>
  );
}
