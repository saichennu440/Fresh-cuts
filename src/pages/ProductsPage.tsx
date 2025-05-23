import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import ProductCard from '../components/ui/ProductCard';
import { Database } from '../utils/database.types';
import { Search, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

type Product = Database['public']['Tables']['products']['Row'];

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  //const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  // initialize from URL (fallback to "all")
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get('category') ?? 'all'
  );

  // on mount, and whenever the URL’s ?category changes, update our filter
  useEffect(() => {
    document.title = 'Products | FreshCuts';
    fetchProducts();

    const cat = searchParams.get('category') ?? 'all';
    setSelectedCategory(cat);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        //.neq('category', 'pickle') // Exclude pickles
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
      
      // Extract unique categories
      if (data) {
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search, category, and sort
  const filteredProducts = products
    .filter((product) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => 
      selectedCategory === 'all' || product.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-2">Fresh Meat Products</h1>
      <p className="text-gray-600 mb-8">
        Browse our selection of premium quality raw meats
      </p>

      {/* Search and Filters */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              //onChange={(e) => setSelectedCategory(e.target.value)}
               onChange={(e) => {
          setSelectedCategory(e.target.value);
          // also keep the URL in sync if you want back/forward to work:
          searchParams.set('category', e.target.value);
          // note: useSearchParams’s setter would be `setSearchParams(searchParams)`
        }}  
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
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
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSortBy('newest');
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;