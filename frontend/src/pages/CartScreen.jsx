import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CheckCircle, ChevronRight, Plus, Minus } from 'lucide-react';

const CartScreen = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useStore();
    const { cartItems } = state.cart;

    const updateCartHandler = (item, qty) => {
        if (qty > item.countInStock) return alert('Out of stock');
        dispatch({ type: "CART_ADD_ITEM", payload: { ...item, qty } });
    };

  const removeItemHandler = (id) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: id });
  };

    const checkoutHandler = () => {
        state.userInfo ? navigate("/shipping") : navigate("/login?redirect=/shipping");
    };
    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="bg-[#EAEDED] min-h-screen pb-10">
      <div className="container mx-auto px-4 pt-6 max-w-[1500px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Cart Items (75%) */}
          <div className="lg:col-span-9 bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-end border-b border-gray-200 pb-3 mb-6">
               <h1 className="text-3xl font-medium">Shopping Cart</h1>
               <span className="text-sm text-gray-600">Price</span>
            </div>

            {cartItems.length === 0 ? (
              <div>
                Your Amazon Cart is empty. <Link to="/" className="text-[#007185] hover:underline">Continue shopping</Link>
              </div>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <div key={item.product} className="flex border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                    {/* Image */}
                    <div className="w-44 h-44 flex-shrink-0 mr-4">
                       <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1">
                       <div className="flex justify-between">
                          <div>
                             <Link to={`/product/${item.product}`} className="text-xl font-medium text-black hover:text-[#C7511F] hover:underline line-clamp-2 leading-snug mb-1">
                                {item.name}
                             </Link>
                             <div className="text-xs text-[#007600] mb-1">In stock</div>
                             <div className="text-xs text-gray-500 mb-1">Eligible for FREE Shipping</div>
                             <div className="text-xs text-gray-500 flex items-center mb-2">
                                <img src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px._CB485936079_.png" alt="Fulfilled" className="h-4 mr-1" />
                             </div>
                             <div className="flex items-center mb-3">
                                <input type="checkbox" id={`gift-${item.product}`} className="mr-1.5 w-3.5 h-3.5" />
                                <label htmlFor={`gift-${item.product}`} className="text-xs text-gray-900">This will be a gift <Link to="#" className="text-[#007185] hover:underline">Learn more</Link></label>
                             </div>
                             {/* Extra Attributes mock */}
                             <div className="text-xs font-bold mb-4">
                                <span className="text-gray-800">Colour:</span> <span className="text-gray-600 font-normal">Standard</span>
                             </div>

                             {/* Controls Row */}
                             <div className="flex items-center gap-4">
                                {/* Quantity Pill */}
                                <div className="flex items-center border border-gray-300 rounded-lg shadow-sm bg-[#F0F2F2] h-8">
                                   <button 
                                      onClick={() => item.qty > 1 ? updateCartHandler(item, item.qty - 1) : removeItemHandler(item.product)}
                                      className="px-2.5 h-full border-r border-gray-300 hover:bg-gray-200 rounded-l-lg flex items-center justify-center"
                                   >
                                      <Minus className="w-4 h-4 text-gray-600" />
                                   </button>
                                   <div className="px-3 text-sm font-bold bg-white h-full flex items-center border-r border-gray-300">
                                      {item.qty}
                                   </div>
                                   <button 
                                      onClick={() => updateCartHandler(item, item.qty + 1)}
                                      disabled={item.qty >= item.countInStock}
                                      className="px-2.5 h-full hover:bg-gray-200 rounded-r-lg flex items-center justify-center disabled:opacity-50"
                                   >
                                      <Plus className="w-3.5 h-3.5 text-gray-600" />
                                   </button>
                                </div>

                                {/* Links */}
                                <div className="flex items-center text-xs space-x-3 text-[#007185]">
                                   <button className="hover:underline" onClick={() => removeItemHandler(item.product)}>Delete</button>
                                   <span className="text-gray-300">|</span>
                                   <button className="hover:underline">Save for later</button>
                                   <span className="text-gray-300">|</span>
                                   <button className="hover:underline">See more like this</button>
                                   <span className="text-gray-300">|</span>
                                   <button className="hover:underline">Share</button>
                                </div>
                             </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right font-bold text-lg ml-4 text-gray-900">
                             ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-right text-xl font-medium pt-2">
                   Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items): <span className="font-bold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Checkout Sidebar (25%) */}
          <div className="lg:col-span-3">
             <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                {/* Free Delivery Progress Mock */}
                <div className="mb-4">
                   <div className="flex items-center text-xs text-[#007600] font-bold mb-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full mr-2 overflow-hidden">
                         <div className="h-full bg-[#007600] w-full"></div>
                      </div>
                      ₹499
                   </div>
                   <div className="flex items-start text-xs text-[#007600]">
                      <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0 fill-[#007600] text-white" />
                      <span>
                         <span className="font-bold">Your order is eligible for FREE Delivery.</span>
                         <br/><span className="text-black font-normal">Choose <Link to="#" className="text-[#007185] hover:underline">FREE Delivery</Link> option at checkout.</span>
                      </span>
                   </div>
                </div>

                <div className="text-lg font-medium mb-4 leading-snug">
                   Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} item): <br/>
                   <span className="font-bold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex items-center mb-4">
                   <input type="checkbox" id="gift-order" className="mr-2 w-4 h-4" />
                   <label htmlFor="gift-order" className="text-sm">This order contains a gift</label>
                </div>

                <button 
                   onClick={checkoutHandler}
                   disabled={cartItems.length === 0}
                   className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black text-sm font-medium py-2 rounded-full shadow-sm mb-4"
                >
                   Proceed to Buy
                </button>

                <div className="border border-gray-300 rounded-md">
                   <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50">
                      <span className="text-sm font-bold">EMI Available</span>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                   </div>
                </div>
             </div>

             {/* Recently Viewed Mock */}
             <div className="mt-6 bg-white p-4 rounded shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-2">Your recently viewed items</h3>
                {/* Placeholder for recent items */}
                <div className="text-xs text-gray-500">See your browsing history</div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CartScreen