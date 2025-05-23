import React, { useEffect } from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CustomerReviews from '../components/home/CustomerReviews';
import {Categories} from '../components/home/Categories';
const HomePage: React.FC = () => {
  useEffect(() => {
    // Set page title
    document.title = 'FreshCuts | Premium Raw Meat E-Commerce';
  }, []);

  return (
    <div>
      <HeroCarousel />
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-red-800" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Ethically sourced meats of the highest quality, fresh and ready to cook.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-red-800" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Same-day delivery to ensure maximum freshness and convenience.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-red-800" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Packaging</h3>
              <p className="text-gray-600">
                Advanced packaging to maintain proper temperature and hygiene.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Categories />
      <FeaturedProducts />
      <CustomerReviews />
      <div className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Premium Quality Meat?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust FreshCuts for their meat needs.
          </p>
          <a 
            href="/products" 
            className="inline-block px-8 py-3 bg-white text-primary-600 font-semibold rounded-md transition transform hover:scale-105 hover:bg-gray-100"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;