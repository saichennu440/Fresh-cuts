import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Database } from '../../utils/database.types';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useToast } from '../../contexts/ToastContext';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      showToast('Please login to add items to cart', 'info');
      return;
    }

    addToCart(product, 1);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.02]">
      <Link to={`/products/${product.id}`}>
        <div className="relative">
          <img
            src={product.image_url || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full ${
                isInWishlist(product.id)
                  ? 'text-red-500 bg-white/90'
                  : 'text-gray-600 bg-white/90 hover:text-red-500'
              } transition`}
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full text-primary-600 bg-white/90 hover:text-primary-700 transition"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
          {product.is_featured && (
            <div className="absolute top-2 left-2 bg-accent-500 text-white text-xs px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 capitalize px-2 py-1 bg-gray-100 rounded">
              {product.category}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;