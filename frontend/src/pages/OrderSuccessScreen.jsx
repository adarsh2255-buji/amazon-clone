import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Package } from 'lucide-react';

const OrderSuccessScreen = () => {
  const { id } = useParams();
  const { state } = useStore();
  const { userInfo } = state;
  const navigate = useNavigate();
  return (
     <div className="container mx-auto px-4 py-6 max-w-5xl">
       {/* Success Banner */}
       <div className="border border-green-600 rounded-md p-4 bg-white mb-6 flex items-start">
          <CheckCircle className="text-green-600 w-6 h-6 mr-3 mt-0.5" />
          <div>
             <h1 className="text-[#007600] font-bold text-lg">Order placed, thank you!</h1>
             <p className="text-sm text-gray-700 mt-1">Confirmation will be sent to Message Centre.</p>
             
             <div className="mt-3 text-sm">
                <span className="font-bold">Shipping to {userInfo?.name || 'User'},</span> {state.cart.shippingAddress?.address || 'Address...'}
             </div>

             <div className="mt-4 flex items-center">
                <div className="font-bold text-sm mr-6">
                   Thursday, 27 Nov <br/> <span className="font-normal text-gray-500">Delivery date</span>
                </div>
                {/* Tiny product thumb placeholder */}
                <Package className="w-10 h-10 text-gray-400" />
             </div>

             <div className="mt-4">
                <Link to="/myorders" className="text-[#007185] text-sm hover:underline hover:text-[#c7511f]">Review or edit your recent orders ›</Link>
             </div>
          </div>
       </div>

       {/* Recommendations / Ads (Visual Filler) */}
       <div className="border border-gray-200 rounded-md p-6 bg-white flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-white to-blue-50">
          <div>
             <div className="font-bold text-lg mb-1">amazon prime</div>
             <div className="text-sm mb-2">Get all of Prime Shopping and Entertainment benefits</div>
             <div className="text-xl font-bold mb-3">for ₹299 FREE</div>
             <button className="bg-[#ffd814] border border-[#fcd200] px-4 py-1.5 rounded-md text-sm font-medium shadow-sm">Start your 30-day FREE trial</button>
          </div>
       </div>
    </div>
  )
}

export default OrderSuccessScreen