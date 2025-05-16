import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Fresh Cuts</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="prose max-w-none">
          <p className="mb-4">
            Welcome to Fresh Cuts, your premier destination for premium quality raw meats and artisanal pickles. 
            Established with a passion for delivering excellence, we take pride in sourcing the finest cuts 
            directly from trusted local farms and producers.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
          <p className="mb-4">
            Founded in 2025, Fresh Cuts was born from a simple vision: to provide households with 
            restaurant-quality meats and handcrafted pickles at their convenience. We understand 
            that quality ingredients are the foundation of every great meal, and we're committed 
            to delivering nothing but the best to your kitchen.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Promise</h2>
          <div className="mb-6">
            <ul className="list-disc pl-6 space-y-2">
              <li>Premium Quality: We source only the highest grade meats from certified suppliers.</li>
              <li>Freshness Guaranteed: Our efficient delivery system ensures your orders arrive fresh.</li>
              <li>Food Safety: We maintain strict quality control and hygiene standards.</li>
              <li>Sustainability: We work with farms that practice sustainable and ethical farming.</li>
              <li>Customer Satisfaction: Your satisfaction is our top priority.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Products</h2>
          <p className="mb-4">
            From premium cuts of beef, pork, and poultry to our signature line of artisanal pickles, 
            every product in our catalog is carefully selected and prepared to meet our exacting standards. 
            We believe in transparency, which is why we provide detailed information about the source and 
            quality of each product.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            Have questions or feedback? We'd love to hear from you. Reach out to our customer service team:
          </p>
          <ul className="list-none mt-2">
            <li>Email: info@freshcuts.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Meat Street, Fresh City, FC 12345</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;