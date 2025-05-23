import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Your Wishlist | FreshCuts';
    
    // Redirect to login if not authenticated
    if (!user && !loading) {
      showToast('Please login to view your wishlist', 'info');
      navigate('/login', { state: { from: '/wishlist' } });
    }
  }, [user, loading, navigate, showToast]);

  const handleAddToCart = (productId: string) => {
    const item = wishlist.find((item) => item.product_id === productId);
    if (item) {
      addToCart(item.product, 1);
      showToast(`${item.product.name} added to cart`, 'success');
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    showToast('Item removed from wishlist', 'info');
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        <div className="animate-pulse">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="h-8 bg-gray-300 w-1/3 mb-4 rounded"></div>
            <div className="h-24 bg-gray-300 w-full mb-4 rounded"></div>
            <div className="h-24 bg-gray-300 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Heart size={64} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            You haven't added any products to your wishlist yet.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-sea-600 text-white rounded-md hover:bg-sea-700 transition inline-flex items-center"
          >
            <ShoppingCart size={18} className="mr-2" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <Link to={`/products/${item.product_id}`}>
                    <img
                      src={item.product.image_url || 'https://via.placeholder.com/300'}
                      alt={item.product.name}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-4">
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(item.product_id)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-sea-600 text-white rounded-md hover:bg-sea-700 transition text-sm"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.product_id)}
                        className="px-3 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/products"
                className="inline-flex items-center text-sea-600 hover:text-sea-700"
              >
                <ArrowRight size={16} className="mr-2 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;