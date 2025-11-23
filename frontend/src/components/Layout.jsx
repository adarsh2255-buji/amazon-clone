import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
     <div className="bg-gray-100 min-h-screen flex flex-col text-gray-900">
      <Header />
      <main className="grow container mx-auto px-4 py-8">
        {/* This is where the Screens (Home, Product, Cart) are injected */}
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-white text-center py-4 mt-8">
         &copy; 2025 Amazon Clone. All rights reserved.
      </footer>
    </div>
  )
}

export default Layout