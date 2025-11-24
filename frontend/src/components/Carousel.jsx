import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { ChevronRight, ChevronLeft } from "lucide-react";


const Carousel = () => {
    const slides = [
        "https://images-eu.ssl-images-amazon.com/images/G/31/img23/shrey/tbs/1500x600._CB777179243_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/dharshini/BAU_Heros_Nov_3000X1200_AC_2x._CB777091182_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/img24/Beauty/GW/Jupiter/leadup/2090538522-1._CB777181212_.jpg"
    ]
    const [current, setCurrent] = useState(0);
    const prev = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);
    const next = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);

 // Auto play
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [current]);



  return (
    <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] overflow-hidden group">
       <div 
         className="flex transition-transform duration-500 ease-out h-full" 
         style={{ transform: `translateX(-${current * 100}%)` }}
       >
         {slides.map((s, i) => (
           <img key={i} src={s} alt={`slide-${i}`} className="w-full h-full object-cover flex-shrink-0" />
         ))}
       </div>
       
       {/* Gradient Overlay for smooth transition to content */}
       <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-100 to-transparent"></div>

       {/* Arrows */}
       <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent border-2 border-transparent hover:border-white text-white p-2 rounded focus:outline-none">
          <ChevronLeft className="w-10 h-10" />
       </button>
       <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-2 border-transparent hover:border-white text-white p-2 rounded focus:outline-none">
          <ChevronRight className="w-10 h-10" />
       </button>
    </div>
  )
}

export default Carousel