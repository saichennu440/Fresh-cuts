import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import ProductCard from '../components/ui/ProductCard';
import { Database } from '../utils/database.types';
import { Search } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];

const PicklesPage: React.FC = () => {
  const [pickles, setPickles] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    document.title = 'Pickles | FreshCuts';
    fetchPickles();
  }, []);

  const fetchPickles = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'pickle')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPickles(data || []);
    } catch (error) {
      console.error('Error fetching pickles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter pickles based on search and sort
  const filteredPickles = pickles
    .filter((pickle) => 
      pickle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pickle.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      <h1 className="text-3xl font-bold mb-2">Homemade Pickles</h1>
      <p className="text-gray-600 mb-8">
        Discover our selection of homemade pickles - the perfect accompaniment to your meat dishes
      </p>

      {/* Search and Filters */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pickles..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
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

      {/* Banner */}
      <div className="mb-8 bg-accent-50 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-accent-800 mb-2">
            The Perfect Pairing
          </h2>
          <p className="text-accent-700">
            Our handcrafted pickles are made using traditional recipes and the freshest ingredients.
            They complement our meat products perfectly!
          </p>
        </div>
        <img
          src="https://images.pexels.com/photos/5718014/pexels-photo-5718014.jpeg"
          alt="Assorted pickles"
          className="w-32 h-32 object-cover rounded-full mt-4 md:mt-0"
        />
      </div>

      {/* Pickles Grid */}
      {loading ? (
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
      ) : filteredPickles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredPickles.map((pickle) => (
            <ProductCard key={pickle.id} product={pickle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No pickles found matching your search.</p>
          <button
            onClick={() => {
              setSearchTerm('');
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

export default PicklesPage;