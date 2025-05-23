// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloatingButton from '../ui/WhatsAppFloatingButton';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-sand-50">
      {/* Navbar wrapped in sea-blue header */}
      <header className="bg-sea-600 text-white shadow-md z-10 fixed w-full top-0">
        <Navbar />
      </header>

      {/* Push content below fixed navbar */}
      {/* <div className="pt-24 flex flex-col flex-grow"> */}
        {/* Main content with floating bubbles */}
        <main className="relative flex-grow overflow-hidden">
          {/* Bubble 1 */}
          <span
            className="bubble w-6 h-6 bg-white/50 absolute left-1/4 top-1/3 animate-float animate-drift"
            style={{ animationDelay: '0s' }}
          />
          {/* Bubble 2 */}
          <span
            className="bubble w-8 h-8 bg-white/50 absolute left-3/4 top-1/2 animate-float animate-drift"
            style={{ animationDelay: '1s' }}
          />
          {/* Bubble 3 */}
          <span
            className="bubble w-4 h-4 bg-white/50 absolute left-1/2 top-3/4 animate-float animate-drift"
            style={{ animationDelay: '2s' }}
          />

          <Outlet />
        </main>

        {/* Footer in darker sea-blue */}
        <footer className="bg-sea-700 text-sand-100 py-6">
          <Footer />
        </footer>
    

      {/* WhatsApp on all non-admin pages */}
      <WhatsAppFloatingButton />
    </div>
  );
};

export default Layout;
