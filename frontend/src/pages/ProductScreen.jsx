import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import api from '../utils/api';
import { MapPin } from 'lucide-react';

const ProductScreen = () => {
    const { id } = useParams(); // React Router Hook
    const navigate = useNavigate(); // Replaces useRouter
    const { dispatch, state } = useStore();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);

    
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

    const addToCartHandler = () => {
        dispatch({
            type: "CART_ADD_ITEM",
            payload: { ...product, product: product._id, qty: Number(qty) },
        });
        navigate("/cart");
    };

     const buyNowHandler = () => {
    // Add to cart then go straight to checkout/shipping
    dispatch({
        type: "CART_ADD_ITEM",
        payload: { ...product, product: product._id, qty: Number(qty) },
    });
    // Check if logged in handled by /shipping page logic usually, but good to be explicit
    navigate(state.userInfo ? "/shipping" : "/login?redirect=/shipping");
  };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return null;

    return (
    <div className="bg-white">
      {/* Breadcrumb/Nav */}
      <div className="text-xs text-gray-500 py-2 px-4 container mx-auto">
         <Link to="/" className="hover:underline hover:text-[#c7511f]">Home</Link> › {product.category} › {product.brand}
      </div>

      <div className="container mx-auto px-4 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1. Image Column */}
        <div className="lg:col-span-5 flex justify-center">
           {/* Sticky container logic would go here for real sticky effect */}
           <div className="w-full max-w-md">
              <img src={product.image} alt={product.name} className="w-full h-auto max-h-[600px] object-contain mix-blend-multiply" />
           </div>
        </div>

        {/* 2. Center Details Column */}
        <div className="lg:col-span-4 space-y-3">
           {/* Title */}
           <div className="border-b border-gray-200 pb-2">
              <h1 className="text-2xl font-medium text-gray-900 leading-tight">{product.name}</h1>
              <Link to="/" className="text-sm text-[#007185] hover:underline hover:text-[#c7511f] block mt-1">Visit the {product.brand || "Generic"} Store</Link>
              
              {/* Ratings */}
              <div className="flex items-center mt-1">
                 <div className="flex text-sm text-[#de7921] mr-2">
                    {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                 </div>
                 <Link to="#reviews" className="text-sm text-[#007185] hover:underline hover:text-[#c7511f] mr-4">{product.numReviews} ratings</Link>
                 <span className="text-xs text-gray-400">|</span>
                 <span className="text-sm text-[#007185] ml-4 hover:underline cursor-pointer">Search this page</span>
              </div>
           </div>

           {/* Price */}
           <div className="pt-2">
              <div className="flex items-start">
                 <span className="text-2xl text-[#CC0C39] font-light mr-2">-{Math.round((1 - (product.price / (product.price * 1.2))) * 100)}%</span>
                 <div className="flex items-baseline">
                    <span className="text-sm align-top relative top-1 font-medium">₹</span>
                    <span className="text-3xl font-medium text-gray-900 px-0.5">{Math.floor(product.price)}</span>
                    <span className="text-sm align-top relative top-1 font-medium">{String(product.price).split('.')[1] || '00'}</span>
                 </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                 M.R.P.: <span className="line-through">₹{Math.round(product.price * 1.2)}</span>
              </div>
              <div className="text-sm text-gray-900 mt-2">Inclusive of all taxes</div>
           </div>

           {/* Offers (Icons) */}
           <div className="flex space-x-2 py-2 overflow-x-auto no-scrollbar">
              {/* Card 1 */}
              <div className="min-w-[90px] w-[90px] bg-white border rounded p-2 text-xs leading-tight cursor-pointer hover:bg-gray-50">
                 <div className="mb-2"><img src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB484059092_.png" alt="Returns" className="w-8 h-8" /></div>
                 <span className="text-[#007185]">10 days Return & Exchange</span>
              </div>
              {/* Card 2 */}
              <div className="min-w-[90px] w-[90px] bg-white border rounded p-2 text-xs leading-tight cursor-pointer hover:bg-gray-50">
                 <div className="mb-2"><img src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-amazon-delivered._CB485933725_.png" alt="Amazon" className="w-8 h-8" /></div>
                 <span className="text-[#007185]">Amazon Delivered</span>
              </div>
              {/* Card 3 */}
              <div className="min-w-[90px] w-[90px] bg-white border rounded p-2 text-xs leading-tight cursor-pointer hover:bg-gray-50">
                 <div className="mb-2"><img src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-warranty._CB485935626_.png" alt="Warranty" className="w-8 h-8" /></div>
                 <span className="text-[#007185]">Warranty Policy</span>
              </div>
           </div>

           <div className="border-t border-gray-200 my-2"></div>

           {/* Product Details Grid */}
           <div>
              <h2 className="font-bold text-lg mb-2">Product details</h2>
              {product.attributes && product.attributes.length > 0 ? (
                 <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {product.attributes.map((attr, index) => (
                       <React.Fragment key={index}>
                          <div className="font-bold text-gray-700">{attr.key}</div>
                          <div className="text-gray-900">{attr.value}</div>
                       </React.Fragment>
                    ))}
                 </div>
              ) : (
                 <p className="text-sm text-gray-600">No specific details available.</p>
              )}
           </div>

           <div className="border-t border-gray-200 my-4"></div>

           {/* About this item */}
           <div>
              <h2 className="font-bold text-lg mb-2">About this item</h2>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                 {product.description}
              </p>
           </div>
        </div>

        {/* 3. Right Buy Box Column */}
        <div className="lg:col-span-3">
           <div className="border border-gray-300 rounded-lg p-4 text-sm bg-white">
              <div className="flex items-baseline mb-2">
                 <span className="text-xs align-top relative top-0.5">₹</span>
                 <span className="text-xl font-medium px-0.5 text-gray-900">{Math.floor(product.price)}</span>
                 <span className="text-xs align-top relative top-0.5">{String(product.price).split('.')[1] || '00'}</span>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                 FREE delivery <span className="font-bold text-gray-900">Tuesday, 25 November</span>. <Link to="#" className="text-[#007185] hover:underline">Details</Link>
                 <div className="mt-1">
                    Or fastest delivery <span className="font-bold text-gray-900">Tomorrow, 24 November</span>. Order within <span className="text-green-600">1 hr 44 mins</span>. <Link to="#" className="text-[#007185] hover:underline">Details</Link>
                 </div>
              </div>

              <div className="flex items-center text-[#007185] text-xs mb-4 hover:underline cursor-pointer">
                 <MapPin className="w-3 h-3 mr-1" />
                 Deliver to {state.userInfo ? state.userInfo.name : "Select location"}
              </div>

              {/* Stock Status */}
              <div className="text-lg text-[#007600] font-medium mb-4">
                 {product.countInStock > 0 ? "In stock" : <span className="text-[#B12704]">Currently unavailable</span>}
              </div>

              {/* Sold By */}
              <div className="text-xs mb-4">
                 <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-600">Ships from</span>
                    <span className="text-gray-900">Amazon</span>
                    <span className="text-gray-600">Sold by</span>
                    <Link to="#" className="text-[#007185] hover:underline truncate">{product.brand || "Retailer"}</Link>
                 </div>
              </div>

              {/* Quantity */}
              {product.countInStock > 0 && (
                 <div className="mb-4">
                    <div className="relative inline-block w-full">
                       <span className="absolute left-2 top-1.5 text-xs text-gray-600 z-10">Qty:</span>
                       <select
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                          className="block w-full pl-9 py-1 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e77600] focus:border-[#e77600] bg-[#F0F2F2] hover:bg-[#E3E6E6] cursor-pointer"
                       >
                          {[...Array(product.countInStock > 10 ? 10 : product.countInStock).keys()].map((x) => (
                             <option key={x + 1} value={x + 1}>{x + 1}</option>
                          ))}
                       </select>
                    </div>
                 </div>
              )}

              {/* Buttons */}
              <div className="space-y-2">
                 <button 
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className={`w-full rounded-full py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#f7ca00] ${product.countInStock > 0 ? 'bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200]' : 'bg-gray-300 cursor-not-allowed'}`}
                 >
                    Add to Cart
                 </button>
                 <button 
                    onClick={buyNowHandler}
                    disabled={product.countInStock === 0}
                    className={`w-full rounded-full py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#fa8900] ${product.countInStock > 0 ? 'bg-[#ffa41c] hover:bg-[#fa8900] border border-[#ffd814]' : 'bg-gray-300 cursor-not-allowed'}`}
                 >
                    Buy Now
                 </button>
              </div>

              {/* Gift Options */}
              <div className="mt-4 flex items-center">
                 <input type="checkbox" id="gift" className="mr-2" />
                 <label htmlFor="gift" className="text-sm text-gray-900">Add gift options</label>
              </div>

              <div className="border-t border-gray-200 my-4"></div>
              
              <button className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-sm py-1 rounded shadow-sm">
                 Add to Wish List
              </button>
           </div>
        </div>

      </div>
    </div>
  )
}

export default ProductScreen