import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-beef mr-2"
              >
                <circle cx="12.5" cy="8.5" r="2.5" />
                <path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z" />
                <path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.24-5c2.38-2.4 3.2-3 4.34-5.4a6.5 6.5 0 0 1 9.4-5.6Z" />
              </svg>
              <h2 className="text-xl font-bold">FreshCuts</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Premium raw meat delivered fresh to your doorstep. Quality you can trust.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-sea-400 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-sea-400 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-sea-400 transition">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/pickles" className="text-gray-300 hover:text-white transition">
                  Pickles
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-gray-300 hover:text-white transition">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

           <div>
            <h3 className="text-xl font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone size={18} className="mr-2 mt-1" />
                <p className="text-gray-300">+91 8184932229</p>
              </div>
              <div className="flex items-start">
                <Mail size={18} className="mr-2 mt-1" />
                <p className="text-gray-300">info@freshcuts.com</p>
              </div>
              <div>
                <a
                  href="https://wa.me/8184932229"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M17.6 6.4A7.96 7.96 0 0 0 12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8c1.7 0 3.3-.5 4.6-1.5l4.4 1.1-1.1-4.2c1-1.4 1.5-3.1 1.5-4.8 0-2.2-.9-4.2-2.4-5.7"/>
                    <path d="m12 8 1 1 2-2"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FreshCuts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;