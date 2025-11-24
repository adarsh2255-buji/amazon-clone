import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { useStore } from '../context/StoreContext';

const CategoryScreen = () => {
  const { category } = useParams();
  const navigate = useNavigate()
  const { dispatch, state } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

 useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        // Call the new dedicated backend endpoint
        const { data } = await api.get(`/products/category/${category}`);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProductsByCategory();
  }, [category]);


      const addToCartHandler = (product) => {
      // Check if item exists in cart to increment
      const existItem = state.cart.cartItems.find((x) => x.product === product._id);
      const quantity = existItem ? existItem.qty + 1 : 1;
  
      // Stock Check
      if (product.countInStock < quantity) {
        alert('Sorry. Product is out of stock');
        return;
      }
  
      // Dispatch
      dispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, product: product._id, qty: quantity },
      });
      
      // Go to Cart (Amazon behavior simulation)
      navigate('/cart'); 
    };

    const buyNowHandler = (product) => {
        const existItem = state.cart.cartItems.find((x) => x.product === product._id);
        const quantity = existItem ? existItem.qty + 1 : 1;
        // Stock Check
        if (product.countInStock < quantity) {
          alert('Sorry. Product is out of stock');
          return;
        }
        // Dispatch
        dispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...product, product: product._id, qty: quantity },
        });
        // Direct to Checkout
            navigate(state.userInfo ? "/checkout" : "/login?redirect=/checkout");

    }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
     <div className="container mx-auto px-4 py-4">
       <div className="bg-white p-4 shadow-sm mb-4 border border-gray-200">
          <h1 className="font-bold text-lg">Results for <span className="text-[#c45500]">"{category}"</span></h1>
          <div className="text-sm text-gray-500">Check each product page for other buying options.</div>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentItems.map((product) => (
             <div key={product._id} className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col hover:shadow-md transition-shadow h-full">
                <Link to={`/product/${product._id}`} className="h-52 flex justify-center items-center bg-gray-50 mb-4 relative">
                   <img src={product.image} alt={product.name} className="h-full w-full object-contain mix-blend-multiply p-2"/>
                </Link>
                
                <div className="flex-1 flex flex-col">
                   <Link to={`/product/${product._id}`}>
                      <h2 className="font-medium text-base text-gray-900 hover:text-[#c7511f] line-clamp-2 mb-1">{product.name}</h2>
                   </Link>
                   <div className="text-sm text-gray-500 mb-1">by {product.brand}</div>
                   <div className="flex items-center mb-1">
                      <div className="flex text-[#de7921] text-sm">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</div>
                      <span className="text-blue-600 text-xs ml-1 hover:underline cursor-pointer">{product.numReviews}</span>
                   </div>
                   <div className="flex items-baseline">
                      <span className="text-xs relative top-[-4px]">₹</span>
                      <span className="text-2xl font-medium text-gray-900">{Math.floor(product.price)}</span>
                      <span className="text-xs relative top-[-4px]">{String(product.price).split('.')[1] || '00'}</span>
                      <span className="text-gray-500 text-xs ml-2 line-through">M.R.P: ₹{Math.round(product.price * 1.2)}</span>
                   </div>
                   <div className="text-xs text-gray-500 mt-1 mb-4">FREE Delivery by Amazon</div>
                   
                   {/* Action Buttons in Category View */}
                   <div className="mt-auto space-y-2">
                      <button 
                        onClick={() => addToCartHandler(product)}
                        disabled={product.countInStock === 0}
                        className={`w-full rounded-full py-1.5 text-xs font-medium shadow-sm focus:outline-none ${product.countInStock > 0 ? 'bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200]' : 'bg-gray-300 cursor-not-allowed'}`}
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => buyNowHandler(product)}
                        disabled={product.countInStock === 0}
                        className={`w-full rounded-full py-1.5 text-xs font-medium shadow-sm focus:outline-none ${product.countInStock > 0 ? 'bg-[#ffa41c] hover:bg-[#fa8900] border border-[#ffd814]' : 'bg-gray-300 cursor-not-allowed'}`}
                      >
                        Buy Now
                      </button>
                   </div>
                </div>
             </div>
          ))}
       </div>

       {/* Pagination */}
       {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
             <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50 hover:bg-gray-50 shadow-sm"
             >
                &lt; Previous
             </button>
             {[...Array(totalPages).keys()].map(num => (
                <button
                   key={num + 1}
                   onClick={() => setCurrentPage(num + 1)}
                   className={`px-3 py-1 border border-gray-300 rounded text-sm shadow-sm ${currentPage === num + 1 ? 'bg-white border-[#e77600] ring-1 ring-[#e77600] text-[#c45500]' : 'bg-white hover:bg-gray-50'}`}
                >
                   {num + 1}
                </button>
             ))}
             <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50 hover:bg-gray-50 shadow-sm"
             >
                Next &gt;
             </button>
          </div>
       )}
    </div>
  )
}

export default CategoryScreen