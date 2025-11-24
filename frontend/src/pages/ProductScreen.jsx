import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import api from '../utils/api';
import { MapPin, User } from 'lucide-react';

const ProductScreen = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const { dispatch, state } = useStore();
    const { userInfo } = state;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);

    //Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false)

    //fetch product details
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
      useEffect(() => {
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

  //submit review
  const submitReviewHandler = async (e) => {
   e.preventDefault();
   setReviewLoading(true);
   try {
      await api.post(`/products/${id}/reviews`, {
         rating,
         comment,
      });
      alert("Review submitted successfully");
      setComment('');
      setRating(5);
      fetchProduct(); // Refresh product details to show new review
   } catch (error) {
      alert(error.response?.data?.message || error.message);
   } finally {
      setReviewLoading(false);
   }
  }

//   calculate star percentage
const getStarPercentage = (starValue) => {
   if(!product?.reviews || product.reviews.length === 0) return 0;
    const count = product.reviews.filter(r => Math.round(r.rating) === starValue).length;
    return Math.round((count / product.reviews.length) * 100);

}
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return null;

    return (
    <div className="bg-white">
      <div className="text-xs text-gray-500 py-2 px-4 container mx-auto">
         <Link to="/" className="hover:underline hover:text-[#c7511f]">Home</Link> › {product.category} › {product.brand}
      </div>

      <div className="container mx-auto px-4 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Image */}
        <div className="lg:col-span-5 flex justify-center">
           <div className="w-full max-w-md sticky top-4">
              <img src={product.image} alt={product.name} className="w-full h-auto max-h-[600px] object-contain mix-blend-multiply" />
           </div>
        </div>

        {/* MIDDLE: Details */}
        <div className="lg:col-span-4 space-y-3">
           <div className="border-b border-gray-200 pb-2">
              <h1 className="text-2xl font-medium text-gray-900 leading-tight">{product.name}</h1>
              <Link to="/" className="text-sm text-[#007185] hover:underline hover:text-[#c7511f] block mt-1">Visit the {product.brand || "Generic"} Store</Link>
              <div className="flex items-center mt-1">
                 <div className="flex text-sm text-[#de7921] mr-2">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</div>
                 <Link to="#reviews" className="text-sm text-[#007185] hover:underline hover:text-[#c7511f] mr-4">{product.numReviews} ratings</Link>
              </div>
           </div>

           <div className="pt-2">
              <div className="flex items-start">
                 <span className="text-2xl text-[#CC0C39] font-light mr-2">-{Math.round((1 - (product.price / (product.price * 1.2))) * 100)}%</span>
                 <div className="flex items-baseline">
                    <span className="text-sm align-top relative top-1 font-medium">₹</span>
                    <span className="text-3xl font-medium text-gray-900 px-0.5">{Math.floor(product.price)}</span>
                    <span className="text-sm align-top relative top-1 font-medium">{String(product.price).split('.')[1] || '00'}</span>
                 </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">M.R.P.: <span className="line-through">₹{Math.round(product.price * 1.2)}</span></div>
              <div className="text-sm text-gray-900 mt-2">Inclusive of all taxes</div>
           </div>

           <div className="flex space-x-2 py-2 overflow-x-auto no-scrollbar">
              {/* ... Icons (same as before) ... */}
              <div className="min-w-[90px] w-[90px] bg-white border rounded p-2 text-xs leading-tight cursor-pointer hover:bg-gray-50">
                 <div className="mb-2"><img src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB484059092_.png" alt="Returns" className="w-8 h-8" /></div>
                 <span className="text-[#007185]">10 days Return & Exchange</span>
              </div>
              {/* ... more icons ... */}
           </div>

           <div className="border-t border-gray-200 my-2"></div>

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

           <div>
              <h2 className="font-bold text-lg mb-2">About this item</h2>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{product.description}</p>
           </div>
        </div>

        {/* RIGHT: Buy Box */}
        <div className="lg:col-span-3">
           <div className="border border-gray-300 rounded-lg p-4 text-sm bg-white">
              <div className="flex items-baseline mb-2">
                 <span className="text-xs align-top relative top-0.5">₹</span>
                 <span className="text-xl font-medium px-0.5 text-gray-900">{Math.floor(product.price)}</span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                 FREE delivery <span className="font-bold text-gray-900">Tuesday, 25 November</span>.
              </div>
              <div className="text-lg text-[#007600] font-medium mb-4">
                 {product.countInStock > 0 ? "In stock" : <span className="text-[#B12704]">Currently unavailable</span>}
              </div>
              
              {product.countInStock > 0 && (
                 <div className="mb-4">
                    <div className="relative inline-block w-full">
                       <span className="absolute left-2 top-1.5 text-xs text-gray-600 z-10">Qty:</span>
                       <select
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                          className="block w-full pl-9 py-1 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-[#F0F2F2]"
                       >
                          {[...Array(product.countInStock > 10 ? 10 : product.countInStock).keys()].map((x) => (
                             <option key={x + 1} value={x + 1}>{x + 1}</option>
                          ))}
                       </select>
                    </div>
                 </div>
              )}

              <div className="space-y-2">
                 <button onClick={addToCartHandler} disabled={product.countInStock === 0} className={`w-full rounded-full py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#f7ca00] ${product.countInStock > 0 ? 'bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200]' : 'bg-gray-300 cursor-not-allowed'}`}>Add to Cart</button>
                 <button onClick={buyNowHandler} disabled={product.countInStock === 0} className={`w-full rounded-full py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#fa8900] ${product.countInStock > 0 ? 'bg-[#ffa41c] hover:bg-[#fa8900] border border-[#ffd814]' : 'bg-gray-300 cursor-not-allowed'}`}>Buy Now</button>
              </div>
           </div>
        </div>

      </div>

      {/* --- CUSTOMER REVIEWS SECTION --- */}
      <div className="container mx-auto px-4 pb-10" id="reviews">
         <div className="border-t border-gray-200 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Summary & Breakdown */}
            <div className="lg:col-span-4">
               <h2 className="text-xl font-bold mb-2">Customer Reviews</h2>
               <div className="flex items-center mb-1">
                  <div className="flex text-[#de7921]">
                     {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="ml-2 font-medium text-lg">{product.rating} out of 5</span>
               </div>
               <div className="text-sm text-gray-500 mb-6">{product.numReviews} global ratings</div>

               {/* Star Bars */}
               <div className="space-y-3 mb-8">
                  {[5, 4, 3, 2, 1].map(star => {
                     const pct = getStarPercentage(star);
                     return (
                       <div key={star} className="flex items-center text-sm">
                          <span className="w-12 text-[#007185] hover:underline cursor-pointer hover:text-[#c7511f] whitespace-nowrap">{star} star</span>
                          <div className="flex-1 mx-3 h-5 bg-[#F0F2F2] rounded-sm border border-gray-300 overflow-hidden shadow-inner">
                             <div className="h-full bg-[#FFA41C]" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="w-8 text-right text-[#007185]">{pct}%</span>
                       </div>
                     );
                  })}
               </div>

               <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-lg mb-1">Review this product</h3>
                  <p className="text-sm mb-4">Share your thoughts with other customers</p>
                  
                  {/* Review Form */}
                  {userInfo ? (
                     <form onSubmit={submitReviewHandler} className="border border-gray-300 p-4 rounded-md bg-gray-50">
                        <div className="mb-3">
                           <label className="block text-sm font-bold mb-1">Rating</label>
                           <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full border p-2 rounded bg-white">
                              <option value="5">5 - Excellent</option>
                              <option value="4">4 - Very Good</option>
                              <option value="3">3 - Good</option>
                              <option value="2">2 - Fair</option>
                              <option value="1">1 - Poor</option>
                           </select>
                        </div>
                        <div className="mb-3">
                           <label className="block text-sm font-bold mb-1">Comment</label>
                           <textarea 
                              value={comment} 
                              onChange={(e) => setComment(e.target.value)} 
                              rows="3" 
                              className="w-full border p-2 rounded bg-white"
                              required 
                           ></textarea>
                        </div>
                        <button 
                           type="submit" 
                           disabled={reviewLoading}
                           className="w-full border border-gray-400 bg-white hover:bg-gray-100 py-1.5 rounded-md text-sm shadow-sm"
                        >
                           {reviewLoading ? "Submitting..." : "Write a customer review"}
                        </button>
                     </form>
                  ) : (
                     <Link to="/login" className="block w-full text-center border border-gray-400 bg-white hover:bg-gray-100 py-1.5 rounded-md text-sm shadow-sm">
                        Sign in to write a review
                     </Link>
                  )}
               </div>
            </div>

            {/* Right: Review List */}
            <div className="lg:col-span-8">
               <h3 className="font-bold text-xl mb-4">Top reviews</h3>
               {product.reviews.length === 0 && (
                  <div className="text-gray-500 italic">No reviews yet. Be the first to review this product!</div>
               )}
               
               <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                     <div key={index} className="pb-4">
                        <div className="flex items-center mb-2">
                           <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-gray-500">
                              <User className="w-5 h-5" />
                           </div>
                           <span className="text-sm font-medium">{review.name}</span>
                        </div>
                        <div className="flex items-center mb-1">
                           <div className="flex text-[#de7921] text-xs mr-2">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                           </div>
                           <span className="text-xs font-bold truncate max-w-xs">{review.comment.substring(0, 30)}...</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-[#c45500] font-bold mb-2">Verified Purchase</div>
                        <p className="text-sm text-gray-800 leading-relaxed">
                           {review.comment}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                           <button className="text-sm text-gray-500 border rounded-md px-4 py-1 hover:bg-white bg-white shadow-sm">Helpful</button>
                           <span className="text-xs text-gray-500 cursor-pointer hover:underline">Report</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </div>
    </div>
  )
}

export default ProductScreen