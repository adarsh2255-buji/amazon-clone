import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useStore } from '../context/StoreContext';


const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    //Hooks for add to cart
    const { state, dispatch } = useStore();
    const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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



  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      <p className="text-sm text-gray-500 mb-6">Check each product page for other buying options. Price and other details may vary based on product size and colour.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white border border-gray-100 rounded-sm p-4 flex flex-col h-full hover:shadow-md transition-shadow duration-200">
            
            {/* Image Area */}
            <Link to={`/product/${product._id}`} className="flex justify-center items-center h-60 bg-gray-50 mb-4 rounded-sm overflow-hidden">
               <img src={product.image} alt={product.name} className="h-full w-full object-contain p-2 mix-blend-multiply" />
            </Link>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              
              {/* Title/Brand & Description */}
              <Link to={`/product/${product._id}`}>
                <h2 className="font-bold text-lg leading-tight hover:text-[#c7511f] text-gray-900 mb-1">
                  {product.brand || "Generic"} 
                </h2>
                <p className="text-sm text-gray-700 line-clamp-2 hover:text-[#c7511f] cursor-pointer mb-2 leading-snug">
                    {product.name} - {product.description}
                </p>
              </Link>

              {/* Rating */}
              <div className="flex items-center mb-2">
                 <div className="flex text-[#de7921] text-sm">
                   {'★'.repeat(Math.floor(product.rating))}
                   {'☆'.repeat(5 - Math.floor(product.rating))}
                 </div>
                 <span className="text-blue-600 text-xs ml-1 hover:underline cursor-pointer">({product.numReviews})</span>
              </div>

              {/* Price Block */}
              <div className="mb-2">
                 <div className="flex items-baseline">
                    <span className="text-xs align-top relative top-0.5">₹</span>
                    <span className="text-2xl font-medium px-0.5 text-gray-900">{Math.floor(product.price)}</span>
                    <span className="text-xs align-top relative top-0.5">{String(product.price).split('.')[1] || '00'}</span>
                    <span className="text-gray-500 text-xs ml-2 line-through">M.R.P: ₹{Math.round(product.price * 1.2)}</span>
                 </div>
                 <div className="text-xs text-gray-500 mt-1">
                    FREE delivery <span className="font-bold text-gray-800">Tomorrow, 25 Nov</span>
                 </div>
              </div>

              {/* Stock Warning (Only if < 5) */}
              {product.countInStock < 5 && product.countInStock > 0 && (
                  <div className="text-[#b12704] text-xs font-bold mb-3">
                      Only {product.countInStock} left in stock.
                  </div>
              )}

              {/* Add to Cart Button */}
              <div className="mt-auto pt-2">
                 <button 
                    onClick={() => addToCartHandler(product)}
                    className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full w-full sm:w-32 py-1.5 text-sm text-[#0F1111] shadow-sm active:shadow-inner"
                 >
                    Add to cart
                 </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeScreen