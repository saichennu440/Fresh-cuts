import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="prose max-w-none">
          <p className="mb-4">
            Welcome to Fresh Cuts. By accessing and using our website, you agree to comply 
            with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. General Terms</h2>
          <p className="mb-4">
            By using our website, you confirm that you are at least 18 years old and have 
            the legal capacity to enter into binding contracts. You agree to provide accurate 
            and complete information when creating an account or placing orders.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Products and Pricing</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>All products are subject to availability</li>
            <li>Prices are in Indian Rupees (INR) and include applicable taxes</li>
            <li>We reserve the right to modify prices without prior notice</li>
            <li>Product images are for illustration purposes only</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Orders and Payment</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Orders are subject to acceptance and confirmation</li>
            <li>Payment must be made in full at the time of ordering</li>
            <li>We accept payments through secure payment gateways</li>
            <li>All payment information is encrypted and secure</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Delivery</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Delivery times are estimates and not guaranteed</li>
            <li>We are not responsible for delays beyond our control</li>
            <li>Risk of loss transfers upon delivery</li>
            <li>Please inspect products upon delivery</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Returns and Refunds</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Returns must be initiated within 24 hours of delivery</li>
            <li>Products must be unused and in original packaging</li>
            <li>Refunds will be processed within 7-10 business days</li>
            <li>Shipping charges are non-refundable</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Account Security</h2>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account 
            credentials and for all activities under your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
          <p className="mb-4">
            All content on our website is protected by copyright and other intellectual 
            property rights owned by or licensed to Fresh Cuts.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            We shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising from your use of our services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our Terms & Conditions, please contact us at:
          </p>
          <ul className="list-none">
            <li>Email: legal@freshcuts.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Meat Street, Fresh City, FC 12345</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;