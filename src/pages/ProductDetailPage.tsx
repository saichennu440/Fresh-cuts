import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Database } from '../utils/database.types';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { Heart, ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Fetch the product
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setProduct(data);
      document.title = `${data.name} | FreshCuts`;
      
      // Fetch related products (same category)
      if (data) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(4);

        if (!relatedError && relatedData) {
          setRelatedProducts(relatedData);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showToast('Failed to load product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please login to add items to cart', 'info');
      return;
    }

    if (product) {
      addToCart(product, quantity);
      showToast(`${quantity} × ${product.name} added to cart`, 'success');
    }
  };

  const handleWishlist = () => {
    if (!user) {
      showToast('Please login to add items to wishlist', 'info');
      return;
    }

    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        showToast(`${product.name} removed from wishlist`, 'info');
      } else {
        addToWishlist(product);
        showToast(`${product.name} added to wishlist`, 'success');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 w-1/3 mb-4 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded-lg"></div>
            <div>
              <div className="h-8 bg-gray-300 w-3/4 mb-4 rounded"></div>
              <div className="h-4 bg-gray-300 w-1/4 mb-4 rounded"></div>
              <div className="h-32 bg-gray-300 w-full mb-6 rounded"></div>
              <div className="h-12 bg-gray-300 w-full mb-4 rounded"></div>
              <div className="h-12 bg-gray-300 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6 text-sm">
        <Link to="/" className="text-gray-500 hover:text-primary-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={product.category === 'pickle' ? '/pickles' : '/products'}
          className="text-gray-500 hover:text-primary-600"
        >
          {product.category === 'pickle' ? 'Pickles' : 'Products'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Image */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={product.image_url || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full text-sm">
              {product.category}
            </span>
            {product.is_featured && (
              <span className="ml-2 bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm">
                Featured
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="text-3xl font-bold text-gray-900 mb-6">
            ₹{product.price.toFixed(2)}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="text-gray-700 mr-4">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 text-center border-none focus:ring-0"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`flex items-center justify-center px-6 py-3 rounded-md transition ${
                isInWishlist(product.id)
                  ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart
                size={18}
                className="mr-2"
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
              />
              {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="ml-2 capitalize">{product.category}</span>
              </div>
              <div>
                <span className="text-gray-600">SKU:</span>
                <span className="ml-2">{product.id.toString().slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={relatedProduct.image_url || 'https://via.placeholder.com/300'}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">{relatedProduct.name}</h3>
                  <p className="text-gray-900 font-bold">
                    ₹{relatedProduct.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;