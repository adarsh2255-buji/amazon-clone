import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart } from "lucide-react";


const Header = () => {
  const { state, dispatch } = useStore();
  const { cart, userInfo } = state;
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

   // Search Handler
  const searchHandler = (e) => {
    e.preventDefault(); // Prevent default form submission if used in form
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
    } else {
      navigate("/");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchHandler(e);
    }
  };

  const logoutHandler = () => {
  dispatch({ type: 'USER_LOGOUT' });
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cartItems');
  navigate('/login');
};
  return (
    <header className="bg-[#131921] text-white">
      {/* Top Navbar Container */}
      <div className="flex items-center p-2 gap-2 flex-wrap lg:flex-nowrap">
        
        {/*  Logo */}
        <Link to="/" className="flex items-end border border-transparent hover:border-white rounded-sm px-2 py-1 transition cursor-pointer">
           <span className="text-2xl font-bold tracking-tighter leading-none">amazon</span>
           <span className="text-sm font-bold leading-none mb-1">clone</span>
        </Link>

        {/* Location (Deliver to) - Hidden on small mobile */}
        <div className="hidden md:flex items-center border border-transparent hover:border-white rounded-sm px-2 py-1 cursor-pointer transition">
            <div className="flex flex-col justify-end self-end mb-1 mr-1">
                {/* Pin Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <div className="flex flex-col leading-none">
                 <span className="text-xs text-gray-300">Deliver to {userInfo ? userInfo.name.split(' ')[0] : 'Guest'}</span>
                 <span className="text-sm font-bold">Update Location</span>
            </div>
        </div>

       {/* Search Bar Section */}
        <div className="flex flex-1 h-10 rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-[#febd69]">
            <div className="hidden sm:flex bg-[#e6e6e6] hover:bg-[#d4d4d4] text-gray-600 px-3 items-center text-xs border-r border-gray-300 cursor-pointer">
                All <svg className="w-2.5 h-2.5 ml-1 fill-current text-gray-600" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search Amazon.in" 
              className="flex-grow w-full p-2 text-black outline-none h-full bg-white placeholder-gray-500 border border-gray-300"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={searchHandler}
              className="bg-[#febd69] hover:bg-[#f3a847] text-black px-4 h-full flex items-center justify-center"
            >
                 <Search className="h-5 w-5" />
            </button>
        </div>

        {/*  Account & Lists */}
        <div className="relative group border border-transparent hover:border-white rounded-sm px-2 py-1 cursor-pointer transition">
             <div className="flex flex-col leading-none">
                 <span className="text-xs text-gray-200">Hello, {userInfo ? userInfo.name : 'sign in'}</span>
                 <span className="text-sm font-bold flex items-center">
                    Account & Lists
                    <svg className="w-2.5 h-2.5 ml-1 fill-current text-gray-400 mt-1" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                 </span>
             </div>
             {/* Dropdown Menu - Expanded (Matches Amazon style) */}
             <div className="absolute right-0 top-full mt-1 md:mt-2 w-96 md:w-[640px] bg-white text-black rounded shadow-lg hidden group-hover:block z-50 border border-gray-200 p-4">
                 {/* Top info bar */}
                 <div className="bg-[#eaf7f6] border-l-4 border-[#f0c14b] rounded p-3 mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">Who is shopping? Select a profile.</div>
                    <button className="text-sm font-medium text-[#1a73e8] border border-[#f0c14b] px-3 py-1 rounded">Manage Profiles</button>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <h3 className="font-bold mb-3">Your Lists</h3>
                       <ul className="text-sm text-gray-700 space-y-1">
                          <li><Link to="#" className="hover:underline">Create a Wish List</Link></li>
                          <li><Link to="#" className="hover:underline">Wish from Any Website</Link></li>
                          <li><Link to="#" className="hover:underline">Baby Wishlist</Link></li>
                          <li><Link to="#" className="hover:underline">Discover Your Style</Link></li>
                          <li><Link to="#" className="hover:underline">Explore Showroom</Link></li>
                       </ul>
                    </div>

                    <div>
                       <h3 className="font-bold mb-3">Your Account</h3>
                       <ul className="text-sm text-gray-700 space-y-1">
                          <li><Link to="/profile" className="hover:underline">Your Account</Link></li>
                          <li><Link to="/switch" className="hover:underline">Switch Accounts</Link></li>
                          <li>{userInfo ? <button onClick={logoutHandler} className="text-left hover:underline">Sign Out</button> : <Link to="/login" className="hover:underline">Sign In</Link>}</li>
                          <li><Link to="/myOrders" className="hover:underline">Your Orders</Link></li>
                          <li><Link to="#" className="hover:underline">Your Wish List</Link></li>
                          <li><Link to="#" className="hover:underline">Keep shopping for</Link></li>
                          <li><Link to="#" className="hover:underline">Your Recommendations</Link></li>
                          <li><Link to="#" className="hover:underline">Returns</Link></li>
                          <li><Link to="#" className="hover:underline">Recalls and Product Safety Alerts</Link></li>
                          <li><Link to="#" className="hover:underline">Your Prime Membership</Link></li>
                          <li><Link to="#" className="hover:underline">Your Prime Video</Link></li>
                          <li><Link to="#" className="hover:underline">Your Subscribe & Save Items</Link></li>
                          <li><Link to="#" className="hover:underline">Memberships & Subscriptions</Link></li>
                          <li><Link to="#" className="hover:underline">Your Seller Account</Link></li>
                          <li><Link to="#" className="hover:underline">Content Library</Link></li>
                          <li><Link to="#" className="hover:underline">Devices</Link></li>
                          <li><Link to="#" className="hover:underline">Register for a free Business Account</Link></li>
                       </ul>
                    </div>
                 </div>
             </div>
        </div>

        {/*  Returns & Orders */}
        <Link to="/myOrders" className="hidden lg:flex flex-col leading-none border border-transparent hover:border-white rounded-sm px-2 py-1 cursor-pointer transition">
             <span className="text-xs text-gray-200">Returns</span>
             <span className="text-sm font-bold">& Orders</span>
        </Link>

        {/*  Cart */}
             <Link to="/cart" className="flex items-end border border-transparent hover:border-white rounded-sm px-2 py-1 cursor-pointer transition relative">
             <div className="relative">
                 <ShoppingCart className="h-12 w-8 text-white" />
                 {/* Count Badge */}
                 <span className="absolute top-3 left-1/2 transform -translate-x-1/2 text-[#f08804] font-bold text-sm">
                    {cart.cartItems.reduce((a, c) => a + c.qty, 0)}
                 </span>
             </div>
             <span className="text-sm font-bold mb-1 ml-0.5">Cart</span>
        </Link>

      </div>
      
      {/* Optional Sub-Header (Best Sellers etc.) */}
      <div className="bg-[#232f3e] text-white text-sm flex items-center p-2 space-x-4 overflow-x-auto pl-4">
         <div className="flex items-center font-bold cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            All
         </div>
         <span className="cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm whitespace-nowrap">Fresh</span>
         <span className="cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm whitespace-nowrap">Amazon miniTV</span>
         <span className="cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm whitespace-nowrap">Sell</span>
         <span className="cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm whitespace-nowrap">Best Sellers</span>
         <span className="cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm whitespace-nowrap">Mobiles</span>
         <span className="cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm whitespace-nowrap">Today's Deals</span>
         <span className="cursor-pointer hover:border hover:border-white px-1 py-0.5 rounded-sm whitespace-nowrap">Customer Service</span>
      </div>
    </header>
  )
}

export default Header