import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const CartPage: React.FC = () => {
  const { cart,  removeFromCart, updateQuantity, loading } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Your Cart | FreshCuts';
  }, []);

  const handleCheckout = () => {
    if (!user) {
      showToast('Please login to proceed to checkout', 'info');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'info');
      return;
    }

    navigate('/checkout');
  };

  const handleQuantityChange = (productId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    updateQuantity(productId, newQty);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="animate-pulse">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="h-8 bg-gray-300 w-1/3 mb-4 rounded"></div>
            <div className="h-24 bg-gray-300 w-full mb-4 rounded"></div>
            <div className="h-24 bg-gray-300 w-full rounded"></div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-8 bg-gray-300 w-1/4 mb-4 rounded"></div>
            <div className="h-6 bg-gray-300 w-full mb-3 rounded"></div>
            <div className="h-6 bg-gray-300 w-full mb-3 rounded"></div>
            <div className="h-10 bg-gray-300 w-full mt-6 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingTotal = cart.reduce((sum, item) => sum + (item.product.shipping_price || 0) * item.quantity, 0);
  const packingTotal = cart.reduce((sum, item) => sum + (item.product.packing_price || 0) * item.quantity, 0);
  const grandTotal = subtotal + shippingTotal + packingTotal;

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-sea-500 text-white rounded-md hover:bg-sea-600 transition inline-flex items-center"
          >
            <ShoppingBag size={18} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Cart Items</h2>
                
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.product_id} className="py-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 sm:mr-6 mb-4 sm:mb-0">
                        <img
                          src={item.product.image_url || 'https://via.placeholder.com/150'}
                          alt={item.product.name}
                          className="w-full sm:w-32 h-32 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <Link 
                          to={`/products/${item.product_id}`} 
                          className="text-lg font-medium hover:text-sea-600 transition"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-gray-500 text-sm mb-2 capitalize">
                          {item.product.category}
                        </p>
                        <p className="text-xl font-bold mb-4">
                          ₹{item.product.price.toFixed(2)}
                        </p>
                         <p className="text-gray-600 text-sm mb-1">
                          Shipping: ₹{(item.product.shipping_price || 0).toFixed(2)}
                        </p>
                        <p className="text-gray-600 text-sm mb-4">
                          Packing: ₹{(item.product.packing_price || 0).toFixed(2)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item.product_id, item.quantity, -1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.product_id, item.quantity, 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Total</span>
                  <span className="font-medium">₹{shippingTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Packing Total</span>
                  <span className="font-medium">₹{packingTotal.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-gray-800 font-semibold">Total</span>
                  <span className="text-xl font-bold">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full mt-6 px-6 py-3 bg-sea-500 text-white rounded-md hover:bg-sea-600 transition flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="ml-2" />
              </button>
              
              <div className="mt-6">
                <Link
                  to="/products"
                  className="text--500 hover:text-sea-700 flex items-center justify-center"
                >
                  <ArrowRight size={16} className="mr-2 rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;