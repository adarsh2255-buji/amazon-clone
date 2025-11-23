import React, { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const MyOrderScreen = () => {
  const { state } = useStore();
  const { userInfo } = state;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   useEffect(() => {
    if (!userInfo) {
       navigate("/login");
       return;
    }
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo, navigate]);
    if (loading) return <div className="p-10 text-center">Loading orders...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
       <h1 className="text-2xl font-normal mb-4">Your Orders</h1>
       <div className="border-b border-gray-300 mb-4">
          <span className="inline-block border-b-2 border-[#e77600] pb-2 font-bold text-sm px-2">Orders</span>
       </div>

       {orders.length === 0 ? (
          <div>You have no orders yet.</div>
       ) : (
          <div className="space-y-4">
             {orders.map(order => (
                <div key={order._id} className="border border-gray-300 rounded-md bg-white">
                   {/* Order Header */}
                   <div className="bg-[#f0f2f2] p-4 text-xs text-gray-600 flex justify-between border-b border-gray-200 rounded-t-md">
                      <div className="flex gap-8">
                         <div>
                            <div className="uppercase mb-1">Order Placed</div>
                            <div className="text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</div>
                         </div>
                         <div>
                            <div className="uppercase mb-1">Total</div>
                            <div className="text-gray-800">₹{order.totalPrice}</div>
                         </div>
                         <div>
                            <div className="uppercase mb-1">Ship To</div>
                            <div className="text-[#007185] cursor-pointer hover:underline hover:text-[#c7511f]">{userInfo.name}</div>
                         </div>
                      </div>
                      <div>
                         <div className="uppercase mb-1">Order # {order._id}</div>
                         <Link to={`/order/${order._id}`} className="text-[#007185] hover:underline hover:text-[#c7511f]">View order details</Link>
                      </div>
                   </div>
                   {/* Order Body */}
                   <div className="p-4">
                      <div className="font-bold text-lg mb-2">
                         {order.isDelivered ? `Delivered ${new Date(order.deliveredAt).toLocaleDateString()}` : "Arriving Thursday"}
                      </div>
                      {order.orderItems.map(item => (
                         <div key={item.product} className="flex items-start py-2">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mr-4" />
                            <div>
                               <Link to={`/product/${item.product}`} className="text-[#007185] font-medium hover:underline hover:text-[#c7511f] line-clamp-2">
                                  {item.name}
                               </Link>
                               <div className="text-xs text-gray-500 mt-1">Return window closed</div>
                               <button className="mt-2 bg-[#ffd814] border border-[#fcd200] px-3 py-1 rounded-lg text-xs shadow-sm">Buy it again</button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  )
}

export default MyOrderScreen