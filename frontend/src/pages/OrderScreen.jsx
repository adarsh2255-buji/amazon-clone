import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import api from '../utils/api';

const OrderScreen = () => {
  const { id } = useParams();
  const { state } = useStore();
  const { userInfo } = state;
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);

useEffect(() => {
    if (!userInfo) return navigate("/login");
    const fetchOrder = async () => { try { const { data } = await api.get(`/orders/${id}`); setOrder(data); } catch (err) { alert(err.message); } };
    if(!order) fetchOrder();
  }, [id, userInfo, navigate, order]);

    const onPayHandler = async () => {
        try {
        setLoadingPay(true);
        const { data } = await api.put(`/orders/${id}/pay`, { id: "TEST_ID", status: "COMPLETED", update_time: new Date().toISOString(), email_address: userInfo.email });
        setOrder(data); setLoadingPay(false); alert("Paid!");
        } catch (err) { alert(err.message); setLoadingPay(false); }
    };

    if (!order) return <div>Loading Order...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order {order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-6 shadow border"><h2 className="font-bold">Shipping</h2><p>{order.shippingAddress.address}</p>{order.isDelivered ? <div className="bg-green-100 p-2">Delivered</div> : <div className="bg-red-100 p-2">Not Delivered</div>}</div>
          <div className="bg-white p-6 shadow border"><h2 className="font-bold">Payment</h2><p>{order.paymentMethod}</p>{order.isPaid ? <div className="bg-green-100 p-2">Paid</div> : <div className="bg-red-100 p-2">Not Paid</div>}</div>
        </div>
        <div className="md:col-span-1 bg-white p-6 shadow border">
          <h2 className="font-bold mb-4">Summary</h2>
          <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${order.totalPrice}</span></div>
          {!order.isPaid && <button onClick={onPayHandler} disabled={loadingPay} className="w-full bg-yellow-400 font-bold py-3 mt-4 rounded">Test Pay</button>}
        </div>
      </div>
    </div>
  )
}

export default OrderScreen