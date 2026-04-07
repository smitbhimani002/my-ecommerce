import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import OrderTracking from "../components/order/OrderTraking";
import OrderProducts from "../components/order/OrderProducts";
import OrderTimeline from "../components/order/OrderTimeline";
import Swal from "sweetalert2"

export default function OrderDetail() {


  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const handleCancelClick = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      await cancelOrder(); 

      Swal.fire({
        title: "Cancelled!",
        text: "Your order has been cancelled.",
        icon: "success",
      });
    }
  };

  useEffect(() => {
    axios.get(`/api/admin/order/${id}`).then((res) => setOrder(res.data.order));
  }, [id]);
  console.log(`/api/admin/order/${id}`)

  if (!order) return <p>Loading...</p>;

  const cancelOrder = async () => {
  try {await axios.put(` /api/admin/cancel-order/${order._id}`);

   setOrder({ ...order, orderStatus: "Cancelled" });
    
  } catch (error) {
    
console.log(error)  } 
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">Order Details</h1>

      <p className="text-gray-500">Order ID: {order._id}</p>

      <OrderTracking status={order.orderStatus} />

      <OrderProducts items={order.items} />

      <div className="mt-6">
        <h2 className="font-bold">Total Amount</h2>

        <p className="text-xl font-semibold">₹{order.totalAmount}</p>
      </div>

      {order.orderStatus === "Processing" && (
        <button
        onClick ={  handleCancelClick 
                  }          // onClick={()=>{
          //   const conformcancel= window.confirm("are you sure ,tou want to cancel order ?")
          //   if (conformcancel){
          //     cancelOrder()
          //   }
          // }}
          // onClick={cancelOrder}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cancel Order
        </button>
      )}

      <OrderTimeline timeline={order.statusTimeline} />
    </div>
  );
}
