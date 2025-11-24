import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import api from '../utils/api';

const SearchScreen = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const { dispatch, state } = useStore();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchProductsByKeyword = async () => {
      setLoading(true);
      try {
        // Use the existing keyword search endpoint
        const { data } = await api.get(`/products?keyword=${keyword}`);
        // The backend returns { success, count, data: [] } structure for getProducts
        setProducts(data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProductsByKeyword();
  }, [keyword]);

  // Reusing handlers
  const addToCartHandler = (product) => {
    const existItem = state.cart.cartItems.find((x) => x.product === product._id);
    const quantity = existItem ? existItem.qty + 1 : 1;
    if (product.countInStock < quantity) {
      alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, product: product._id, qty: quantity } });
    navigate("/cart");
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  return (
     <div className="container mx-auto px-4 py-4">
       <div className="bg-white p-4 shadow-sm mb-4 border border-gray-200">
          <h1 className="font-bold text-lg">Search results for <span className="text-[#c45500]">"{keyword}"</span></h1>
          <div className="text-sm text-gray-500">{products.length} items found</div>
       </div>
       
       {products.length === 0 ? (
          <div className="text-center py-10">No products found matching your search.</div>
       ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {products.map((product) => (
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
                      </div>
                      
                      <div className="mt-auto pt-2">
                         <button 
                           onClick={() => addToCartHandler(product)}
                           className="w-full rounded-full py-1.5 text-xs font-medium shadow-sm focus:outline-none bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200]"
                         >
                           Add to Cart
                         </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  )
}

export default SearchScreen