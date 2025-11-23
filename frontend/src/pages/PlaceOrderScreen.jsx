import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

import api from '../utils/api';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { cart, userInfo } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!paymentMethod) navigate("/checkout");
  }, [paymentMethod, navigate]);

  const itemsPrice = cartItems.reduce((acc, c) => acc + c.price * c.qty, 0);
  const shippingPrice = itemsPrice > 499 ? 0 : 40;
  const totalPrice = itemsPrice + shippingPrice;

    const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice: 0, // Simplified
        totalPrice,
      });
      
      dispatch({ type: "CART_CLEAR_ITEMS" });
      // Navigate to custom success screen instead of generic order details
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl font-medium mb-4">Review your order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Left Content */}
         <div className="lg:col-span-9 space-y-4">
            
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-300 rounded p-4 bg-white text-sm">
               <div>
                  <h3 className="font-bold text-gray-700">Shipping address <Link to="/checkout" className="text-[#007185] font-normal hover:underline ml-1">Change</Link></h3>
                  <p>{userInfo.name}</p>
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                  <p>{shippingAddress.country}</p>
               </div>
               <div>
                  <h3 className="font-bold text-gray-700">Payment method <Link to="/checkout" className="text-[#007185] font-normal hover:underline ml-1">Change</Link></h3>
                  <p>{paymentMethod}</p>
               </div>
               <div>
                  <h3 className="font-bold text-gray-700">Billing address <Link to="/checkout" className="text-[#007185] font-normal hover:underline ml-1">Change</Link></h3>
                  <p>Same as shipping address</p>
               </div>
            </div>

            {/* Items Box */}
            <div className="border border-gray-300 rounded p-4 bg-white">
               <div className="flex justify-between mb-4">
                  <h2 className="font-bold text-[#c45500] text-lg">Arriving 27 Nov 2025</h2>
               </div>
               {cartItems.map((item) => (
                  <div key={item.product} className="flex mb-6">
                     <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mr-4" />
                     <div>
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-sm text-[#B12704] font-bold my-1">₹{item.price}</p>
                        <p className="text-xs text-gray-500">Sold by: Amazon Retail</p>
                        <div className="text-xs mt-1 font-bold">Quantity: {item.qty}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right Sidebar (Place Order) */}
         <div className="lg:col-span-3">
            <div className="border border-gray-300 rounded p-4 bg-white sticky top-4">
               <button 
                  onClick={placeOrderHandler} 
                  disabled={loading}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] py-2 rounded-lg text-sm shadow-sm font-medium mb-4"
               >
                  {loading ? "Placing..." : "Place your order"}
               </button>
               
               <div className="text-xs text-gray-600 mb-4 text-center">
                  By placing your order, you agree to Amazon's privacy notice and conditions of use.
               </div>

               <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold mb-2 text-lg">Order Summary</h3>
                  <div className="flex justify-between text-sm mb-1">
                     <span>Items:</span>
                     <span>₹{itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                     <span>Delivery:</span>
                     <span>₹{shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                     <span>Cash/Pay on Delivery fee:</span>
                     <span>₹{paymentMethod === 'Cash on Delivery' ? '7.00' : '0.00'}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between text-xl font-bold text-[#B12704]">
                     <span>Order Total:</span>
                     <span>₹{(totalPrice + (paymentMethod === 'Cash on Delivery' ? 7 : 0)).toFixed(2)}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default PlaceOrderScreen