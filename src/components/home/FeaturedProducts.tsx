import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useToast } from '../../contexts/ToastContext';
import { Database } from '../../utils/database.types';

type Product = Database['public']['Tables']['products']['Row'];

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        showToast('Failed to load featured products', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showToast]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      showToast('Please login to add items to cart', 'info');
      return;
    }

    addToCart(product, 1);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleWishlist = (product: Product) => {
    if (!user) {
      showToast('Please login to add items to wishlist', 'info');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToast(`${product.name} removed from wishlist`, 'info');
    } else {
      addToWishlist(product);
      showToast(`${product.name} added to wishlist`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-5 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
      
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No featured products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.02]"
            >
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.image_url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-sea-600 transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleWishlist(product)}
                      className={`p-2 rounded-full ${
                        isInWishlist(product.id)
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 bg-gray-100 hover:text-red-500 hover:bg-red-50'
                      } transition`}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={18} />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 rounded-full text-sea-600 bg-sea-50 hover:bg-sea-100 transition"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center mt-12">
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-sea-500 hover:bg-sea-600 text-white rounded-md transition transform hover:scale-105 font-semibold"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;