import React from 'react';

const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="prose max-w-none">
          <p className="mb-4">
            At Fresh Cuts, we understand the importance of timely and safe delivery of your 
            orders. Our shipping policy is designed to ensure you receive fresh, high-quality 
            products right at your doorstep.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Delivery Areas</h2>
          <p className="mb-4">
            We currently deliver to selected areas within major cities. Enter your pincode 
            on the checkout page to check if delivery is available in your area.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Delivery Times</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Standard Delivery: Within 24 hours</li>
            <li>Express Delivery: Same day (order before 11 AM)</li>
            <li>Scheduled Delivery: Choose your preferred time slot</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping Charges</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Free delivery on orders above ₹1000</li>
            <li>Standard delivery: ₹50</li>
            <li>Express delivery: ₹100</li>
            <li>Additional charges may apply for remote areas</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Order Tracking</h2>
          <p className="mb-4">
            Once your order is confirmed, you will receive:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Order confirmation email</li>
            <li>SMS updates about order status</li>
            <li>Live tracking link</li>
            <li>Delivery confirmation</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Quality Assurance</h2>
          <p className="mb-4">
            We maintain strict quality control measures during shipping:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Temperature-controlled packaging</li>
            <li>Vacuum-sealed products</li>
            <li>Hygienic handling</li>
            <li>Quality checks before dispatch</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Failed Delivery</h2>
          <p className="mb-4">
            In case of failed delivery:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>We will attempt delivery twice</li>
            <li>You will be notified via SMS/email</li>
            <li>Order will be cancelled if undelivered</li>
            <li>Refund will be processed within 7 days</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="mb-4">
            For any shipping-related queries, please contact us at:
          </p>
          <ul className="list-none">
            <li>Email: shipping@freshcuts.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Meat Street, Fresh City, FC 12345</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;