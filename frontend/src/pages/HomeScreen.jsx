import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useStore } from '../context/StoreContext';
import Carousel from '../components/Carousel';


const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState('');

  // Categories to display in the grid
  const categories = [
    { name: 'Mobile', title: 'Mobiles & Accessories', link: 'mobile' }, 
     
    { name: 'Jeans', title: 'Jeans & Denim', link: 'jeans' },          
    { name: 'Headphones', title: 'Electronics & Gadgets', link: 'headphones' } ,
   //  { name: 'Footwear', title: 'Footwear & Shoes', link: 'footwear' }, 
  ];
   


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

    // Helper to find one image for the card
const getImageForCategory = (catLink) => {
    if (!products || products.length === 0) return "https://via.placeholder.com/300?text=Loading";
    
    // Special mapping for Electronics display card to look for Headphones in DB
    const searchTerm = catLink === 'electronics' ? 'headphones' : catLink;

    const found = products.find(p => 
        p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(found);
    
    return found?.image || "https://via.placeholder.com/300?text=No+Image";
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;





  return (
   <div className="relative bg-gray-100 min-h-screen">
      <Carousel />
      
      {/* Category Grid - Overlapping Carousel */}
      <div className="container mx-auto px-4 relative z-10 -mt-20 lg:-mt-60 mb-8">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
               <div key={cat.name} className="bg-white p-5 shadow-sm z-20 flex flex-col h-[420px]">
                  <h2 className="font-bold text-xl mb-4 text-gray-900 tracking-tight leading-snug">
                    {cat.title}
                  </h2>
                  
                  {/* Image Link -> Goes to Category Page */}
                  <Link to={`/category/${cat.link}`} className="flex-grow mb-4 overflow-hidden cursor-pointer">
                     <img 
                        src={getImageForCategory(cat.name)} 
                        alt={cat.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                     />
                  </Link>

                  {/* Text Link -> Goes to Category Page */}
                  <Link to={`/category/${cat.link}`} className="text-[#007185] text-sm hover:text-[#C7511F] hover:underline mt-auto inline-block">
                     See all offers
                  </Link>
               </div>
            ))}
         </div>
         
         {/* Horizontal Scrollable Product Feed (Best Sellers etc.) */}
         <div className="bg-white p-6 mt-6 shadow-sm">
            <h2 className="font-bold text-xl mb-4">Best Sellers in Sports, Fitness & Outdoors</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 no-scrollbar">
               {products.slice(0, 10).map(p => (
                  <Link key={p._id} to={`/product/${p._id}`} className="min-w-[200px] max-w-[200px] cursor-pointer group">
                     <div className="h-48 flex justify-center items-center bg-gray-50 mb-2">
                        <img src={p.image} className="max-h-full max-w-full object-contain mix-blend-multiply p-2" alt={p.name} />
                     </div>
                     <div className="text-sm text-gray-900 line-clamp-2 group-hover:text-[#c7511f]">{p.name}</div>
                     <div className="text-lg font-medium text-gray-900">₹{Math.floor(p.price)}</div>
                  </Link>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}

export default HomeScreen