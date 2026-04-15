import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fatchOrder = async () => {
      try {
        const res = await axios.get(
          `process.env.BASE_URL/api/admin/order/${id}`,
          {
            withCredentials: true,
          },
        );
        setOrder(res.data.order);
      } catch (error) {
        console.log(error);
      }
    };

    fatchOrder();
  }, [id]);

  if (!order) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      {/* Order Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p className="mb-2">
          <b>Customer Email:</b> {order.user?.email}
        </p>
        <p className="mb-2">
          <b>Customer name:</b> {order.user?.username}
        </p>

        <p className="mb-2">
          <b>Payment Method:</b> {order.paymentMethod}
        </p>

        <p className="mb-2">
          <b>Payment Status:</b> {order.paymentStatus}
        </p>

        <p className="mb-2">
          <b>Order Status:</b> {order.orderStatus}
        </p>

        <p className="mb-2">
          <b>Total Amount:</b> ${order.totalAmount}
        </p>
      </div>

      {/* Products */}
      <h2 className="text-xl font-semibold mb-4">Ordered Products</h2>

      <div className="bg-white shadow rounded-lg">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />

              <div>
                <p className="font-medium">{item.name}</p>

                <p className="text-sm text-gray-500">
                  Size: {item.size} | Color: {item.color}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p>
                {item.quantity} × ${item.price} = {item.quantity * item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
