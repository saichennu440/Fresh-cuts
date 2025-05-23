// src/components/layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut, isAdmin }      = useAuth();
  const { cartCount }                   = useCart();
  const navigate                        = useNavigate();

  // on-scroll handler
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-gradient-to-r from-sea-200 to-sea-300 bg-opacity-90 backdrop-blur-sm shadow-md py-4'
          : 'bg-transparent py-6'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* logo */}
        <Link to="/" className="flex items-center">
          <div className="bg-white rounded-full p-1 shadow-sm">
            {/* your beef icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="text-red-900"
            >
              <circle cx="12.5" cy="8.5" r="2.5" />
              <path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z"/>
              <path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.24-5c2.38-2.4 3.2-3 4.34-5.4a6.5 6.5 0 0 1 9.4-5.6Z"/>
            </svg>
          </div>
          <span className="ml-2 font-bold text-2xl text-teal-800">FreshCuts</span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { to: '/products', label: 'Products' },
            { to: '/pickles',  label: 'Pickles'   },
            ...(user ? [{ to: '/my-orders', label: 'My Orders' }] : []),
            ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-gray-700 hover:text-teal-700 font-medium transition transform hover:scale-105"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* icons & profile */}
        <div className="flex items-center space-x-4">
          {user && (
            <Link to="/wishlist" className="text-gray-700 hover:text-teal-700 transition transform hover:scale-110">
              <Heart size={24} />
            </Link>
          )}
          <Link to="/cart" className="relative text-gray-700 hover:text-teal-700 transition transform hover:scale-110">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative">
              <button onClick={() => setIsProfileOpen(o => !o)}
                      className="text-gray-700 hover:text-teal-700 transition transform hover:scale-110">
                <User size={24} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.email}</div>
                  <Link to="/my-orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}>
                    My Orders
                  </Link>
                  <button onClick={handleSignOut}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login"
                  className="text-gray-700 hover:text-teal-700 font-medium transition transform hover:scale-105">
              Login
            </Link>
          )}

          {/* mobile menu toggle */}
          <button onClick={() => setIsMenuOpen(o => !o)} className="md:hidden text-gray-700 hover:text-red-800">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 500 20" preserveAspectRatio="none" className="block w-full h-5">
          <path d="M0,20 C150,0 350,40 500,20 L500,00 L0,0 Z" fill="white" />
        </svg>
      </div>

      {/* mobile nav */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 flex flex-col items-center space-y-4 z-50">
          {[
            { to: '/products', label: 'Products' },
            { to: '/pickles',  label: 'Pickles'   },
            ...(user ? [{ to: '/my-orders', label: 'My Orders' }] : []),
            ...(user ? [{ to: '/wishlist',  label: 'Wishlist'  }] : []),
            !user  ? [{ to: '/login',    label: 'Login'     }] : [],
            ...(isAdmin ? [{ to: '/admin',   label: 'Admin'     }] : []),
          ]
            .flat()
            .map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block py-2 text-gray-700 hover:text-teal-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          {user && (
            <button
              onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
              className="flex items-center py-2 text-gray-700 hover:text-teal-700 font-medium"
            >
              <LogOut size={18} className="mr-2" /> Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
