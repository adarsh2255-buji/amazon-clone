import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CreditCard, Lock } from 'lucide-react';

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { userInfo, cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [selectedPayment, setSelectedPayment] = useState(paymentMethod || "Cash on Delivery");

  const [showAddressForm, setShowAddressForm] = useState(!shippingAddress.address);
    useEffect(() => {
    if (!userInfo) navigate("/login?redirect=/checkout");
    }, [userInfo, navigate]);

  const saveAddressHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "SAVE_SHIPPING_ADDRESS", payload: { address, city, postalCode, country } });
    setShowAddressForm(false);
  };

    const continueHandler = () => {
    if(!shippingAddress.address && !address) return alert("Please enter shipping address");
    
    // Ensure address is saved if they didn't click save button on form but filled it out
    if (showAddressForm) {
         dispatch({ type: "SAVE_SHIPPING_ADDRESS", payload: { address, city, postalCode, country } });
    }

    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPayment });
    navigate("/placeorder");
  };

   // Calculate total for sidebar
    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
         <h1 className="text-2xl font-medium">Checkout</h1>
         <Lock className="text-gray-500 w-5 h-5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
           
           {/* 1. Delivery Address */}
           <div className="mb-6 border-b border-gray-300 pb-6">
              <div className="flex justify-between items-start">
                 <h2 className="text-lg font-bold text-[#c45500] mb-2">1. Delivering to {userInfo?.name}</h2>
                 {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="text-[#007185] text-sm hover:underline">Change</button>
                 )}
              </div>
              
              {showAddressForm ? (
                 <form onSubmit={saveAddressHandler} className="bg-gray-50 p-4 rounded border border-gray-200 max-w-lg">
                    <h3 className="font-bold mb-3">Add a new address</h3>
                    <div className="mb-3">
                       <label className="block text-sm font-bold mb-1">Address</label>
                       <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-2 rounded" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                       <div>
                          <label className="block text-sm font-bold mb-1">City</label>
                          <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full border p-2 rounded" required />
                       </div>
                       <div>
                          <label className="block text-sm font-bold mb-1">Postal Code</label>
                          <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full border p-2 rounded" required />
                       </div>
                    </div>
                    <div className="mb-3">
                       <label className="block text-sm font-bold mb-1">Country</label>
                       <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border p-2 rounded" required />
                    </div>
                    <button type="submit" className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] px-4 py-1 rounded text-sm shadow-sm">Use this address</button>
                 </form>
              ) : (
                 <div className="text-sm ml-4">
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                    <p>{shippingAddress.country}</p>
                 </div>
              )}
           </div>

           {/* 2. Payment Method */}
           <div>
              <h2 className="text-lg font-bold text-[#c45500] mb-4">2. Payment method</h2>
              <div className="border border-gray-300 rounded p-4">
                 <h3 className="font-bold mb-4">Your available balance</h3>
                 {/* Options */}
                 <div className="space-y-4">
                    <div className="flex items-start">
                       <input 
                          type="radio" 
                          id="stripe" 
                          name="payment" 
                          value="Stripe"
                          checked={selectedPayment === "Stripe"}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="mt-1 mr-2"
                       />
                       <label htmlFor="stripe" className="cursor-pointer">
                          <div className="font-bold flex items-center">Credit or debit card <CreditCard className="w-4 h-4 ml-2 text-gray-500"/></div>
                          <div className="text-sm text-gray-500">Amazon accepts all major credit & cards</div>
                       </label>
                    </div>

                    <div className="flex items-start">
                       <input 
                          type="radio" 
                          id="paypal" 
                          name="payment" 
                          value="PayPal"
                          checked={selectedPayment === "PayPal"}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="mt-1 mr-2"
                       />
                       <label htmlFor="paypal" className="cursor-pointer font-bold">PayPal</label>
                    </div>

                    <div className="flex items-start bg-gray-50 p-2 -ml-2 rounded">
                       <input 
                          type="radio" 
                          id="cod" 
                          name="payment" 
                          value="Cash on Delivery"
                          checked={selectedPayment === "Cash on Delivery"}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="mt-1 mr-2"
                       />
                       <label htmlFor="cod" className="cursor-pointer">
                          <div className="font-bold">Cash on Delivery/Pay on Delivery</div>
                          <div className="text-sm text-gray-500">Cash, UPI and Cards accepted. <span className="text-[#007185]">Know more.</span></div>
                       </label>
                    </div>
                 </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200 flex justify-between items-center">
                 <button 
                    onClick={continueHandler} 
                    className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] px-6 py-2 rounded-lg text-sm shadow-sm font-medium"
                 >
                    Use this payment method
                 </button>
              </div>
           </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4">
           <div className="border border-gray-300 rounded p-4 sticky top-4 bg-white">
              <button 
                 onClick={continueHandler} 
                 className="w-full bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] py-2 rounded-lg text-sm shadow-sm font-medium mb-4"
              >
                 Use this payment method
              </button>
              <div className="text-xs text-center text-gray-600 mb-4">
                 Choose a payment method to continue checking out. You'll still have a chance to review your order.
              </div>
              <div className="border-t border-gray-200 pt-4">
                 <h3 className="font-bold mb-2">Order Summary</h3>
                 <div className="flex justify-between text-sm mb-1">
                    <span>Items:</span>
                    <span>₹{itemsPrice.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm mb-1">
                    <span>Delivery:</span>
                    <span>--</span>
                 </div>
                 <div className="flex justify-between text-xl font-bold text-[#B12704] mt-2 border-t border-gray-200 pt-2">
                    <span>Order Total:</span>
                    <span>₹{itemsPrice.toFixed(2)}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutScreen