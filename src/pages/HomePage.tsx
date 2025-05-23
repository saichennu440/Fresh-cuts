// src/pages/HomePage.tsx
import React, { useEffect } from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CustomerReviews from '../components/home/CustomerReviews';
import Categories from '../components/home/Categories';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'FreshCuts | Premium Raw Meat E-Commerce';
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero with wave at bottom */}
      <section className="relative bg-sea-100">
        <HeroCarousel />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-wave pointer-events-none" />
      </section>

      {/* Features - on sand background */}
      <section className="py-12 bg-sand-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-sea-700" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Premium Quality',
              desc: 'Ethically sourced meats of the highest quality, fresh and ready to cook.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-sea-700" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Fast Delivery',
              desc: 'Same-day delivery to ensure maximum freshness and convenience.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-sea-700" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/>
                </svg>
              ),
              title: 'Secure Packaging',
              desc: 'Advanced packaging to maintain proper temperature and hygiene.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-sea-800">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <Categories />

      {/* Featured Products */}
      <section className="py-12 bg-sand-50">
        <FeaturedProducts />
      </section>

      {/* Customer Reviews */}
      <section className="py-12 bg-white">
        <CustomerReviews />
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sea-600 text-sand-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Premium Quality Meat?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers who trust FreshCuts for their meat needs.
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-3 bg-sand-50 text-sea-600 font-semibold rounded-md transition transform hover:scale-105"
          >
            Shop Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
